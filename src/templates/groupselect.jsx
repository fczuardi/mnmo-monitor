import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Radio from 'mnmo-components/lib/themes/mnmo/radio';

let key = 1;

export default (p) =>
<div style={{
    position: 'absolute',
    marginTop: 57
}}>
<Drawer
    title={p.language.messages.groups.title}
    closeLabel={p.language.messages.settings.close}
>
    <List 
        title={p.language.messages.groups.type1}
    >
        {p.groups.type1.map( (group, key) =>
        <LI key={key}>
            <Radio 
                name="groups"
                id={'group-' + group.id}
                value={group.id}
                isItem={true}
                checked={(group.id === p.user.groupID)}
            >
                {group.label} ({group.shortLabel})
            </Radio>
        </LI>
        )}
    </List>
    <List 
        title={p.language.messages.groups.type2}
    >
        {p.groups.type2.map( (group, key) =>
        <LI key={key}>
            <Radio 
                name="groups"
                id={'group-' + group.id}
                value={group.id}
                isItem={true}
                checked={(group.id === p.user.groupID)}
            >
                {group.label} ({group.shortLabel})
            </Radio>
        </LI>
        )}
    </List>
</Drawer>
</div>;
