import {join} from 'path';
import {createWriteStream} from 'fs';
import browserify from 'browserify';
// import browserifyShim from 'browserify-shim';
import packageJSON from '../package.json';

let globalModules = packageJSON['browserify-shim'];
let modulesPath = join(__dirname, '../node_modules/');
let srcPath = join(__dirname, '../src/');
let classicPath = join(__dirname, '../dist/classic');

function createUMD(entry, globalName, outFilename, isES6){
    var b = browserify({standalone: globalName}).add(entry);
    if (isES6) {
        b.transform('babelify');
    }
    b.transform('browserify-shim')
        .bundle()
        .pipe(createWriteStream(outFilename, 'utf8'));
}

Object.keys(globalModules).forEach((key) => {
    if (key.indexOf('mnmo-') !== -1) {
        let entry = join(modulesPath, key + '.js'),
            componentName = entry.replace(/(.*)\/(.*)/, '$2'),
            globalName = globalModules[key].split(':')[1],
            outFilename = join(classicPath, 'lib/js/component-' + componentName);
        console.log(outFilename, globalName);
        createUMD(entry, globalName, outFilename);
    } else if ((key.indexOf('actions') !== -1) || (key.indexOf('stores') !== -1)){
        let globalName = globalModules[key].split(':')[1],
            entry = join(srcPath, key + '.js'),
            subfolder = key.split('/')[1],
            filename = key.split('/')[2] + '.js',
            outFilename = join(classicPath, 'js', subfolder, filename);
        console.log(outFilename, globalName);
        createUMD(entry, globalName, outFilename, true);
    }
});
