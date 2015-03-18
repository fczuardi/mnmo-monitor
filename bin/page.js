// Generate the main html page for the derived project project-traditional
import {
    DOM,
    createElement, 
    renderToStaticMarkup
} from 'react';
import {html} from 'js-beautify';

import {Page} from 'mnmo-components';

var options = {
    title: 'untitled webapp',
    scripts: [
        './lib/js/react.js',
        './lib/js/component-checkbox.js',
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