import React from 'react';
import rowRenderer from './tablerow.jsx';

export default (p, a) => {
    let draggableProps = {
        onTouchEnd: a.handleTouchEnd,
        onTouchStart: a.handleTouchStart,
        onTouchMove: a.handleTouchMove,
        onTouchCancel: a.handleTouchEnd
    };
    draggableProps = null;
    return (
<div 
    onScroll={a.onTableScroll}
    style={{
        width: p.tableWidth - p.columnWidth,
        height: p.tableHeight - p.rowHeight,
        // backgroundColor: 'yellow',
        overflow: 'auto'
    }}
    {...draggableProps}
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
