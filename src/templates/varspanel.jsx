import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

export default (p, a) =>
<div style={{
    position: 'absolute',
    paddingTop: 53,
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
    right: 0
}}>
    <Drawer
        title={p.language.messages.vars.title}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
    >
        <MultiPicker 
            cells={[
                {
                    label: p.language.messages.vars.input1,
                    value: p.user.primaryVarLabel,
                    options: p.vars.primary,
                    onChange: a.firstVarChange
                },
                {
                    label: p.language.messages.vars.input2,
                    value: p.user.secondaryVarLabel,
                    options: p.vars.secondary,
                    onChange: a.secondVarChange
                }
            ]}
        />

    </Drawer>
</div>;
