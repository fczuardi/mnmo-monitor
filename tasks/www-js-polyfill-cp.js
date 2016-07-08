#!/usr/bin/env node

require('shelljs/global')

// Shell script to copy the polyfills that don't need preprocessing
// polyfills that are already browser-ready, like in UMD format or
// other similar approachs, this list includes polyfills for:
//
// - Promise (lie)
// - fetch (whatwg-fetch)
// - es5-shim (es5-shim)
// - es5-sham (es5-shim)
// - console (console-polyfill)
// - Intl (intl)

console.log('cp -f ./node_modules/lie/dist/lie.polyfill.js ./dist/classic/lib/js/promise-polyfill.js');
cp('-f', './node_modules/lie/dist/lie.polyfill.js', './dist/classic/lib/js/promise-polyfill.js');

console.log('cp ./node_modules/whatwg-fetch/fetch.js ./dist/classic/lib/js/fetch-polyfill.js');
cp('./node_modules/whatwg-fetch/fetch.js', './dist/classic/lib/js/fetch-polyfill.js');

console.log('cp node_modules/es5-shim/es5-shim.js ./dist/classic/lib/js/.');
cp('node_modules/es5-shim/es5-shim.js', './dist/classic/lib/js/.');

console.log('cp node_modules/es5-shim/es5-sham.js ./dist/classic/lib/js/.');
cp('node_modules/es5-shim/es5-sham.js', './dist/classic/lib/js/.');

console.log('cp node_modules/console-polyfill/index.js ./dist/classic/lib/js/console-polyfill.js');
cp('node_modules/console-polyfill/index.js', './dist/classic/lib/js/console-polyfill.js');

console.log('cp ./node_modules/intl/dist/Intl.js ./node_modules/intl/dist/Intl.js.map ./node_modules/intl/locale-data/jsonp/en-US.js node_modules/intl/locale-data/jsonp/es-ES.js node_modules/intl/locale-data/jsonp/pt-BR.js ./dist/classic/lib/js/.');
cp('./node_modules/intl/dist/Intl.js',
'./node_modules/intl/dist/Intl.js.map',
'./node_modules/intl/locale-data/jsonp/en-US.js',
'node_modules/intl/locale-data/jsonp/es-ES.js',
'node_modules/intl/locale-data/jsonp/pt-BR.js',
'./dist/classic/lib/js/.'
);

// "www:js:polyfill":
// "npm run www:js:polyfill:raf && ok
// npm run www:js:polyfill:object-assign && ok
// npm run www:js:polyfill:Promise && TBD
// npm run www:js:polyfill:fetch && TBD
// npm run www:js:polyfill:es5-shim && TBD
// npm run www:js:polyfill:es5-sham && TBD
// npm run www:js:polyfill:console && TBD
// npm run www:js:polyfill:Intl", TBD
