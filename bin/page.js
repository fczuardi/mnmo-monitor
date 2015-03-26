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
        './lib/js/Promise.js',
        './lib/js/fetch.js',
        './lib/js/react-with-addons.js',
        './lib/js/react-intl.js',
        './lib/js/flummox.js',
        './lib/js/flummox-component.js',
        './lib/js/component-shared.js',
        './lib/js/component-stage.js',
        './lib/js/component-centeredbox.js',
        './lib/js/component-fieldset.js',
        './lib/js/component-textinput.js',
        './lib/js/component-select.js',
        './lib/js/component-checkbox.js',
        './lib/js/component-radio.js',
        './lib/js/component-submit.js',
        './lib/js/component-list.js',
        './lib/js/component-li.js',
        './lib/js/local.js',
        './js/entrypoints.js',
        './js/apiHelpers.js',
        './js/actions/country.js',
        './js/stores/country.js',
        './js/actions/user.js',
        './js/stores/user.js',
        './js/actions/loginValidation.js',
        './js/stores/loginValidation.js',
        './js/actions/session.js',
        './js/stores/session.js',
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
