import React from 'react';
import merge from 'lodash/object/merge';
import tableStyles from '../styles/table';

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
        tableStyles(p).borderRight
    );
    if (p.rows.type === 'detailed') {
        let columnColors = tableStyles(p).columnColors;
        cellStyle.backgroundColor = columnColors[(key % columnColors.length)]
    }
    return (
        <td
            id={key}
            key={key}
            style={cellStyle}
            onClick={() => a.onHeaderCellClick(key)}
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
