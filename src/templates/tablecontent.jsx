import React from 'react';
import rowRenderer from './tablerow.jsx';

export default (p, a) => {
    let tableContentHeight = p.rows.type === 'secondary' ?
                                                    p.tableHeight :
                                                    p.tableHeight - p.rowHeight;
    p.rowHeight = p.rows.type === 'secondary' ? p.secondTableRowHeight : p.rowHeight;
    let style = {
        width: p.tableWidth - p.columnWidth,
        height: tableContentHeight
    };
    if (p.rows.type === 'detailed'){
        // style.overflowY = 'hidden';
        // style.overflowX = 'auto';
        style.overflow = 'auto';
    } else if (p.rows.type === 'secondary'){
        style.overflow = 'hidden';
    }else{
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
