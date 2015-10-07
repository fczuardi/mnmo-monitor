import React from 'react';
import keys from 'lodash/object/keys';
import tableStyles from '../styles/tablestyles';
import {varTypes} from '../../config/apiHelpers';

const chartTopPadding = 50;

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
    let varsCount = keys(p.vars.combos).length;
    let columnColors = tableStyles(p).columnColors;
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
        for (var j= col.length - 1; j >= 0 ; j -= 1){
            if (
                (j < p.ui.lastVisibleRow) &&
                (j % varsCount === 0)
            ){
                let value = col[j];
                maxValue = Math.max(maxValue, value);
                newCol.push(value);
            }
        }
        columns.push(newCol);
    }
    // console.log('fullColumns', fullColumns);
    // console.log('columns', columns);
    let chartWidth = p.ui.screenWidth - 60;
    let chartHeight = p. chartHeight - chartTopPadding;
    let firstColumn = columns[0];
    let chartDivisions = firstColumn.map( (cell, cellIndex) => {
        let percentX = (firstColumn.length - 1 - cellIndex) / (firstColumn.length - 1);
        let scaledPercentX = Math.sqrt(percentX);
        let x = chartWidth - scaledPercentX * chartWidth;
        return Math.round(x);
    });
    let divisionElements = chartDivisions.map( (x, index) => {
        if (index === chartDivisions.length - 1){
            return null;
        }
        let headerIndex = varsCount * (chartDivisions.length - 2 - index);
        let nextX = chartDivisions[index + 1];
        let type = p.rows.headers[headerIndex] ? p.rows.headers[headerIndex][3] : 0;
        let fillColor = type === '1' ? '#5A0000' :
                        type === '2' ? '#003C5A' :
                        '#444444';
        let fillOpacity = 0.4;
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
