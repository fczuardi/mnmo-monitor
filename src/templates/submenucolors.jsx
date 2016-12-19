import React from 'react';
import tableStyles from '../styles/tablestyles';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import A from 'mnmo-components/lib/themes/mnmo/a';

const colorIcon = color => (
    <div
        style={{
            width: 30,
            height: 30,
            backgroundColor: color,
            border: '1px solid #999',
            float: 'left',
            marginRight: 10
        }}
    >
    </div>
);

const colorLine = (a, key, colors) => {
    return colors.map((color) =>
        <a onClick={() => a.colorClick(key, color)}>
            {colorIcon(color)}
        </a>
    );
};

const colorSwitch = (p, a, key) => {
    if (p.ui.openColorSwitch !== key) {
        return null;
    }
    const defaultColors = tableStyles(p).columnColors;
    return (
        <List>
            <LI>{colorLine(a, key, defaultColors)}</LI>
        </List>
    );
};

export default (p, a) =>
<div style={{
    marginLeft: -2,
    marginTop: -46
}}>
<Drawer
    title={p.language.messages.settings.colors}
    closeLabel={p.language.messages.settings.back}
    onCloseClick={a.closeDrawer}
>
    <List ref="enabledColumns">
        {p.columns.enabled.map( (column, key) =>
            <LI
                key={key}
                data-index={key}
                onClick={() => a.openColorSwitch(key)}
            >
            <div className="item" style={{
                width: '95%',
                marginLeft: '5%'
            }}>
                {colorIcon(column.customColor)}
                {
                (column.icons && !column.iconError) ?
                    React.DOM.img({
                        src: p.ui.supportsSVG ?
                                column.icons.menu : column.icons.menuBitmap,
                        width: 30,
                        height: 30,
                        style: {
                            marginRight: 10
                        },
                        'data-id': column.id,
                        onError: a.onImageError
                    }) : null
                }
                {column.label}
            </div>
            {colorSwitch(p, a, key)}
            </LI>
        )}
    </List>
</Drawer>;
</div>
