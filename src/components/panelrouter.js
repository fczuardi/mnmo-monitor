import {createElement} from 'react';
import GroupsPanel from '../components/groupselect';
import VarsPanel from '../components/varspanel';

class PanelRouter {
    render() {
        const component = (this.props.ui.panel === 'groups') ?
                createElement(GroupsPanel, this.props) : 
            (this.props.ui.panel === 'vars') ? 
                createElement(VarsPanel, this.props) : null;
        return component;
    }
}

export default PanelRouter;
