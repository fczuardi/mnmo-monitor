//The main script
import {render, createElement} from 'react';
import FluxComponent from 'flummox/component';
import Flux from './flux';
import Stage from 'mnmo-components/lib/themes/mnmo/stage';
import LoginForm from './login';
import messages from '../locales/pt/messages.json';

const flux = new Flux();

render(
    createElement(Stage, null,
        createElement(FluxComponent, {
                flux: flux,
                connectToStores: {
                    country: (store) => ({ country: store.state})
                }
            },
            createElement(LoginForm, {
                messages: messages,
                countryOptions: [
                    {
                        id: '1',
                        label: 'BRASIL'
                    },
                    {
                        id: '2',
                        label: 'ARGENTINA'
                    }
                ]
            })
        )
    ),
    document.getElementById('main')
);