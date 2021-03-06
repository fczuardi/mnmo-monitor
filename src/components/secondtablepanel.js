import template from '../templates/secondtablepanel.jsx';
import tryRender from '../lib/trycomponent';

function updateTimeStringHours(s, v){
    let padded = (v < 10 ? '0' : '') + v;
    return s.replace(/..:/, padded +  ':');
}
function updateTimeStringMinutes(s, v){
    let padded = (v < 10 ? '0' : '') + v;
    return s.replace(/:../, ':' + padded);
}

class SecondTablePanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            closePanel: () =>
                userActions.closePanel(),
            savePanel: (ev) => {
                userActions.secondTableFormChanged('action', 'add');
                userActions.closePanel();
            },
            autoUpdateChange: (ev) => {
                // console.log('autoUpdateChange');
                userActions.secondTableFormChanged('autoUpdate', null);
            },
            firstVarChange: (ev) => {
                userActions.secondTableFormChanged('primaryVarLabel', ev.target.value);
            },
            secondVarChange: (ev) => {
                userActions.secondTableFormChanged('secondaryVarLabel', ev.target.value);
            },
            startHourChange: (ev) => {
                userActions.secondTableFormChanged('startTime', updateTimeStringHours(
                    this.props.user.newSecondaryRow.startTime,
                    ev.target.value
                ));
            },
            startMinuteChange: (ev) => {
                userActions.secondTableFormChanged('startTime', updateTimeStringMinutes(
                    this.props.user.newSecondaryRow.startTime,
                    ev.target.value
                ));
            },
            endHourChange: (ev) => {
                userActions.secondTableFormChanged('endTime', updateTimeStringHours(
                    this.props.user.newSecondaryRow.endTime,
                    ev.target.value
                ));
            },
            endMinuteChange: (ev) => {
                userActions.secondTableFormChanged('endTime', updateTimeStringMinutes(
                    this.props.user.newSecondaryRow.endTime,
                    ev.target.value
                ));
            },
            calendarDayClick: (e, d) => {
                let day = moment(d);
                let newDay = day.format('YYYY-MM-DD');
                // console.log('calendarDayClick', newDay);
                userActions.secondTableFormChanged('day', newDay);

            },
            monthChange: (d) => {
                let day = moment(d);
                let newDay = day.format('YYYY-MM-DD');
                // console.log('monthChange', newDay);
            }
        };
        return tryRender('secondtablepanel', template, this.props, actions);
    }
}

export default SecondTablePanel;
