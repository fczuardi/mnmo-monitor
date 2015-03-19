// Generate the main html page for the derived project project-traditional
import {
    DOM,
    createElement, 
    renderToStaticMarkup
} from 'react';
import {html} from 'js-beautify';

import {Page} from 'mnmo-components';

var options = {
    title: 'unbundled webapp',
    scripts: [
        './lib/js/es5-shim.js',
        './lib/js/es5-sham.js',
        './lib/js/console-polyfill.js',
        './lib/js/react.js',
        './lib/js/component-checkbox.js',
        './lib/js/component-fieldset.js',
        './lib/js/component-textinput.js',
        './js/app.js'
    ]
};

console.log( html(
    renderToStaticMarkup(
        createElement(Page, options, 
            DOM.div({id:'main'},
                DOM.p(null, 'carregando...')
            )
        )
    )
) );