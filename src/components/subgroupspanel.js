import template from '../templates/subgroupspanel.jsx';

class SubgroupsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            closePanel: () => 
                userActions.closePanel()
        };
        return template(this.props, actions);
    }
}

export default SubgroupsPanel;
