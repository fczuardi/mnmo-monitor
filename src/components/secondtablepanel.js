import template from '../templates/secondtablepanel.jsx';

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
                console.log('autoUpdateChange');
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
            }
        };
        return template(this.props, actions);
    }
}

export default SecondTablePanel;
