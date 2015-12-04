import template from '../templates/secondtablepanel.jsx';

class SecondTablePanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            closePanel: () =>
                userActions.closePanel()
        };
        return template(this.props, actions);
    }
}

export default SecondTablePanel;
