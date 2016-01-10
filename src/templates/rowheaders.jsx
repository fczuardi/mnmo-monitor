import React from 'react';
import rowRenderer from './rowheader.jsx';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';

export default (p, a) => {
    p.rowHeight = p.rows.type === 'secondary' ? p.secondTableRowHeight : p.rowHeight;

    let hideFirstRow = p.rows.hideFirstRow && p.rows.type !== 'secondary';
    let headers = p.rows.headers.slice(hideFirstRow ? 1 : 0);
    return (
<div
    id={p.rowHeadersElementId || 'row-headers'}
    style={{
        height: p.rows.type === 'secondary' ? p.tableHeight : p.tableHeight - p.rowHeight,
        width: p.columnWidth,
        // backgroundColor: 'orange',
        overflow: 'hidden'
    }}
>
    <table
        style={merge({
            width: p.columnWidth,
            textAlign: 'center',
            marginBottom: 100
        }, tableStyles(p).borderRight)}
    >
        <tbody key="tableheaders">
            {headers.map((row, key) => rowRenderer(row, key, p, a))}
        </tbody>
    </table>
</div>
    );
}
