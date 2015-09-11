import React from 'react';
import merge from 'lodash/object/merge';

import {varTypes} from '../../config/apiHelpers';
import tableStyles from '../styles/tablestyles';

const lineChartLength = 30; //last 30 minutes

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
    const isPercent = varTypes[p.vars.combo.first] === 'percent';
    let chartTopPadding = p.ui.isMobile ? 70 : 50;
    let columnColors = tableStyles(p).columnColors;
    let cellStyle = {
        position: 'relative',
        // borderRight: '1px solid #000',
        width: p.columnWidth - 1,
        minWidth: p.columnWidth - 1
    };
    let emptyCell = (
        <td key="first" style={cellStyle}></td>
    );
    let groupID = p.groups.selected === null ? '' :
                p.groups.selected.secondaryId !== -1 ?
                p.groups.selected.secondaryId : p.groups.selected.id;
    let firstRowIndex = p.rows.type === 'merged' ? 1 : 0;
    let firstRowCells = p.rows.data[firstRowIndex] ? p.rows.data[firstRowIndex] : [];
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
    let pieValues = [];
    let pieSum = 0;
    let lastPiePieceValue = 100;
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
            let valuePercent = maxValue > 0 ? values[0] / maxValue : 0;
            pieValues.push(values[0]);
            pieSum += values[0] < 100 ? values[0] : 0;
            lastPiePieceValue -= values[0] === 100 ? 0 : values[0];
            let valuePixels = isPercent || maxValue === 0 ? 10 : Math.ceil(valuePercent * maxPixelValue);
            // console.log('valuePixels', key, valuePercent, values[0], maxValue, valuePixels, valuePercent, maxPixelValue);
            let textValues = firstRowCells[key] ? firstRowCells[key].split('|') : ['', ''];
            let lineChartWidth = cellStyle.width;
            let lineChartHeight = maxPixelValue;
            let dataHistory = columns[key];
            let svgLine = null;
            let lineDot = null;
            let mainTextValue = null;
            let secondaryTextValue = null;
            
            if (
                !isPercent && 
                dataHistory !== undefined 
                // !(p.rows.type === 'merged' && p.user.autoUpdate === true)
            ) {
                let linePath = '';
                dataHistory.forEach( (value, rowIndex) => {
                    if (rowIndex < firstRowIndex){
                        //ignore the first "special" row of the merged type 
                        //tables for the line chart construction
                        return null;
                    }
                    let pX = (dataHistory.length - 1 - firstRowIndex - rowIndex) / (dataHistory.length - 1 - firstRowIndex);
                    let x = Math.round(pX * lineChartWidth); 
                    let pY = value / maxValue;
                    let y = Math.round((lineChartHeight - 2) - pY * (lineChartHeight - 2)) + 1;
                    linePath += `L${x},${y} `;
                });
                linePath = 'M' + linePath.substring(1);
                // console.log('linePath', key, linePath);
                svgLine = (
                    <svg
                        width={lineChartWidth}
                        height={lineChartHeight}
                        style={{
                            position: 'absolute',
                            shapeRendering: 'crispedges',
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
                );
                lineDot = (
                    <div
                        style={{
                            display: isPercent ? 'none' : 'block',
                            width: 5,
                            height: 5,
                            position: 'absolute',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5,
                            top: -2,
                            right: -2,
                            zIndex: 1
                        }}
                    ></div>
                );
            }
            if (!isPercent) {
                mainTextValue = (
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
                );
                secondaryTextValue = (
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
                        {((values[1] > 0) && (textValues[1] !== '-')) ? 
                                                    textValues[1] + '%' : ''}
                    </p>
                );
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
                    {lineDot}
                    {mainTextValue}
                    {secondaryTextValue}
                </div>
                {svgLine}
            </td>
            );
        })}
        </tr>
    );
    let pieChartWidth = p.ui.screenWidth;
    // let pieChartPadding = 14;
    let pieChartHeight = p.chartHeight;
    let centerX = pieChartWidth / 2;
    let centerY = pieChartHeight / 2;
    let rx = pieChartHeight / 2 - p.tableTitleHeight;
    let ry = pieChartHeight / 2 - p.tableTitleHeight;
    let startAngle = 0;
    let endAngle = 0;
    // console.log('lastPiePieceValue', lastPiePieceValue);
    let pieChart = !isPercent ? null : (
        <svg
            width={pieChartWidth}
            height={pieChartHeight}
            style={{
                position: 'fixed',
                // shapeRendering: 'crispedges',
                top: 60,
            }}
        >
            {pieValues.map( (value, index) => {
                if (value === 100) { return } //ignore total-kind values
                let percent = value / pieSum;
                let backgroundColor = columnColors[(index % columnColors.length)];
                endAngle = startAngle + percent * (2 * Math.PI);
                if (percent > 0.999){
                    console.log('one single value');
                    endAngle *= 0.999;
                }
                let x1 = (centerX + rx * Math.cos(startAngle));
                let x2 = (centerX + rx * Math.cos(endAngle));
                let y1 = (centerY + rx * Math.sin(startAngle));
                let y2 = (centerY + rx * Math.sin(endAngle));
                let largeArc = percent > 0.5 ? 1 : 0;
                // console.log('value, pieSum, percent', value, pieSum, percent, largeArc);
                let piePath = `M${centerX},${centerY} L${x1},${y1} A${rx} ${ry} 0 ${largeArc} 1 ${x2} ${y2} z`;
                // let piePath = `M${centerX},${centerY} L${x1},${y1} L${x2} ${y2} z`;
                startAngle = endAngle;
                return (
                    <path
                        key={index}
                        d={piePath}
                        strokeWidth={1}
                        fill={backgroundColor}
                        stroke='none'
                    >
                    </path>
                );
            })}
        </svg>
    );

    return (
        <div
            id="column-bars"
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
            {pieChart}
        </div>
    );
};
