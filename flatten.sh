#!/bin/sh

rm main.js
cat src/lib/**/*.js >> main.js
cat src/**/*.js >> main.js
cat src/*.js >> main.js

git add main.js
cat README.template.md README.md > /tmp/screeps-rover.md
mv /tmp/screeps-rover.md README.md
git add README.md
