import React from 'react';
import keys from 'lodash/object/keys';
import tableStyles from '../styles/tablestyles';
import {varTypes} from '../../config/apiHelpers';

const chartTopPadding = 50;

function parseData(valueString){
    if (valueString === undefined){
        return [0,0];
    }
    valueString = valueString.indexOf('|') !== -1 ? valueString : valueString+'|0';
    // console.log('valueString', valueString);
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
    let defaultColumnColors = tableStyles(p).columnColors;
    let columnColors = p.columns.customColors? p.columns.customColors: defaultColumnColors;
    let fullColumns = p.rows.columns.map( (c, index) => {
        return c.map( (cell, cellIndex) => {
            let value = parseData(cell)[0];
            maxValue = Math.max(maxValue, value);
            return value;
        })
    });
    let columns = [];
    let maxValue = 0; //max value in the past 15min
    for (var i = 0; i < fullColumns.length; i++){
        let col = fullColumns[i];
        let newCol = [];
        // console.log('col.length', col.length,
        //     'p.ui.lastVisibleRow', p.ui.lastVisibleRow
        // );
        let rowSum = 0;
        for (var j= col.length - 1; j >= 0 ; j -= 1){
            let value = col[j];
            maxValue = Math.max(maxValue, value);
            newCol.push(value);
            rowSum += 1;
        }
        columns.push(newCol);
    }
    // console.log('fullColumns', fullColumns);
    // console.log('columns', columns);
    let chartWidth = p.ui.screenWidth - 60;
    let chartHeight = p. chartHeight - chartTopPadding;
    let firstColumn = columns[0];
    let chartDivisions = firstColumn.map( (cell, cellIndex) => {
        let percentX = (cellIndex) / (firstColumn.length - 1);

        let scaledPercentX = Math.sqrt(1 - percentX); //exponential
        // let scaledPercentX = 1 - percentX; //linear

        let x = chartWidth - scaledPercentX * chartWidth;
        return Math.round(x);
    });
    // chartDivisions = [0].concat(chartDivisions);
    // console.log('chartDivisions', chartDivisions, chartDivisions.length);
    // console.log('firstColumn', firstColumn, firstColumn.length);
    let divisionElements = chartDivisions.map( (x, index) => {
        if (index === chartDivisions.length - 1){
            return null;
        }
        let headerIndex = (chartDivisions.length - 2 - index);
        // console.log('headerIndex', headerIndex);
        // let nextX = chartDivisions[index + 1] || 0;
        let nextX = chartDivisions[index + 1];
        let type = p.rows.headers[headerIndex] ? p.rows.headers[headerIndex][3] : 0;
        let fillColor = type === '1' ? '#5A0000' :
                        type === '2' ? '#003C5A' :
                        '#444444';
        let fillOpacity = 0.4;
        // console.log('division', x, nextX);
        let width = Math.max(0, nextX - x - 1);
        return width <= 0 ? null : (
            <rect
                key={index}
                x={x}
                y={0}
                width={width}
                height={p.chartHeight}
                fill={fillColor}
                fillOpacity={fillOpacity}
            />
        );
    });
    return (
        <svg
            width={chartWidth}
            height={p.chartHeight}
            style={{
                bottom: 0,
                marginLeft: 30,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                overflow: 'hidden'
            }}
        >
            {divisionElements}
            {columns.map( (column, index) => {
                let backgroundColor = columnColors[(index % columnColors.length)];
                let points = column.map( (cell, cellIndex) => {
                    let percentY = cell / maxValue;
                    let x = chartDivisions[cellIndex];
                    let y = chartTopPadding + chartHeight - percentY * chartHeight;
                    y = (typeof y !== 'number') ? 0 : y;
                    return `L${x}, ${y} `;
                });
                let strokeWidth = p.columns.selected === index ? 8 : 1;
                let linePath = 'M' + points.join(' ').substring(1);
                return (
                    <path
                        key={index}
                        d={linePath}
                        strokeWidth={strokeWidth}
                        stroke={backgroundColor}
                        fill='none'
                    >
                    </path>
                );
            })}
        </svg>
    );
};
