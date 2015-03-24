import {createElement} from 'react';
import LoginForm from './login';
import DashboardScreen from './dashboard';

class Router {
    render() {
        console.log('render router', this.props.session.token);
        if (this.props.session.token === null){
            return createElement(LoginForm, this.props);
        } else {
            return createElement(DashboardScreen, this.props);
        }
    }
}

export default Router;