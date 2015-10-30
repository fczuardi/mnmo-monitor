import {Component} from 'react';
import template from '../templates/simpledatatable.jsx';

class SimpleDataTable{
    render() {
        return template(this.props);
    }
}

export default SimpleDataTable;
