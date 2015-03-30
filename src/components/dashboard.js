import render from '../templates/dashboard.jsx';

class Dashboard {
    constructor(props) {
        const actions = {
            logoutClick: (event) => {
                event.preventDefault();
                props.flux.getActions('session').signOut();
            },
            autoUpdateChange: (event) => {
                console.log(event.target.checked);
            }
        };
        this.render = () => render(props, actions);
    }
}

export default Dashboard;