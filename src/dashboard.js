import {DOM} from 'react';

class Dashboard {
    render() {
        return (
            DOM.div({},
                DOM.p({},
                    'Logado!'
                ),
                DOM.button({
                    onClick: this.props.flux.getActions('session').signOut,
                    style: { color: '#000' }
                }, 'Logout')
            )
        );
    }
}

export default Dashboard;