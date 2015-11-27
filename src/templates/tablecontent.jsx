import React from 'react';
import rowRenderer from './tablerow.jsx';

export default (p, a) => {
    let style = {
        width: p.tableWidth - p.columnWidth,
        height: p.tableHeight - p.rowHeight
    };
    if (p.rows.type === 'detailed'){
        // style.overflowY = 'hidden';
        // style.overflowX = 'auto';
        style.overflow = 'auto';
    } else {
        style.overflow = 'auto';
    }

    return (
<div
    id={p.tableContentsElementId || 'table-contents'}
    onScroll={a.onTableScroll}
    style={style}
>
    <table
        style={{
            textAlign: 'center'
        }}
    >
        <tbody>
            {p.rows.data.map((row, key) => rowRenderer(row, key, p))}
        </tbody>
    </table>
</div>
    );
};
