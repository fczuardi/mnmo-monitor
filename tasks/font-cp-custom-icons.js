#!/usr/bin/env node

// "font:cp:custom-icons": "./bin/downloadCustomEntypo.sh",
var download = require('download-file')
var dir = './assets/fonts/Entypo/';
var url = 'http://file.myfontastic.com/LJwoe4jsYH2RoMHM6ZwrvW/fonts/1449171288'
var filename = 'Custom-Entypo-mnmo';

var callback = function(err) {
  if (err) throw err
  return 'download success';
}

console.log(url);
download(url + '.eot', { directory: dir, filename: filename + '.eot'}, callback);
download(url + '.woff', { directory: dir, filename: filename + '.woff'}, callback);
download(url + '.ttf', { directory: dir, filename: filename + '.ttf'}, callback);
download(url + '.svg', { directory: dir, filename: filename + '.svg'}, callback);

// # Entypo pictograms by Daniel Bruce — www.entypo.com
// curl -o ./assets/fonts/Entypo/Custom-Entypo-mnmo.eot -L https://file.myfontastic.com/LJwoe4jsYH2RoMHM6ZwrvW/fonts/1449171288.eot
// curl -o ./assets/fonts/Entypo/Custom-Entypo-mnmo.woff -L https://file.myfontastic.com/LJwoe4jsYH2RoMHM6ZwrvW/fonts/1449171288.woff
// curl -o ./assets/fonts/Entypo/Custom-Entypo-mnmo.ttf -L https://file.myfontastic.com/LJwoe4jsYH2RoMHM6ZwrvW/fonts/1449171288.ttf
// curl -o ./assets/fonts/Entypo/Custom-Entypo-mnmo.svg -L https://file.myfontastic.com/LJwoe4jsYH2RoMHM6ZwrvW/fonts/1449171288.svg
