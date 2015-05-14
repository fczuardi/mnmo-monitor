import React from 'react';
import {Table, Column} from 'fixed-data-table';
import {FormattedNumber} from 'react-intl';
import {varTypes} from '../../config/apiHelpers';

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
    let tableContentHeight = rowsCount * rowHeight;
    // HACK: while fixed-data-table doesn't properly support touch devices
    // see: https://github.com/facebook/fixed-data-table/issues/84
    let overflowY = (isMobile || rowsCount === 0) ? 'hidden' : 'auto';
    let overflowX = (isMobile || rowsCount === 0) ? 'hidden' : 'auto';
    let tableClassName = rowsCount === 0 ? 'emptyTable' : '';

    let rowClassNameGetter = (index) => ( 
        (p.rows.type === 'merged' && index === 0) ? 'firstMergedRow' :
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
    
    let rowHeaderRenderer = (cellData, cellDataKey, rowData, rowIndex) => {
        let value = parseFloat(p.rows.headers[rowIndex][1]);
        let mainHeader = (
            <p style={{margin: 0, fontSize: 17}}>
                {p.rows.headers[rowIndex][0]}
            </p>
        );
        let secondHeader = isNaN(value) ? (null) : (
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
        );
        return (
            <div>
                {mainHeader}
                {secondHeader}
            </div>
        );
    };
    
    let numberElement = (value, valueString, isPercent) => (
        isNaN(value) ? (valueString) : (
            (isPercent) ? (
                <FormattedNumber 
                    locales={p.language.messages.locale} 
                    value={value}
                    style="percent"
                    minimumFractionDigits={0}
                    maximumFractionDigits={2}
                />
            ) : (
                <FormattedNumber 
                    locales={p.language.messages.locale} 
                    value={value}
                />
            )
        )
    );

    let cellRenderer = (cellData, cellDataKey, rowData, rowIndex) => {
        let content = p.rows.data[rowIndex][cellDataKey] ? p.rows.data[rowIndex][cellDataKey] : '';
        let values = content.split('|');
        let mainValue = parseFloat(values[0]);
        let secondaryValue = (values[1] !== undefined) ? parseFloat(values[1]) : undefined;
        let isFirstValuePercent = varTypes[p.vars.combo.first] === 'percent';
        let isSecondValuePercent = varTypes[p.vars.combo.second] === 'percent';
        mainValue = (isFirstValuePercent) ? mainValue / 100 : mainValue;
        secondaryValue = (isSecondValuePercent) ? secondaryValue / 100 : secondaryValue;
        
        let firstLine = numberElement(
                mainValue, 
                values[0], 
                isFirstValuePercent
        );
        let secondLine = (secondaryValue !== undefined) ? (numberElement(
                secondaryValue, 
                values[1], 
                isSecondValuePercent
        )) : (null);

        return (! secondLine) ? (
            <span>
                {firstLine}
            </span>
        ) : (
            <div>
                <span>{firstLine}</span><br/>
                <span className="secondary">{secondLine}</span>
            </div>
        );
    };

    // let draggableArea = (
    //     <div style={{
    //         height: (tableHeight - headerHeight - 20),
    //         width: (tableWidth - columnWidth),
    //         position: 'absolute',
    //         top: headerHeight,
    //         left: columnWidth,
    //         opacity: 0.5,
    //         overflow: 'auto'
    //     }}>
    //         <img 
    //             style={{
    //                 position: 'absolute',
    //                 width: columnsCount * columnWidth,
    //                 height: rowsCount * columnWidth,
    //             }}
    //             src="./img/bg01.jpg" 
    //         />
    //     </div>
    // );

    return (
        <div className={tableClassName}>
            <Table
                width={tableWidth}
                maxHeight={tableHeight}
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
                    key={('column-' + key)}
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
