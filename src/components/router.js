import {createElement} from 'react';
import LoginForm from './login';
import DashboardScreen from './dashboard';

class Router {
    render() {
        const screen = (this.props.session.token === null) ? 
            LoginForm : DashboardScreen;
        return (createElement(screen, this.props));
    }
}

export default Router;