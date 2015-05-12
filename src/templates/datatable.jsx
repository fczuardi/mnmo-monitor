import React from 'react';
import {Table, Column} from 'fixed-data-table';

// Table data as a list of array.

function firstCell(p, a){
    return (
        <button
            style={{background: 'none', border: 'none'}}
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
    return column.icons ? 
            React.DOM.img({
                src: column.icons.legacy,
                width: 50,
                height: 50
            }) : 
            React.DOM.p(null, column.label);
}

let headerHeight = 50 + 2 * 8;
let columnWidth = 106;

export default (p,a) => 
<Table
    width={p.ui.screenWidth}
    height={p.ui.screenHeight - 56 - 10}
    rowsCount={p.rows.data.length}
    rowHeight={columnWidth}
    headerHeight={columnWidth}
    rowGetter={(index) => (p.rows.data[index]) }
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
{p.rows.columns.map( (column, key) => (
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
</Table>;
