import render from './templates/dashboard.jsx';

class Dashboard {
    constructor(props) {
        const actions = {
            logoutClick: (event) => {
                event.stopPropagation();
                props.flux.getActions('session').signOut();
            }
        };
        this.render = () => render(props, actions);
    }
}

export default Dashboard;