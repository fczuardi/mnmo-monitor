// Generate the main html page for local development
import {
    DOM,
    createElement, 
    renderToStaticMarkup
} from 'react';
import {html} from 'js-beautify';

import {Page} from 'mnmo-components';

var options = {
    title: 'bundled webapp',
    scripts: [
        './js/polyfills.js',
        './js/vendors.js',
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