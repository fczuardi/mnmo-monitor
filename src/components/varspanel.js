import template from '../templates/varspanel.jsx';

class VarsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            groupChange: () => null,
            closePanel: () => 
                userActions.closePanel(),
            displaySecondaryVarChange: () => null
        };
        return template(this.props, actions);
    }
}

export default VarsPanel;
