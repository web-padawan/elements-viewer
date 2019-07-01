#!/bin/bash -e

# Based on https://github.com/Polymer/tools/blob/master/bin/gp.sh

# This script pushes a demo-friendly version of your element and its
# dependencies to gh-pages.

# Run in a clean directory passing in a GitHub org and repo name
org="web-padawan"
repo="elements-viewer"
#branch="master" # default to master when branch isn't specified

# make folder (same as input, no checking!)
rm -rf $repo
mkdir $repo
git clone git@github.com:$org/$repo.git --single-branch

# switch to gh-pages branch
pushd $repo >/dev/null
git checkout --orphan gh-pages

# install dependencies
npm i

# use bower to install runtime deployment
bower cache clean # ensure we're getting the latest from the desired branch.

# install the bower deps and run build
npm start

# remove the .gitignore since we're going to be pushing deps
git rm -rf ./.gitignore

# do not push node_modules
echo "node_modules" > .gitignore

# copy the build output over
echo "copying things over..."
cp -R build/es6-bundled/* .

git add bower_components -f

git add dist/**/bower_components -f

# send it all to github
git add -A .
git commit -am 'seed gh-pages'
git push -u origin gh-pages --force

popd >/dev/null
