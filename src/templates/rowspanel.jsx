import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

let hours = [],
    minutes = [];

for (let h = 1; h <= 24; h++){
    hours.push({label: h < 10 ? '0' + h : '' + h, value: h});
}

for (let m = 0; m < 60; m++){
    minutes.push({label: m < 10 ? '0' + m : '' + m, value: m});
}

export default (p, a) => {
    let datePicker = (p.user.autoUpdate === true) ? null : (
        <List 
            title={p.language.messages.rows.date}
        >
            <span>Foo</span>
        </List>
    );
    let startingHour = (p.user.archivedReport &&
                        p.user.archivedReport.start) ? 
                            parseInt(p.user.archivedReport.start.split(':')[0]) : null;
    let startingMinute = (p.user.archivedReport &&
                        p.user.archivedReport.start) ? 
                            parseInt(p.user.archivedReport.start.split(':')[1]) : null;
    console.log('startingHour', startingHour);
    let startingTime = ( (p.rows.type === 'list') ||
                         (p.user.autoUpdate === true) ) ? null : (
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
    let endingHour = (p.user.archivedReport &&
                        p.user.archivedReport.end) ? 
                            parseInt(p.user.archivedReport.end.split(':')[0]) : null;
    let endingMinute = (p.user.archivedReport &&
                        p.user.archivedReport.end) ? 
                            parseInt(p.user.archivedReport.end.split(':')[1]) : null;
    let endingTime = (p.user.autoUpdate === true) ? null : (
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
    let frequencyPicker = (p.rows.type === 'list') ? null : (
        <List 
            title={p.language.messages.rows.interval}
        >
            <span>Foo</span>
        </List>
    );
    
    return (
        <Dialog align='center'>
            <Drawer
                title={p.language.messages.rows.title[p.rows.type]}
                closeLabel={p.language.messages.settings.close}
                onCloseClick={a.closePanel}
            >
                {datePicker}
                {startingTime}
                {endingTime}
                {frequencyPicker}
            </Drawer>
        </Dialog>
    );
}
