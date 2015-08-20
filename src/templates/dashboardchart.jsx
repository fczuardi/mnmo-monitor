import React from 'react';
import merge from 'lodash/object/merge';

import tableStyles from '../styles/tablestyles';

const chartTopPadding = 50;

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
    let emptyCell = (
        <td key="first" style={cellStyle}></td>
    );
    let groupID = p.groups.selected === null ? '' :
                p.groups.selected.secondaryId !== -1 ?
                p.groups.selected.secondaryId : p.groups.selected.id;
    let firstRowCells = p.rows.data[0] ? p.rows.data[0] : [];
    
    let textData = [],
        data = [];
    
    
    firstRowCells.forEach( (cellValue) => {
        let values = cellValue.split('|');
        let parsedValues = values.map( value => parseFloat(values[0]));
        let secondary = values[1] || null;
        textData.push(values);
        data.push([
            isNaN(parsedValues[0]) ? 0 : parsedValues[0],
            isNaN(parsedValues[1]) ? 0 : parsedValues[1]
        ]);
    });
    let maxValue = data.reduce( (pastValue, value) => {
        return Math.max(pastValue, value[0]);
    }, 0);
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
            let textValues = textData[key] ? textData[key] : ['', ''];
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
