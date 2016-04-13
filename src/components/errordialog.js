import template from '../templates/errordialog.jsx';

class ErrorDialog {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            buttonClicked: (event) => {
                event.preventDefault();
                // console.log('this.props.columns.enabled', this.props.columns.enabled,
                // this.props.columns.enabled.length, this.props.groups.selected);
                userActions.errorDismissed();
                if (this.props.ui.screen === 'password'){
                    //do not open menus or submenus
                }else if (this.props.groups.selected === null){
                    this.props.flux.getActions('user').menuVisibilityToggle();
                    this.props.flux.getActions('user').openPanel('groups');
                }else if (this.props.columns.enabled.length === 0){
                    this.props.flux.getActions('user').menuVisibilityToggle();
                    this.props.flux.getActions('user').openSubmenu('columns');
                }
            },
            tryAgainClicked: (event) => {
                event.preventDefault();
                userActions.errorDismissed();
                this.props.ui.errorTryAgainAction();
            }
        };
        return template(this.props, actions);
    }
}

export default ErrorDialog;
