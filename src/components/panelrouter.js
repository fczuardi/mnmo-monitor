import {createElement} from 'react';
import GroupsPanel from '../components/groupselect';
import VarsPanel from '../components/varspanel';
import RowsPanel from '../components/rowspanel';
import SubgroupsPanel from '../components/subgroupspanel';

class PanelRouter {
    render() {
        const component = (this.props.ui.panel === 'groups') ?
                createElement(GroupsPanel, this.props) : 
            (this.props.ui.panel === 'vars') ? 
                createElement(VarsPanel, this.props) : 
            (this.props.ui.panel === 'rows') ? 
                createElement(RowsPanel, this.props) : 
            (this.props.ui.panel === 'subgroups') ? 
                createElement(SubgroupsPanel, this.props) : 
            null;
        return component;
    }
}

export default PanelRouter;
