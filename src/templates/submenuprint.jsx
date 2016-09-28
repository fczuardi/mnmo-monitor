import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import A from 'mnmo-components/lib/themes/mnmo/a';

let hours =[],
    minutes = [];

for (let h = 0; h < 24; h++){
    let ph = h < 10 ? '0' + h : '' + h;
    hours.push({label: ph, value: ph});
}
for (let m = 0; m < 60; m++){
    let pm = m < 10 ? '0' + m : '' + m;
    minutes.push({label: pm, value: pm});
}

export default (p, a) => {
    let startParts = p.rows.printInterval.start.split(':');
    let startingHour = startParts[0];
    let startingMinute = startParts[1];
    let startTimePicker = (
        <MultiPicker
            title={p.language.messages.rows.startingTime}
            cells={[
                {
                    label: p.language.messages.rows.hour,
                    value: startingHour,
                    options: hours,
                    onChange: a.startHourChange
                },
                {
                    label: p.language.messages.rows.minute,
                    value: startingMinute,
                    options: minutes,
                    onChange: a.startMinuteChange
                }
            ]}
        />
    );
    let lastMinuteParts = p.calendar.lastMinute.split(':');
    let endParts = p.rows.printInterval.end.split(':');
    let endingHour = endParts[0];
    let endingMinute = endParts[1];
    let endTimePicker = (
        <MultiPicker
            title={p.language.messages.rows.endingTime}
            cells={[
                {
                    label: p.language.messages.rows.hour,
                    value: endingHour,
                    options: hours,
                    onChange: a.endHourChange
                },
                {
                    label: p.language.messages.rows.minute,
                    value: endingMinute,
                    options: minutes,
                    onChange: a.endMinuteChange
                }
            ]}
        />
    );
    let setTableButton = (
        <div style={{ marginLeft:-20, textAlign: 'center' }}>
            <A href="#" onClick={a.setTableClick}>
                {p.language.messages.settings.setPrintInterval}
            </A>
        </div>
    );

    let printButton = (
        <div style={{ marginLeft:-20, textAlign: 'center' }}>
            <A href="#" onClick={a.printClick}>
                {p.language.messages.settings.print}
            </A>
        </div>
    );
    let disabledPrintButton = (
        <div style={{ marginLeft:-20, textAlign: 'center', opacity: 0.5 }}>
            {p.language.messages.network.loadingData}
        </div>
    );

    let submitButton = p.rows.printTableLoading
        ? disabledPrintButton
        : p.rows.printTable.data.length
            ? printButton
            : setTableButton;
    return (
<div style={{
    marginLeft: -2,
    marginTop: -46
}}>
    <Drawer
        title={p.language.messages.settings.print}
        closeLabel={p.language.messages.settings.back}
        editLabel={p.language.messages.settings.close}
        doneLabel={p.language.messages.settings.close}
        onCloseClick={a.closeDrawer}
    >
    <div style={{
        opacity: p.rows.printTableLoading ? 0.5 : 1
    }}>
        {startTimePicker}
        {endTimePicker}
    </div>
    <List>
        <LI>
            {submitButton}
        </LI>
    </List>
    </Drawer>
</div>
    );
};
