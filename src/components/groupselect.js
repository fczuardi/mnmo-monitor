import template from '../templates/groupselect.jsx';

class GroupSelect {
    render() {
        const groupsActions = this.props.flux.getActions('groups');
        const actions = {
            groupChange: (event) => 
                groupsActions.changeGroupSelection(event.target.value)
        };
        return template(this.props, actions);
    }
}

export default GroupSelect;
