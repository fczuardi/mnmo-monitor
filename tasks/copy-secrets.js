#!/usr/bin/env node

require('shelljs/global')
var urls = require('../../monitor-traditional/_dev/urls');

// "copy:secret:config": "cp -R ../monitor-traditional/_dev/config ../monitor-traditional/_dev/locales ./ ",
// "copy:secret:assets": "mkdir -p ./assets/custom/classic/ && cp ../monitor-traditional/img/*.png ../monitor-traditional/img/*.jpg ./assets/custom/classic/.",
cp('-R', '../monitor-traditional/_dev/config', '../monitor-traditional/_dev/locales', './');
sed('-i', 'BASE_URL', urls[process.env.NODE_ENV], './config/secret.endpoints.js');
mkdir('-p', './assets/custom/classic/');
cp('../monitor-traditional/img/*.png', '../monitor-traditional/img/*.jpg', './assets/custom/classic/.');
