import template from '../templates/subgroupspanel.jsx';
import tryRender from '../lib/trycomponent';

class SubgroupsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const groupsActions = this.props.flux.getActions('groups');
        const actions = {
            closePanel: () =>
                userActions.closePanel(),
            changeSubGroup: (event) =>
                groupsActions.changeSubGroupSelection(event.target.value)
        };
        return tryRender('subgroupspanel', template, this.props, actions);
    }
}

export default SubgroupsPanel;
