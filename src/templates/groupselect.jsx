import React from 'react';
import Dialog from 'mnmo-components/lib/themes/mnmo/dialog';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Radio from 'mnmo-components/lib/themes/mnmo/radio';

const fullScreenLimit = 400;

export default (p, a) =>
<Dialog
    align={p.rows.type === 'detailed' ? 'right' : 'left'}
    fullscreen={p.ui.screenWidth < fullScreenLimit}
>
    <Drawer
        title={p.language.messages.groups.title}
        closeLabel={p.language.messages.settings.close}
        onCloseClick={a.closePanel}
        fullHeight={true}
        fullscreen={p.ui.screenWidth < fullScreenLimit}
    >
        <div style={{
            height: '90%',
            overflow: 'auto'
        }}>
        <List
            title={p.groups.type1.length > 0 ?
                    p.language.messages.groups.type1 : null}
        >
            {p.groups.type1.map( (group, key) =>
            <LI key={key}>
                <Radio
                    name="groups"
                    id={'group-' + group.id}
                    value={group.id}
                    isItem={true}
                    checked={(group.id === p.user.groupID)}
                    onChange={a.groupChange}
                >
                    {group.label} ({group.shortLabel})
                </Radio>
            </LI>
            )}
        </List>
        <List
            title={p.groups.type2.length > 0 ?
                    p.language.messages.groups.type2 : null}
        >
            {p.groups.type2.map( (group, key) =>
            <LI key={key}>
                <Radio
                    name="groups"
                    id={'group-' + group.id}
                    value={group.id}
                    isItem={true}
                    checked={(group.id === p.user.groupID)}
                    onChange={a.groupChange}
                >
                    {group.label} ({group.shortLabel})
                </Radio>
            </LI>
            )}
        </List>
        </div>
    </Drawer>
</Dialog>;
