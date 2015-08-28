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
    return (
        <svg
            width={chartWidth}
            height={p.chartHeight}
            style={{
                bottom: 0,
                marginLeft: 30,
                // backgroundColor: 'rgba(255, 255, 255, 0.3)',
                overflow: 'hidden'
            }}
        >
            {columns.map( (column, index) => {
                let backgroundColor = columnColors[(index % columnColors.length)];
                let points = column.map( (cell, cellIndex) => {
                    let percentY = cell / maxValue;
                    let percentX = (column.length - 1 - cellIndex) / (column.length - 1);
                    let scaledPercentX = Math.sin(percentX * Math.PI/2);
                    // let x = percentX * chartWidth;
                    // console.log('percentX', percentX, scaledPercentX);
                    let x = chartWidth - scaledPercentX * chartWidth;
                    let y = chartTopPadding + chartHeight - percentY * chartHeight;
                    return `L${x}, ${y} `;
                });
                let linePath = 'M' + points.join(' ').substring(1);
                return (
                    <path
                        key={index}
                        d={linePath}
                        strokeWidth={1}
                        stroke={backgroundColor}
                        fill='none'
                    >
                    </path>
                );
            })}
        </svg>
    );
};
