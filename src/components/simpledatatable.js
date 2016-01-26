import {Component} from 'react';
import template from '../templates/simpledatatable.jsx';
import tryRender from '../lib/trycomponent';

class SimpleDataTable{
    render() {
        return tryRender('simpledatatable', template, this.props);
    }
}

export default SimpleDataTable;
