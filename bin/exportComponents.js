import {join} from 'path';
import {createWriteStream} from 'fs';
import browserify from 'browserify';
// import browserifyShim from 'browserify-shim';
import packageJSON from '../package.json';

let globalModules = packageJSON['browserify-shim'];
let modulesPath = join(__dirname,'../node_modules/');

Object.keys(globalModules).forEach((key) => {
    if (key.indexOf('mnmo-') !== -1) {
        let entry = join(modulesPath, key + '.js');
        let componentName = entry.replace(/(.*)\/(.*)/,'$2');
        let outFilename = join(__dirname, '../dist/classic/lib/js/component-' + componentName);
        console.log(outFilename, globalModules[key].split(':')[1]);
        browserify({
            standalone: globalModules[key].split(':')[1]
        })
        .add(entry)
        .transform('browserify-shim')
        .bundle()
        .pipe(createWriteStream(outFilename, 'utf8'));
    }
});
