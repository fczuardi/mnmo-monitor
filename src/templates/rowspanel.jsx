import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';
import Radio from 'mnmo-components/lib/themes/mnmo/radio';
import Switch from 'mnmo-components/lib/themes/mnmo/switch';


const fullScreenLimit = 400;

let startHours =[],
    endHours = [],
    minutes = [];

// for (let h = 6; h < 24; h++){
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
    let selectedDay = (p.user.archivedReport && p.user.archivedReport.date) ? 
                                            p.user.archivedReport.date : null;
    let initialMonth = moment(selectedDay);
    let modifiers = {
        selected: (day) => (selectedDay === day.format('YYYY-MM-DD')),
        disabled: (day) => {
            let result = false,
                month = day.format('YYYYMM'),
                dayIndex = (day.date() - 1),
                storedMonth = p.calendar.months[month];
            if (day.startOf('day').isAfter(moment().startOf('day'))) {
                return true;
            }
            if (storedMonth && storedMonth[dayIndex]){
                result = (storedMonth[dayIndex] === '0');
            }
            return result;
        }
    };

    let datePicker = (p.user.autoUpdate === true) ? null : (
        <List 
            title={p.language.messages.rows.date}
        >
            <div style={{marginLeft:-10}}>
            <DayPicker 
                initialMonth={initialMonth}
                modifiers={modifiers}
                onDayClick={a.calendarDayClick}
                onPrevMonthClick={a.monthChange}
                onNextMonthClick={a.monthChange}
                enableOutsideDays={true}
            />
            </div>
        </List>
    );
    let startingHour = (p.user.archivedReport &&
                        p.user.archivedReport.start) ? 
                            parseInt(p.user.archivedReport.start.split(':')[0]) : null;
    let startingMinute = (p.user.archivedReport &&
                        p.user.archivedReport.start) ? 
                            parseInt(p.user.archivedReport.start.split(':')[1]) : null;
    let startingTime = ( (p.rows.type === 'list') ||
                         (p.user.autoUpdate === true) ) ? null : (
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
    
    let frequencyPicker = (p.rows.type === 'list') ? null : (
        <List
            title={p.language.messages.rows.interval}
        >
            <div style={{
                color: '#000',
                display: 'table',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
                padding: '30px',
                paddingRight: 0,
                width: '100%',
                marginLeft: -10
            }}>
            {p.frequency.options.map( (freq, key) => (
                <Radio  
                    key={key}
                    name='settings-frequency' 
                    id={'settings-frequency-' + key} 
                    value={freq.id}
                    checked={(freq.id == p.user.mergedRows.frequencyID)}
                    isRowCell={true}
                    onChange={a.frequencyChange}
                >
                    {freq.value}
                </Radio>
            ))}
            </div>
            <div style={{
                color: '#000',
                marginBottom: 30,
                marginLeft: -20,
                textAlign: 'center'
            }}>
                <Switch 
                    id="merge-function-toggle" 
                    onChange={a.mergeFunctionChange}
                    isMiddleSwitch={true}
                    isItem={false}
                    checked={
                        (p.user.mergedRows !== null && 
                            p.user.mergedRows.mergeFunctionID === 1)
                    }
                >
                    <span style={{margin: 10}}>
                        {p.language.messages.rows.startingTime}
                    </span>
                    <span style={{margin: 10}}>
                        {p.language.messages.rows.endingTime}
                    </span>
                </Switch>
            </div>
        </List>
    );
    
    let isFullscreen = p.ui.screenWidth < fullScreenLimit;
    return (
        <Dialog align='center' fullscreen={isFullscreen}>
            <Drawer
                title={p.language.messages.rows.title[p.rows.type]}
                closeLabel={p.language.messages.settings.close}
                onCloseClick={a.closePanel}
                fullscreen={isFullscreen}
            >
            <div style={{
                height: '90%',
                overflow: 'auto'
            }}>
                {datePicker}
                {startingTime}
                {endingTime}
                {frequencyPicker}
            </div>
            </Drawer>
        </Dialog>
    );
}
