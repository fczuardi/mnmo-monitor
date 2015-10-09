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
        './css/data-table.css',
        './css/calendar.css',
        './css/main.css'
    ],
    scripts: [
        './js/polyfills.js',
        './js/vendors.js',
        './js/app.js'
    ]
};

var analyticsHTML = `
    <!-- Google Analytics -->
    <script>
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='https://www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
    </script>
`;

console.log( html(
    renderToStaticMarkup(
        createElement(Page, options,
            DOM.div({id: 'main', className: 'mnmo-root'},
                DOM.p(null, 'carregando...')
            )
        )
    ).replace(/(<\/body>)/ig, analyticsHTML + '$1')
) );
