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
    stylesheets: [
        './css/normalize.css',
        './css/typography.css',
        './css/calendar.css',
        './css/main.css'
    ],
    scripts: [
        './js/polyfills.js',
        './js/vendors.js',
        './js/app.js'
    ]
};

console.log( html(
    renderToStaticMarkup(
        createElement(Page, options,
            DOM.div({id: 'main', className: 'mnmo-root'},
                DOM.p(null, 'carregando...')
            )
        )
    )
) );
