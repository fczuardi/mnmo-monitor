#!/usr/bin/env node

require('shelljs/global')

console.log('mkdir -p ./dist/classic/js/styles ./dist/classic/js/components ./dist/classic/js/actions ./dist/classic/js/stores ./dist/classic/css ./dist/classic/lib/js ./dist/classic/lib/css ./dist/classic/lib/fonts ./dist/classic/img');
mkdir(
    '-p',
    './dist/classic/js/styles',
    './dist/classic/js/components',
    './dist/classic/js/actions',
    './dist/classic/js/stores',
    './dist/classic/css',
    './dist/classic/lib/js',
    './dist/classic/lib/css',
    './dist/classic/lib/fonts',
    './dist/classic/img'
);
