import React from 'react';
import merge from 'lodash/object/merge';
import tableStyles from '../styles/tablestyles';

export default (column, key, p, a) => {
    let cellContent = (column.icons && !column.iconError) ? (
        <img
            onError={a.onImageError}
            src={p.ui.supportsSVG ? column.icons.table : column.icons.tableBitmap}
            width={p.iconWidth}
            height={p.iconWidth}
            alt={column.label}
            title={column.label}
            data-id={column.id}
        />
    ) : (
        <span>
            {column.label}
        </span>
    );
    let cellStyle = merge({
            // padding: p.cellPadding,
            verticalAlign: 'middle'
        },
        tableStyles ? tableStyles(p).borderRight : {}
    );
    if (p.rows.type === 'detailed') {
        let defaultColumnColors = tableStyles(p).columnColors;
        let columnColors = p.customColors ? p.customColors : defaultColumnColors;
        cellStyle.backgroundColor = columnColors[(key % columnColors.length)]
    }

    //wait for the table to have some rows before allowing to click
    let headerClick = null;
    if (p.rows.data.length > 0 && p.groups.selected !== null) {
        headerClick = () => a.onHeaderCellClick(key);
        cellStyle.cursor = 'pointer'
    }

    return (
        <td
            id={key}
            key={key}
            style={cellStyle}
            onClick={headerClick}
        >
        <div
            style={{
                width: p.columnWidth - 1,
                overflow: 'hidden'
            }}
        >
            {cellContent}
            </div>
        </td>
    );
};
