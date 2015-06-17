import React from 'react';
import merge from 'lodash/object/merge';
import tableStyles from '../styles/table';

export default (column, key, p, a) => {
    let cellContent = (column.icons) ? (
        <img
            src={p.ui.supportsSVG ? column.icons.table : column.icons.tableBitmap}
            width={p.iconWidth}
            height={p.iconWidth}
            alt={column.label}
            title={column.label}
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
    )
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
