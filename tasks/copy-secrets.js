#!/usr/bin/env node

require('shelljs/global')

// "copy:secret:config": "cp -R ../monitor-traditional/_dev/config ../monitor-traditional/_dev/locales ./ ",
// "copy:secret:assets": "mkdir -p ./assets/custom/classic/ && cp ../monitor-traditional/img/*.png ../monitor-traditional/img/*.jpg ./assets/custom/classic/.",
cp('-R', '../monitor-traditional/_dev/config', '../monitor-traditional/_dev/locales', './');
mkdir('-p', './assets/custom/classic/');
cp('../monitor-traditional/img/*.png', '../monitor-traditional/img/*.jpg', './assets/custom/classic/.');
