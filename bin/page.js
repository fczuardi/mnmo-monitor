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
    stylesheets: [
        './lib/css/normalize.css',
        './lib/css/typography.css',
        './css/main.css'
    ],
    scripts: [
        './lib/js/es5-shim.js',
        './lib/js/es5-sham.js',
        './lib/js/console-polyfill.js',
        './lib/js/Intl.js',
        './lib/js/react.js',
        './lib/js/react-intl.js',
        './lib/js/component-stage.js',
        './lib/js/component-centeredbox.js',
        './lib/js/component-fieldset.js',
        './lib/js/component-textinput.js',
        './lib/js/component-select.js',
        './lib/js/component-checkbox.js',
        './lib/js/component-submit.js',
        './js/app.js'
    ]
};

console.log( html(
    renderToStaticMarkup(
        createElement(Page, options, 
            DOM.div({id:'main', className: 'mnmo-root'},
                DOM.p(null, 'carregando...')
            )
        )
    )
) );