import React from 'react';
import merge from 'lodash/object/merge';

import tableStyles from '../styles/tablestyles';

const smallColumnWidth = 60;
const mediumColumnWidth = 106;

export default (p) => {
    let columnColors = tableStyles(p).columnColors;
    let cellStyle = {
        position: 'relative',
        borderRight: '1px solid #000',
        width: p.columnWidth - 1,
        minWidth: p.columnWidth - 1
    };
    let mobileCellStyle = {
        height: p.rowHeight,
        overflow: 'hidden',
        position: 'relative',
        borderRight: '1px solid #000',
        width: 2 * p.columnWidth - 1,
        minWidth: 2 * p.columnWidth - 1,
    };
    let emptyCell = p.ui.isMobile ? null : (
        <td key="first" style={cellStyle}></td>
    );
    let groupID = p.groups.selected === null ? '' :
                p.groups.selected.secondaryId !== -1 ?
                p.groups.selected.secondaryId : p.groups.selected.id;
    console.log('p.rows.data[0]', p.rows.data[0]);
    let firstRowCells = p.rows.data[0] ? p.rows.data[0] : [];
    let data = firstRowCells.map( (cellValue) => {
        let value = parseFloat(cellValue.split('|')[0]);
        return isNaN(parseFloat(value)) ? 0 : value
    });
    console.log('data', data);
    let maxValue = data.reduce( (pastValue, value) => {
        return Math.max(pastValue, value);
    }, 0);
    let chartTopPadding = 50;
    let maxPixelValue = p.chartHeight - chartTopPadding;
    console.log('maxValue', maxValue);
    let row = (
        <tr
            style={{
                height: p.chartHeight
            }}
        >
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            let backgroundColor = columnColors[(key % columnColors.length)];
            let value = data[key] || 0;
            let valuePercent = value / maxValue;
            let valuePixels = Math.ceil(valuePercent * maxPixelValue);
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
                </div>
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
