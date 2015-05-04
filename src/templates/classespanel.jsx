import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';

const fullScreenLimit = 400;

export default (p, a) =>
<Dialog align='right' fullscreen={p.ui.screenWidth < fullScreenLimit}>
    <Drawer
        title={p.language.messages.classes.title}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
        fullscreen={p.ui.screenWidth < fullScreenLimit}
    >
        <MultiPicker 
            cells={[
                {
                    value: p.user.classID,
                    options: p.groups.selected.classes.map( (classItem) => ({
                        label: classItem.label,
                        value: classItem.id
                    })),
                    onChange: a.changeClass
                }
            ]}
        />

    </Drawer>
</Dialog>;
