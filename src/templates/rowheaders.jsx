import React from 'react';
import rowRenderer from './rowheader.jsx';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';

export default (p, a) => {
    p.rowHeight = p.rows.type === 'secondary' ? p.secondTableRowHeight : p.rowHeight;
    return (
<div
    id={p.rowHeadersElementId || 'row-headers'}
    style={{
        height: p.rows.type === 'secondary' ? p.tableHeight : p.tableHeight - p.rowHeight,
        width: p.columnWidthHeader,
        // backgroundColor: 'orange',
        overflow: 'hidden'
    }}
>
    <table
        style={merge(tableStyles(p).borderRight, {
            width: (p.columnWidthHeader),
            textAlign: 'center',
            marginBottom: 100
        })}
    >
        <tbody key="tableheaders">
            {p.rows.headers.map((row, key) => rowRenderer(row, key, p, a))}
        </tbody>
    </table>
</div>
    );
}
