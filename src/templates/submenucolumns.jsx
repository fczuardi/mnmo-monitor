import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';

export default (p) =>
<Drawer
    title={p.language.messages.settings.columns}
>
    <List>
    {p.columns.enabled.map( (column, key) =>
        <LI key={key}>
            <Checkbox
                isItem={true}
                checked={true}
            >
                {column.label}
            </Checkbox>
        </LI>
    )}
    {p.columns.disabled.map( (column, key) =>
        <LI key={key}>
            <Checkbox
                isItem={true}
                checked={false}
            >
                {column.label}
            </Checkbox>
        </LI>
    )}
    </List>
</Drawer>;
