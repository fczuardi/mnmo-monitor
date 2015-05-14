import React from 'react';
import {Table, Column} from 'fixed-data-table';
import {FormattedNumber} from 'react-intl';

export default (p,a) => {

    const smallColumnWidth = 60;
    const mediumColumnWidth = 106;
    const mobileBreakpointWidth = 599;
    const cellPadding = 8;
    const rowHeight = 60;
    const appHeaderHeight = 56;
    const chartHeight = 264;

    let isMobile = (p.ui.screenWidth <= mobileBreakpointWidth);
    let columnWidth = isMobile ? smallColumnWidth : mediumColumnWidth;
    let headerHeight = smallColumnWidth;
    let iconWidth = smallColumnWidth - 2 * cellPadding;
    let columnsCount = p.columns.enabled.length;
    let rowsCount = p.rows.data.length;
    let tableWidth = p.ui.screenWidth;
    let tableHeight = p.ui.screenHeight - 
                        appHeaderHeight - 
                        (isMobile ? 0 : chartHeight);
    // HACK: while fixed-data-table doesn't properly support touch devices
    // see: https://github.com/facebook/fixed-data-table/issues/84
    let overflowY = isMobile ? 'hidden' : 'auto';
    let overflowX = isMobile ? 'hidden' : 'auto';

    let rowClassNameGetter = (index) => (
        (p.rows.headers[index] && p.rows.headers[index][2]) ? 
                                    'rowType' + p.rows.headers[index][2] : ''
    );

    let firstCell = (
        <button
            className='headerCell'
            style={{
                border: 'none', 
                width: '100%', 
                backgroundColor: 'inherit',
                color: '#767677',
                textTransform: 'uppercase'
            }}
            data-type={p.rows.type}
            onClick={a.firstHeaderButtonClick}
        >
            {( p.rows.type === 'list' ?
                p.language.messages.rows.mergeRows :
                p.language.messages.rows.unmergeRows
            )}
        </button>
    );

    let columnHeaderRenderer = (column) => ( (column.icons) ? 
        (
            <img 
                src={column.icons.table}
                width={iconWidth}
                height={iconWidth}
                alt={column.label}
                title={column.label}
            />
        ) : (
            <span>
                {column.label}
            </span>
        )
    );
    
    let rowHeaderRenderer = (cellData, cellDataKey, rowData, rowIndex) => (
        <div>
            <p style={{margin: 0, fontSize: 17}}>
                {p.rows.headers[rowIndex][0]}
            </p>
            <p style={{margin: 0, fontSize: 15}}>
                <i 
                    className={(p.user.classID !== null) ? 
                            ('header-icon-' + p.user.classID) : ''}
                    style={{
                        fontSize: 12, 
                        marginRight: 3
                    }} 
                />
                <span style={{
                        lineHeight: '15px',
                        verticalAlign: 'text-top'
                    }}
                >
                    <FormattedNumber 
                        locales={p.language.messages.locale} 
                        value={p.rows.headers[rowIndex][1]} 
                    />
                </span>
            </p>
        </div>
    );
    
    let cellRenderer = (cellData, cellDataKey, rowData, rowIndex) => {
        let value = parseFloat(p.rows.data[rowIndex][cellDataKey]);
        return isNaN(value) ? (
            p.rows.data[rowIndex][cellDataKey]
        ) : (
            <FormattedNumber 
                locales={p.language.messages.locale} 
                value={value}
            />
        )
    };

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
}}>
    <Table
        width={tableWidth}
        height={tableHeight}
        rowsCount={rowsCount}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        rowGetter={(index) => (p.rows.data[index]) }
        rowClassNameGetter={rowClassNameGetter}
        overflowY={overflowY}
        overflowX={overflowX}
    >
        <Column
            fixed={true}
            dataKey={0}
            flexGrow={1}
            align='center'
            width={columnWidth}
            cellClassName='columnHeader'
            headerRenderer={() => (firstCell) }
            cellRenderer={rowHeaderRenderer}
        />
    {p.columns.enabled.map( (column, key) => (
        <Column
            key={key}
            dataKey={key}
            flexGrow={1}
            align='center'
            width={columnWidth}
            headerRenderer={() => columnHeaderRenderer(column) }
            cellRenderer={cellRenderer}
        />
    ))}
    </Table>
</div>
    );
}
