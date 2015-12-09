import {createElement} from 'react';
import GroupsPanel from '../components/groupselect';
import VarsPanel from '../components/varspanel';
import ClassesPanel from '../components/classespanel';
import RowsPanel from '../components/rowspanel';
import SubgroupsPanel from '../components/subgroupspanel';
import SecondTablePanel from '../components/secondtablepanel';

class PanelRouter {
    render() {
        const component = (this.props.ui.panel === 'groups') ?
                createElement(GroupsPanel, this.props) :
            (this.props.ui.panel === 'vars') ?
                createElement(VarsPanel, this.props) :
            (this.props.ui.panel === 'classes') ?
                createElement(ClassesPanel, this.props) :
            (this.props.ui.panel === 'rows') ?
                createElement(RowsPanel, this.props) :
            (this.props.ui.panel === 'subgroups') ?
                createElement(SubgroupsPanel, this.props) :
            (this.props.ui.panel === 'secondtable') ?
                createElement(SecondTablePanel, this.props) :
            null;
        return component;
    }
}

export default PanelRouter;
