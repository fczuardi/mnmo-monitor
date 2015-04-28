import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

const fullScreenLimit = 400;

export default (p, a) =>
<Dialog align='right' fullscreen={p.ui.screenWidth < fullScreenLimit}>
    <Drawer
        title={p.language.messages.vars.title}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
        fullscreen={p.ui.screenWidth < fullScreenLimit}
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
</Dialog>;
