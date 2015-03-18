//The main script

import {render, createElement} from 'react';
// import Checkbox from 'mnmo-components/lib/checkbox';
import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';

render(
    createElement(Checkbox, {id:'checkbox-1'}),
    document.getElementById('main')
);