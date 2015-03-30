import {createElement} from 'react';
import LoginForm from '../components/login';
import DashboardScreen from '../components/dashboard';

class Router {
    render() {
        const screen = (this.props.session.token === null) ? 
            LoginForm : DashboardScreen;
        return (createElement(screen, this.props));
    }
}

export default Router;