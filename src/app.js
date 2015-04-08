//The main script
import {render, createElement} from 'react';
import FluxComponent from 'flummox/component';
import Flux from './flux';
import Stage from 'mnmo-components/lib/themes/mnmo/stage';
import Router from './components/router';

const flux = new Flux();

render(
    createElement(Stage, null,
        createElement(FluxComponent, {
                flux: flux,
                connectToStores: {
                    language: (store) => ({ language: store.state}),
                    country: (store) => ({ country: store.state}),
                    user: (store) => ({ user: store.state}),
                    loginValidation: (store) => ({ loginForm: store.state}),
                    session: (store) => ({ session: store.state}),
                    ui: (store) => ({ ui: store.state})
                }
            },
            createElement(Router)
        )
    ),
    document.getElementById('main')
);
