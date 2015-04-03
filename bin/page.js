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
        '$comment=polyfills',
        './lib/js/react.js',
        './lib/js/flummox.js',
        './lib/js/flummox-component.js',
        '$comment=flummox',
        './lib/js/react-intl.js',
        '$comment=reactintl',
        './lib/js/lodash-merge.js',
        './lib/js/component-shared.js',
        './lib/js/component-stage.js',
        './lib/js/component-drawer.js',
        './lib/js/component-centeredbox.js',
        './lib/js/component-fieldset.js',
        './lib/js/component-textinput.js',
        './lib/js/component-select.js',
        './lib/js/component-checkbox.js',
        './lib/js/component-radio.js',
        './lib/js/component-radiogroup.js',
        './lib/js/component-submit.js',
        './lib/js/component-list.js',
        './lib/js/component-li.js',
        './lib/js/component-a.js',
        './lib/js/component-switch.js',
        '$comment=mnmo-components',
        './js/entrypoints.js',
        './js/apiHelpers.js',
        './js/actions/country.js',
        './js/actions/user.js',
        './js/actions/loginValidation.js',
        './js/actions/session.js',
        '$comment=actions',
        './lib/js/local.js',
        './js/stores/country.js',
        './js/stores/user.js',
        './js/stores/loginValidation.js',
        './js/stores/session.js',
        '$comment=stores',
        './js/menulinks.js',
        './js/components/menu.js',
        './js/components/login.js',
        './js/components/dashboard.js',
        './js/components/router.js',
        '$comment=components',
        './js/flux.js',
        './js/app.js',
        '$comment=app'
    ]
};

console.log( 
html(
    renderToStaticMarkup(
        createElement(Page, options,
            DOM.div({id: 'main', className: 'mnmo-root'},
                DOM.p(null, 'carregando...')
            )
        )
    )
).replace(/(<script[^\"]*\"\$comment\=)([^\"]*)(\">[^>]*>)/ig,'<!-- $2 -->\n')
);
