import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import EnabledColumns from '../components/enabledcolumns';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';

export default (p, a) =>
<div style={{
    marginLeft: -2,
    marginTop: -46
}}>
<Drawer
    title={p.language.messages.settings.columns}
    closeLabel={p.language.messages.settings.back}
    saveLabel={p.language.messages.settings.colors}
    onCloseClick={a.closeDrawer}
    onSaveClick={a.editColors}
>
    <EnabledColumns
        items={p.columns.enabled}
        uiStore={p.ui}
        actions={a}
        editing={true}
    />
    <List>
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
                (column.icons && !column.iconError) ?
                    React.DOM.img({
                        src: p.ui.supportsSVG ?
                                    column.icons.menu : column.icons.menuBitmap,
                        width: 30,
                        height: 30,
                        'data-id': column.id,
                        onError: a.onImageError
                    }) : null
                }
                {column.label}
            </Checkbox>
        </LI>
    )}
    </List>
</Drawer>;
</div>
