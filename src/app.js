//The main script
import {render, createElement} from 'react';
// import Checkbox from 'mnmo-components/lib/checkbox';
// import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';
import LoginForm from './login';
import messages from '../locales/pt/messages.json';

render(
    createElement(LoginForm, {
        messages: messages
    }),
    document.getElementById('main')
);