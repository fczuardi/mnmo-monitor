import {Component} from 'react';
import template from '../templates/secondtable.jsx';
import tryRender from '../lib/trycomponent';

class SecondTable{
    render() {
        return tryRender('secondtable', template, this.props);
    }
}

export default SecondTable;
