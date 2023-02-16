#!/bin/sh
# @Author: Robert D. Cotey II <coteyr@coteyr.net>
# @Date:   2020-06-29 13:30:32
# @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
# @Last Modified time: 2020-06-30 00:12:56

rm main.js
cat src/lib/**/*.js >> main.js
cat src/**/*.js >> main.js
cat src/*.js >> main.js

git add main.js
