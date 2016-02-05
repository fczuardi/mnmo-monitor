import {createElement} from 'react';
import LoginForm from '../components/login';
import DashboardScreen from '../components/dashboard';
import ForgotPasswordScreen from '../components/forgotpassword';
import ChangePasswordScreen from '../components/password';
import queryString from 'query-string';

class Router {
    render() {
        let routerPath = (this.props.passwordForm.forgotPasswordToken !== null) ?
            queryString.parse(location.search).path || null : null;
        const screen = (routerPath === 'forgotPassword') ? ChangePasswordScreen :
                (this.props.ui.screen === 'forgotPassword') ? ForgotPasswordScreen :
                (this.props.ui.screen === 'password') ? ChangePasswordScreen :
                (this.props.session.token === null) ? LoginForm :
                DashboardScreen;
        return (createElement(screen, this.props));
    }
}

export default Router;
