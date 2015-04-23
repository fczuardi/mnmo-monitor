import template from '../templates/groupselect.jsx';

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
        return template(this.props, actions);
    }
}

export default GroupSelect;
