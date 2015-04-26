import template from '../templates/rowspanel.jsx';

class RowsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            closePanel: () => 
                userActions.closePanel()
        };
        return template(this.props, actions);
    }
}

export default RowsPanel;
