import template from '../templates/submenuprint.jsx';
import tryRender from '../lib/trycomponent';

class PrintSubmenu {
    render() {
        const userActions = this.props.flux.getActions('user')
        const columnActions = this.props.flux.getActions('columns')
        const actions = {
            closeDrawer: () => {
                userActions.clearPrintInterval()
                return userActions.closeSubmenu()
            },
            startHourChange: (event) =>
                userActions.setPrintStartHour(event.target.value),
            startMinuteChange: (event) =>
                userActions.setPrintStartMinute(event.target.value),
            endHourChange: (event) =>
                userActions.setPrintEndHour(event.target.value),
            endMinuteChange: (event) =>
                userActions.setPrintEndMinute(event.target.value),
            setTableClick: (event) => {
                event.preventDefault();
                return userActions.printIntervalRequested();
            },
            printClick: (event) => {
                event.preventDefault();
                userActions.printRequested();
                return userActions.closeSubmenu();
            }
        };
        return tryRender('submenuprint', template, this.props, actions);
    }
}

export default PrintSubmenu;
