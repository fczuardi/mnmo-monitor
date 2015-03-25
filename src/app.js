//The main script
import {render, createElement} from 'react';
import FluxComponent from 'flummox/component';
import Flux from './flux';
import Stage from 'mnmo-components/lib/themes/mnmo/stage';
import Router from './components/router';
import messages from '../locales/pt/messages.json';

const flux = new Flux();

render(
    createElement(Stage, null,
        createElement(FluxComponent, {
                flux: flux,
                connectToStores: {
                    country: (store) => ({ country: store.state}),
                    user: (store) => ({ user: store.state}),
                    loginValidation: (store) => ({ loginForm: store.state}),
                    session: (store) => ({ session: store.state})
                }
            },
            createElement(Router, {
                messages: messages
            })
        )
    ),
    document.getElementById('main')
);
