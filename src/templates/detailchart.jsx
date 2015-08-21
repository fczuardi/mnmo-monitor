import React from 'react';
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
    let columnColors = tableStyles(p).columnColors;
    let firstRowCells = p.rows.data[0] ? p.rows.data[0] : [];
    let columns = firstRowCells.map( () => ([]) ); 
    let maxValue = 0; //max value in the past 15min
    p.rows.data.forEach( (row, rowIndex) => {
        row.forEach( (cell, index) => {
            let value = parseData(cell)[0];
            columns[index].push(value);
            maxValue = Math.max(maxValue, value);
        });
    });
    let chartWidth = p.ui.screenWidth;
    let chartHeight = p. chartHeight;
    return (
        <svg
            width={chartWidth}
            height={p.chartHeight}
            style={{
                bottom: 0,
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
            }}
        >
            {columns.map( (column, index) => {
                if(isPercent && column === 100) {
                    return null;
                }
                let backgroundColor = columnColors[(index % columnColors.length)];
                let points = column.map( (cell, index) => {
                    let percentY = cell / maxValue;
                    let percentX = (column.length - 1 - index) / (column.length - 1)
                    return `L${percentX * chartWidth}, ${chartHeight - percentY * chartHeight }`;
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
