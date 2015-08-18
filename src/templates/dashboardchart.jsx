import React from 'react';
import merge from 'lodash/object/merge';
import tableStyles from '../styles/table';

const smallColumnWidth = 60;
const mediumColumnWidth = 106;

export default (p) => {
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
    let row = (
        <tr>
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            return (
            <td key={key} style={cellStyle}>
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
