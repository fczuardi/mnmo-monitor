import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';

export default (p, a) =>
<Drawer
    title={p.language.messages.settings.columns}
    closeLabel={p.language.messages.settings.close}
    onCloseClick={a.closeDrawer}
>
    <List>
    {p.columns.enabled.map( (column, key) =>
        <LI key={key}>
            <Checkbox
                id={('column-enabled-' + key)}
                value={column.id}
                isItem={true}
                checked={true}
                onChange={a.columnChange}
            >
            {
            column.icons ? 
                React.DOM.img({
                    src: column.icons.menu,
                    width: 50,
                    height: 50
                }) : null
            }
                {column.label}
            </Checkbox>
        </LI>
    )}
    {p.columns.disabled.map( (column, key) =>
        <LI key={key}>
            <Checkbox
                id={('column-disabled-' + key)}
                value={column.id}
                isItem={true}
                checked={false}
                onChange={a.columnChange}
            >
            {
                column.icons ? 
                    React.DOM.img({
                        src: column.icons.menu,
                        width: 50,
                        height: 50
                    }) : null
                }
                {column.label}
            </Checkbox>
        </LI>
    )}
    </List>
</Drawer>;
