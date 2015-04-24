import template from '../templates/varspanel.jsx';

class VarsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const varsActions = this.props.flux.getActions('vars');
        const actions = {
            closePanel: () => 
                userActions.closePanel(),
            firstVarChange: (event) => 
                varsActions.changePrimarySelection(event.target.value),
            secondVarChange: (event) => 
                varsActions.changeSecondarySelection(event.target.value),
            displaySecondaryVarChange: () => null
        };
        return template(this.props, actions);
    }
}

export default VarsPanel;
