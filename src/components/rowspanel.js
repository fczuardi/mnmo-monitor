import template from '../templates/rowspanel.jsx';

class RowsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            closePanel: () => 
                userActions.closePanel(),
            calendarDayClick: (day) =>
                userActions.dateUpdated(day.format('YYYY-MM-DD')),
            monthChange: (day) =>
                userActions.monthUpdated(day.format('YYYY-MM-DD')),
            startHourChange: (event) => 
                userActions.startHourUpdated(event.target.value),
            startMinuteChange: (event) => 
                userActions.startMinuteUpdated(event.target.value),
            endHourChange: (event) => 
                userActions.endHourUpdated(event.target.value),
            endMinuteChange: (event) => 
                userActions.endMinuteUpdated(event.target.value),
            frequencyChange: (event) => 
                userActions.frequencyUpdated(event.target.value),
            mergeFunctionChange: (event) => 
                userActions.mergeFunctionUpdated(event.target.checked ? 1: 0)
        };
        return template(this.props, actions);
    }
}

export default RowsPanel;
