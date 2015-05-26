import React from 'react';
import merge from 'lodash/object/merge';
import tableStyles from '../styles/table';

export default (column, key, p) => {
    let cellContent = (column.icons) ? (
        <img
            src={column.icons.table}
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
            display: 'table-cell',
            verticalAlign: 'middle'
        },
        tableStyles(p).borderRight
    )
    return (
        <div
            key={key}
            style={cellStyle}
        >
            {cellContent}
        </div>
    );
};
