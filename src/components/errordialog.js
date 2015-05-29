import template from '../templates/errordialog.jsx';

class ErrorDialog {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            buttonClicked: (event) => {
                event.preventDefault();
                userActions.errorDismissed();
            }
        };
        return template(this.props, actions);
    }
}

export default ErrorDialog;
