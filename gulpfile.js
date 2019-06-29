'use strict';

const gulp = require('gulp');
const bower = require('gulp-bower');
const replace = require('gulp-replace');
const del = require('del');
const fs = require('fs');
const git = require('gulp-git');
const exec = require('child_process').exec;
const data = require('./catalog.json');
const dist = __dirname + '/dist';

// Analyzer stuff.
const {Analyzer, FsUrlLoader, PackageUrlResolver, generateAnalysis} = require('polymer-analyzer');

function clean() {
  return del([dist]);
}

function make() {
  const packages = data.packages;

  return Promise.all(
    Object.keys(packages).map(repo => new Promise((resolve, reject) => {

      // The plan: copy all the elements and their deps into `/dist`.
      const path = `${dist}/${repo}`;

      // Reject if there's nothing to clone.
      if (!packages[repo].git) {
        reject();
      }

      // Step 1. Clone the element.
      git.clone(packages[repo].git, {args: '--depth 1 -- ' + path}, function(err) {
        if (err) {
          reject(err);
        }

        // Step 2. Delete the .git from it. Be very careful not to
        // Delete your own .git repo 🙄.
        del([path + '/.git']);
        del([path + '/.gitignore']);

        // Step 3. Read the main field from bower.
        const bowerjson = JSON.parse(fs.readFileSync(path + '/bower.json'));
        const inputs = bowerjson.main.filter(name => !name.startsWith('theme'));

        // Step 4. bower install the element's dependencies.
        bower({cwd: path, verbosity: 1}).on('end', function() {

          // Step 5. Copy the element in its bower_components, so that the demo works.
          gulp.src(path + '/**').pipe(gulp.dest(`${path}/bower_components/${repo}`));

          // Step 6. Run analyzer.
          const analyzer = new Analyzer({
            urlLoader: new FsUrlLoader(path),
            urlResolver: new PackageUrlResolver({packageDir: path}),
          });

          analyzer.analyze(inputs).then(function(analysis) {
            var blob = JSON.stringify(generateAnalysis(analysis, analyzer.urlResolver));
            fs.writeFileSync(path + '/analysis.json', blob);

            // Step 6. Write docs.
            const docsFile =
`
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
  <title>${repo}</title>
  <link rel="import" href="./bower_components/polymer/polymer.html">
  <link rel="import" href="./bower_components/iron-ajax/iron-ajax.html">
  <link rel="import" href="./bower_components/iron-doc-viewer/iron-doc-viewer.html">
  <link rel="import" href="./bower_components/iron-doc-viewer/default-theme.html">
  <script src="./bower_components/webcomponentsjs/webcomponents-loader.js"></script>
</head>
<body>
  <!-- "custom-style" does not work with "iron-doc-default-theme" in FF -->
  <dom-module id="x-doc-viewer">
    <template>
      <style include="iron-doc-default-theme"></style>
      <iron-ajax auto url="./analysis.json" last-response="{{response}}" handle-as="json"></iron-ajax>
      <iron-doc-viewer descriptor="[[response]]" style="max-width: 60em; margin: 0 auto"></iron-doc-viewer>
    </template>
    <script>
      window.addEventListener('WebComponentsReady', function() {
        Polymer({
          is: "x-doc-viewer"
        });
      });
    </script>
  </dom-module>
  <x-doc-viewer></x-doc-viewer>
</body>
</html>
`;
            fs.writeFileSync(path + '/index.html', docsFile);

            // Step 7. Tweak demos: hide nav, we will re-create it.
            const helpers = 'bower_components/vaadin-demo-helpers';
            gulp.src(`${path}/${helpers}/vaadin-component-demo.html`)
              .pipe(replace('<vaadin-tabs', '<vaadin-tabs style="display: none"'))
              .pipe(gulp.dest(`${path}/${helpers}`));

            resolve();
          });
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
      resolve();
    });
  });
}

function copy() {
  return gulp.src(__dirname + '/dist/**/*').pipe(gulp.dest(`${__dirname}/build/es6-bundled/dist/`));
}

gulp.task('default', gulp.series(clean, make, build, copy));

// Note: this assume your local 'dist' folder is ok (you've ran "make" in the past)
gulp.task('debug', gulp.series(build, copy));
