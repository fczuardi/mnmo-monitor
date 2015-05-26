import React from 'react';
import rowRenderer from './rowheader.jsx';

export default (p) => 
<div
    style={{
        height: p.tableHeight - p.rowHeight,
        width: p.columnWidth,
        // backgroundColor: 'orange',
        overflow: 'hidden'
    }}
>
    {p.rows.headers.map((row, key) => rowRenderer(row, key, p))}
</div>;
