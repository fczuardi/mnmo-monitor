import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

let hours = [],
    minutes = [];

for (let h = 1; h <= 24; h++){
    hours.push({label: h < 10 ? '0' + h : '' + h, value: h});
}

for (let m = 0; m < 60; m++){
    minutes.push({label: m < 10 ? '0' + m : '' + m, value: m});
}

export default (p, a) =>
<div style={{
    position: 'absolute',
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
    left: '50%',
    marginLeft: -150
}}>
    <Drawer
        title={p.language.messages.rows.title[p.rows.type]}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
    >
        <MultiPicker 
            cells={[
                {
                    label: p.language.messages.rows.hour,
                    value: null,
                    options: hours,
                    onChange: null
                },
                {
                    label: p.language.messages.rows.minute,
                    value: null,
                    options: minutes,
                    onChange: null
                }
            ]}
        />

    </Drawer>
</div>;
