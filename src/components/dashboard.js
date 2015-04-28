import template from '../templates/dashboard.jsx';

class Dashboard {
    render() {
        const actions = {
            subgroupsButtonClicked: () =>
                this.props.flux.getActions('user').openPanel('subgroups')
        };
        return template(this.props, actions);
    }
}

export default Dashboard;
