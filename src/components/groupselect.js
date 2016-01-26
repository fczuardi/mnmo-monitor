import template from '../templates/groupselect.jsx';
import tryRender from '../lib/trycomponent';

class GroupSelect {
    render() {
        const groupsActions = this.props.flux.getActions('groups');
        const userActions = this.props.flux.getActions('user');
        const actions = {
            groupChange: (event) =>
                groupsActions.changeGroupSelection(event.target.value),
            closePanel: () =>
                userActions.closePanel()
        };
        return tryRender('groupselect', template, this.props, actions);
    }
}

export default GroupSelect;
