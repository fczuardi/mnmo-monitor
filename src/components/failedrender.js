import {Component, DOM} from 'react';

class FailedRender{
    constructor() {
        this.errorDisplayed = false;
    }
    render(){
        return DOM.div();
    }
    componentDidMount(){
        const userActions = this.props.flux.getActions('user');
        const message = (this.props && this.props.message) ? this.props.message : '';
        // console.log('userActions', userActions);
        window.setTimeout(function(){
            userActions.errorArrived({
                message: message,
                tryAgainAction: null,
                warning: null
            });
        }, 1);
    }
}
export default FailedRender;
