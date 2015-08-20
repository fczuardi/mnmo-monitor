import React from 'react';
import merge from 'lodash/object/merge';

import tableStyles from '../styles/tablestyles';

const chartTopPadding = 50;
const lineChartLength = 15; //last 15 minutes

function parseData(valueString){
    let values = valueString.split('|');
    let parsedValues = values.map( value => parseFloat(values[0]));
    let secondary = values[1] || null;
    return([
        isNaN(parsedValues[0]) ? 0 : parsedValues[0],
        isNaN(parsedValues[1]) ? 0 : parsedValues[1]
    ]);
}
export default (p) => {
    let columnColors = tableStyles(p).columnColors;
    let cellStyle = {
        position: 'relative',
        borderRight: '1px solid #000',
        width: p.columnWidth - 1,
        minWidth: p.columnWidth - 1
    };
    let emptyCell = (
        <td key="first" style={cellStyle}></td>
    );
    let groupID = p.groups.selected === null ? '' :
                p.groups.selected.secondaryId !== -1 ?
                p.groups.selected.secondaryId : p.groups.selected.id;
    let firstRowCells = p.rows.data[0] ? p.rows.data[0] : [];
    //create an array of n empty arrays where n = number of columns
    let columns = firstRowCells.map( () => ([]) ); 

    let maxValue = 0; //max value in the past 15min
    p.rows.data.forEach( (row, rowIndex) => {
        if (rowIndex >= lineChartLength) { return; }
        row.forEach( (cell, index) => {
            let value = parseData(cell)[0];
            columns[index].push(value);
            maxValue = Math.max(maxValue, value);
        });
    });
    
    let textData = [],
        data = [];
    
    
    firstRowCells.forEach( (cellValue) => {
        data.push(parseData(cellValue));
    });

    let maxPixelValue = p.chartHeight - chartTopPadding;
    let row = (
        <tr
            style={{
                height: p.chartHeight
            }}
        >
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            let backgroundColor = columnColors[(key % columnColors.length)];
            let values = data[key] ? data[key] : [0, 0];
            let valuePercent = values[0] / maxValue;
            let valuePixels = Math.ceil(valuePercent * maxPixelValue);
            let textValues = firstRowCells[key] ? firstRowCells[key].split('|') : ['', ''];
            let lineChartWidth = cellStyle.width;
            let lineChartHeight = maxPixelValue;
            let dataHistory = columns[key];
            let linePath = '';
            if (dataHistory !== undefined) {
                dataHistory.forEach( (value, rowIndex) => {
                    let pX = (dataHistory.length - 1 - rowIndex) / (dataHistory.length - 1);
                    let x = Math.round(pX * lineChartWidth); 
                    let pY = value / maxValue;
                    let y = 1 + Math.round(lineChartHeight - pY * lineChartHeight);
                    linePath += rowIndex === 0 ? 
                                    `M${x},${y}` :
                                    `L${x},${y}`;
                });
            }

            return (
            <td key={key} style={cellStyle}>
                <div
                    style={{
                        backgroundColor: backgroundColor,
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: valuePixels
                    }}
                >
                    <div
                        style={{
                            width: 5,
                            height: 5,
                            position: 'absolute',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5,
                            top: -2,
                            right: -2
                        }}
                    ></div>
                </div>
                <svg
                    width={lineChartWidth}
                    height={lineChartHeight}
                    shepe-rendering={'crispEdges'}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                    }}
                >
                    <path
                        d={linePath}
                        stroke={'white'}
                        strokeWidth={1}
                        fill={'none'}
                    >
                    </path>
                </svg>
                <p
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: 0,
                        textAlign: 'right',
                        fontSize: 17,
                        marginTop: - (10 + 17),
                        color: '#FFFFFF'
                    }}
                >
                    {textValues[0]}
                </p>
                <p
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: 0,
                        textAlign: 'right',
                        fontSize: 12,
                        marginTop: - (28 + 12),
                        color: '#FFFFFF',
                        opacity: 0.5
                    }}
                >
                    {(values[1] > 0) ? textValues[1] + '%' : ''}
                </p>
            </td>
            );
        })}
        </tr>
    );
    return (
        <div
            id="table-images"
            style={{
                width: p.ui.screenWidth,
                overflow: 'hidden'
            }}
        >
            <table style={{marginLeft: 1}}>
                <tbody>
                    {row}
                </tbody>
            </table>
        </div>
    );
};
