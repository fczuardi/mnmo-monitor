import React from 'react';
import rowRenderer from './tablerow.jsx';

export default (p, a) => {
    return (
<div 
    id="table-contents"
    onScroll={a.onTableScroll}
    style={{
        width: p.tableWidth - p.columnWidth,
        height: p.tableHeight - p.rowHeight,
        overflowX: 'auto',
        overflowY: 'auto'
    }}
>
    <table
        style={{
            textAlign: 'center'
        }}
    >
        {p.rows.data.map((row, key) => rowRenderer(row, key, p))}
    </table>
</div>
    );
};
