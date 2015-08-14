import {createElement} from 'react';
import LoginForm from '../components/login';
import DashboardScreen from '../components/dashboard';
import ForgotPasswordScreen from '../components/forgotpassword';
import ChangePasswordScreen from '../components/password';
import queryString from 'query-string';

class Router {
    render() {
        let routerPath = queryString.parse(location.search).path || null;
        console.log('routerPath', routerPath);
        const screen = (routerPath === 'forgotPassword') ? ChangePasswordScreen :
                (this.props.ui.screen === 'forgotPassword') ? ForgotPasswordScreen :
                (this.props.session.token === null) ? LoginForm : 
                (this.props.ui.screen === 'password') ? ChangePasswordScreen :
                DashboardScreen;
        return (createElement(screen, this.props));
    }
}

export default Router;
