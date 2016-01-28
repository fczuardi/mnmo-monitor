import React from 'react';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';

export default (p, a) =>
<List ref="enabledColumns">
    {p.items.map( (column, key) =>
        <LI
            key={key}
            haveHandle={p.editing}
            handleClassName="handle"
            data-index={key}
        >
        <div className="item" style={{
            width: '95%',
            marginLeft: '5%'
        }}>
            <Checkbox
                id={('column-enabled-' + key)}
                value={column.id}
                isItem={true}
                checked={true}
                onChange={a.columnChange}
            >
            {
            (column.icons && !column.iconError) ?
                React.DOM.img({
                    src: p.uiStore.supportsSVG ?
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
            </Checkbox>
        </div>
        </LI>
    )}
</List>;
