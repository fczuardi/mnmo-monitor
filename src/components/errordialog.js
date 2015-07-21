import template from '../templates/errordialog.jsx';

class ErrorDialog {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            buttonClicked: (event) => {
                event.preventDefault();
                userActions.errorDismissed();
                if (this.props.ui.errorTryAgainAction){
                    this.props.ui.errorTryAgainAction();
                }
            }
        };
        return template(this.props, actions);
    }
}

export default ErrorDialog;
