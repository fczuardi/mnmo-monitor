import {Component} from 'react';
import template from '../templates/secondtabletoolbar.jsx';

class SecondTableToolbar{
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            onVarChange: (ev) => {
                console.log('onVarChange', ev.target.value);
                userActions.secondTableFormChanged('variableComboID', ev.target.value);
            },
            onDayChange: (ev) => {
                console.log('onDayChange', ev.target.value);
                userActions.secondTableFormChanged('day', ev.target.value);
            },
            onStartTimeChange: (ev) => {
                console.log('onStartTimeChange', ev.target.value);
                userActions.secondTableFormChanged('startTime', ev.target.value);
            },
            onEndTimeChange: (ev) => {
                console.log('onEndTimeChange', ev.target.value);
                userActions.secondTableFormChanged('endTime', ev.target.value);
            },
            onAddClicked: (ev) => {
                userActions.secondTableFormChanged('action', 'add');
            },
            onMobileAddClicked: (ev) => {
                console.log('onMobileAddClicked');
                userActions.openPanel('secondtable');
            },
            onAutoUpdateClicked: (ev) => {
                console.log('onAutoUpdateClicked', ev.target.value);
                userActions.secondTableFormChanged('autoUpdate', null);
            }
        }
        return template(this.props, actions);
    }
}

export default SecondTableToolbar;
