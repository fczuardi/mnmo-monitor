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
                    passwordValidation: (store) => ({ passwordForm: store.state}),
                    forgotPasswordValidation: (store) => ({ forgotPasswordForm: store.state}),
                    session: (store) => ({ session: store.state}),
                    columns: (store) => ({ columns: store.state}),
                    groups: (store) => ({ groups: store.state}),
                    vars: (store) => ({ vars: store.state}),
                    rows: (store) => ({ rows: store.state}),
                    ui: (store) => ({ ui: store.state}),
                    frequency: (store) => ({ frequency: store.state}),
                    calendar: (store) => ({ calendar: store.state})
                }
            },
            createElement(Router)
        )
    ),
    document.getElementById('main')
);
