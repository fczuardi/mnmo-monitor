import template from '../templates/classespanel.jsx';
import tryRender from '../lib/trycomponent';

class ClassesPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const groupsActions = this.props.flux.getActions('groups');
        const actions = {
            closePanel: () =>
                userActions.closePanel(),
            changeClass: (event) =>
                groupsActions.changeClassSelection(event.target.value)
        };
        return tryRender('classespanel', template, this.props, actions);
    }
}

export default ClassesPanel;
