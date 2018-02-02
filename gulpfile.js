'use strict';

const gulp = require('gulp');
const bower = require('gulp-bower');
const del = require('del');
const fs = require('fs');
const git = require('gulp-git');
const exec = require('child_process').exec;
const data = require('./catalog.json');

function clean() {
  return del([__dirname + '/dist']);
}

function make() {
  const packages = data.packages;

  return Promise.all(
    Object.keys(packages).map(repo => new Promise((resolve, reject) => {

      // The plan: copy all the elements and their deps into `/dist`.
      let path = __dirname + '/dist/' + repo;

      // Reject if there's nothing to clone.
      if (!packages[repo].git) {
        reject();
      }

      // Step 1. Clone the element.
      git.clone(packages[repo].git, {args: '--depth 1 -- ' + path}, function (err) {
        if (err) {
          reject(err);
        }

        // Step 2. Delete the .git from it. Be very careful not to
        // Delete your own .git repo 🙄.
        del([path + '/.git']);
        del([path + '/.gitignore']);

        // Step 3. bower install the element's dependencies.
        console.log('Running bower install in ' + path);
        bower({cwd: path, verbosity: 1}).on('end', function() {
          // Step 4. Copy the element in its bower_components, so that the demo works.
          gulp.src(path + '/**').pipe(gulp.dest(`${path}/bower_components/${repo}`));

          // Step 5. Write docs.
          let docsFile =
`
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
  <title>${repo}</title>
  <link rel="import" href="../../bower_components/iron-ajax/iron-ajax.html">
  <link rel="import" href="../../bower_components/iron-doc-viewer/iron-doc-viewer.html">
  <link rel="import" href="../../bower_components/iron-doc-viewer/default-theme.html">
  <link rel="import" href="../../bower_components/polymer/lib/elements/custom-style.html">
  <link rel="import" href="../../bower_components/polymer/lib/elements/dom-bind.html">
  <script src="../../bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <custom-style>
    <style is="custom-style" include="iron-doc-default-theme"></style>
  </custom-style>
</head>
<body>
  <dom-bind>
    <template>
      <iron-ajax auto url="./analysis.json" last-response="{{response}}" handle-as="json"></iron-ajax>
      <iron-doc-viewer descriptor="[[response]]" style="max-width: 60em; margin: 0 auto"></iron-doc-viewer>
    </template>
  </dom-bind>
</body>
</html>
`;
          fs.writeFileSync(path + '/index.html', docsFile);

          resolve();
        });
      });
    }))
  );
}

function build() {
  return new Promise((resolve, reject) => {
    exec('polymer build', (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      console.log(stdout);
      console.log(stderr);
      resolve();
    });
  });
}

function copy() {
  return gulp.src(__dirname + '/dist/**/*').pipe(gulp.dest(`${__dirname}/build/es6-bundled/dist/`));
}

gulp.task('default', gulp.series(clean, make, build, copy));

// Note: this assume your local 'dist' folder is ok (you've ran make-dist in the past)
gulp.task('debug', gulp.series(build, copy));
