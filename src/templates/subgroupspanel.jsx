import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

const fullScreenLimit = 400;

export default (p, a) =>
<Dialog align='center' fullscreen={p.ui.screenWidth < fullScreenLimit}>
    <Drawer
        title={p.language.messages.subgroups.title}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
        fullscreen={p.ui.screenWidth < fullScreenLimit}
    >
        <MultiPicker 
            cells={[
                {
                    label: p.language.messages.subgroups.subgroup,
                    value: null,
                    options: p.groups.selectedGroupSubgroups.map( (group) => ({
                        label: group.label,
                        value: group.id
                    })),
                    onChange: null
                }
            ]}
        />

    </Drawer>
</Dialog>;
