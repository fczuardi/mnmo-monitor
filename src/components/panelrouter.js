import {createElement} from 'react';
import GroupsPanel from '../components/groupselect';

class PanelRouter {
    render() {
        const component = (this.props.ui.panel === 'groups') ?
            createElement(GroupsPanel, this.props) : null;
        return component;
    }
}

export default PanelRouter;
