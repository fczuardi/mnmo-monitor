import {Component} from 'react';
import template from '../templates/splitscreenmenu.jsx';

class SplitScreenMenu{
    render() {
        const actions = {
            chartOnClicked: (event) => {
                event.stopPropagation();
                this.props.flux.getActions('user').chartVisibilityToggle('on');
            },
            secondTableOnClicked: (event) => {
                event.stopPropagation();
                console.log('secondTableOnClicked');
                this.props.flux.getActions('user').secondTableEnabled();
            },
            chartOffClicked: (event) => {
                event.stopPropagation();
                this.props.flux.getActions('user').chartVisibilityToggle('off');
            },
            rowTypeListClicked: (event) => {
                this.props.flux.getActions('rows').rowsTypeSwitchClicked('merged')
            },
            rowTypeMergedClicked: (event) => {
                this.props.flux.getActions('rows').rowsTypeSwitchClicked('list')
            },
            subgroupsButtonClicked: () =>
                this.props.flux.getActions('user').openPanel('subgroups')
        };
        return template(this.props, actions);
    }
}

export default SplitScreenMenu;
