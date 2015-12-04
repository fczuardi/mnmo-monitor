import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

const fullScreenLimit = 400;

let startHours =[],
    endHours = [],
    minutes = [];

for (let h = 0; h < 24; h++){
    startHours.push({label: h < 10 ? '0' + h : '' + h, value: h});
}
for (let h = 0; h < 24; h++){
    // let f = (h + 6) % 24;
    let f = h;
    endHours.push({label: f < 10 ? '0' + f : '' + f, value: f});
}
for (let m = 0; m < 60; m++){
    minutes.push({label: m < 10 ? '0' + m : '' + m, value: m});
}

export default (p, a) => {
    let startingHour = parseInt(p.user.newSecondaryRow.startTime.split(':')[0]);
    let startingMinute = parseInt(p.user.newSecondaryRow.startTime.split(':')[1]);
    let startingTime =  (
        <MultiPicker
            title={p.language.messages.rows.startingTime}
            cells={[
                {
                    label: p.language.messages.rows.hour,
                    value: startingHour,
                    options: startHours,
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
    let endingHour = parseInt(p.user.newSecondaryRow.endTime.split(':')[0]);
    let endingMinute = parseInt(p.user.newSecondaryRow.endTime.split(':')[1]);
    let endingTime = (p.rows.secondary.autoUpdate === true) ? null : (
        <MultiPicker
            title={p.language.messages.rows.endingTime}
            cells={[
                {
                    label: p.language.messages.rows.hour,
                    value: endingHour,
                    options: endHours,
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

    return (
<Dialog align='center' fullscreen={p.ui.screenWidth < fullScreenLimit}>
    <Drawer
        title={p.language.messages.rows.secondTable}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
        saveLabel={p.language.messages.settings.save}
        onSaveClick={a.savePanel}
        fullscreen={p.ui.screenWidth < fullScreenLimit}
    >
        {startingTime}
        {endingTime}
    </Drawer>
</Dialog>
    );
}
