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
        './css/normalize.css'
    ],
    scripts: [
        './js/polyfills.js',
        './js/vendors.js',
        './js/app.js'
    ]
};

var mainStyle = {
        // width: '100%',
        // height: '100%',
        // position: 'absolute',
        // display: 'table',
        // color: 'white',
        // fontFamily: "'Roboto Light', sans-serif",
        // letterSpacing: 0.5,
        // textRendering: 'geometricPrecision',
    backgroundColor: '#070708',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
    backgroundSize: 'cover',
    backgroundImage: 'url(./img/bg01.jpg)'
};

console.log( html(
    renderToStaticMarkup(
        createElement(Page, options, 
            DOM.div({id:'main', style: mainStyle},
                DOM.p(null, 'carregando...')
            )
        )
    )
) );