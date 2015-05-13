import React from 'react';
import {Table, Column} from 'fixed-data-table';

// Table data as a list of array.

function firstCell(p, a){
    return (
<button
    className='headerCell'
    style={{border: 'none'}}
    data-type={p.rows.type}
    onClick={a.firstHeaderButtonClick}
>
    {( p.rows.type === 'list' ?
        p.language.messages.rows.mergeRows :
        p.language.messages.rows.unmergeRows
    )}
</button>
    );
}

function columnHeaderRenderer(column){
    return column.icons ? (
<div className='headerCell'>
    <img 
        src={column.icons.table}
        width={50}
        height={50}
    />
</div>
    ) : (
<div className='headerCell'>
    <p>
        {column.label}
    </p>
</div>
    );
}

let chartHeight = 264;

export default (p,a) => {
    let headerHeight = 50 + 2 * 8;
    let columnWidth = 106;
    
    // HACK: while fixed-data-table doesn't properly support touch devices
    // see: https://github.com/facebook/fixed-data-table/issues/84
    let overflowY = 'hidden';
    let overflowX = 'hidden';
    // let overflowX = 'auto';
    let tableHeight = p.ui.screenHeight - 56;
    let columnsCount = p.columns.enabled.length;
    let rowsCount = p.rows.data.length;
    let tableWidth = p.ui.screenWidth;
    // let tableWidth = (columnsCount + 1) * columnWidth;

    let draggableArea = (
<div style={{
    height: (tableHeight - headerHeight - 20),
    width: (tableWidth - columnWidth),
    position: 'absolute',
    top: headerHeight,
    left: columnWidth,
    opacity: 0.5,
    overflow: 'auto'
}}>
    <img 
        style={{
            position: 'absolute',
            width: columnsCount * columnWidth,
            height: rowsCount * columnWidth,
        }}
        src="./img/bg01.jpg" 
    />
</div>
    );
    return (
<div style={{
    position: 'relative'
}}>
    <Table
        width={tableWidth}
        height={tableHeight}
        rowsCount={rowsCount}
        rowHeight={columnWidth}
        headerHeight={headerHeight}
        rowGetter={(index) => (p.rows.data[index]) }
        overflowY={overflowY}
        overflowX={overflowX}
    >
        <Column
            dataKey={0}
            fixed={true}
            align='center'
            width={columnWidth}
            headerRenderer={() => firstCell(p,a) }
            cellRenderer={(cellData, cellDataKey, rowData, rowIndex) => 
                                            (p.rows.headers[rowIndex][0]) }
        />
    {p.columns.enabled.map( (column, key) => (
        <Column
            dataKey={key}
            flexGrow={1}
            align='center'
            width={columnWidth}
            headerRenderer={() => columnHeaderRenderer(column) }
            cellRenderer={(cellData, cellDataKey, rowData, rowIndex) => 
                                            (p.rows.data[rowIndex][cellDataKey]) }
        />
    ))}
    </Table>
</div>
    );
}
