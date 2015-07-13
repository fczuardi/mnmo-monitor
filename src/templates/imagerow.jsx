import React from 'react';
import URLs from '../../config/endpoints.js';

const smallColumnWidth = 60;
const mediumColumnWidth = 106;

export default (p) => {
    let cellStyle = {
        width: p.columnWidth,
        minWidth: p.columnWidth
    };
    let mobileCellStyle = {
        height: p.rowHeight,
        overflow: 'hidden',
        position: 'relative',
        width: 2 * p.columnWidth,
        minWidth: 2 * p.columnWidth,
    };
    let imageStyle = {
        position: p.ui.isMobile ? 'absolute': 'inherit',
        top: 0,
        width: '100%'
    }
    let failedImage = (event) => {
            event.target.style.display = 'none';
        },
        loadedImage = (event) => {
            event.target.style.display = 'block';
        };
    let emptyCell = p.ui.isMobile ? null : (
        <td key="first" style={cellStyle}></td>
    );
    let groupID = p.groups.selected === null ? '' :
                p.groups.selected.secondaryId !== -1 ?
                p.groups.selected.secondaryId : p.groups.selected.id;
    let imgElement = (column) => ( column !== null ? (
        <img 
            onLoad={loadedImage}
            onError={failedImage}
            style={imageStyle}
            src={(
                URLs.thumbnailsUrl +
                '?' +
                URLs.images.groupParam + '=' + groupID + '&' +
                URLs.images.columnParam + '=' + column.id + '&' +
                URLs.images.dayParam + '=' + p.rows.date.split('-').join('') + '&' +
                URLs.images.hourParam + '=' + p.ui.minute
            )}
        />
        ) : (
            <div></div>
        )
    );
    let firstLine = (
        <tr>
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            return (
            <td key={key} style={cellStyle}>
                {imgElement(column)}
            </td>
            );
        })}
        </tr>
    );
    let secondLine = null;
    if (p.ui.isMobile){
        let first = [];
        let second = [];
        let bucket = first;
        //special case, only 2 columns and second selected
        if (p.columns.enabled.length === 2 && p.columns.selected === 1){
            first.push({
                key: 1,
                rowsSpan: 2
            });
            first.push({
                key: 0,
                rowSpan: 1
            });
        } else {
            p.columns.enabled.forEach( (column, key) => {
                let selected = p.columns.selected;
                let selectedIsOdd = (selected % 2 === 1);
                let isSelected = (key === selected);
                let isPreviousSelected = ((key - 1) === selected);
                let isNextSelected = ((key + 1) === selected);
                let isOdd = (key % 2 === 1);
                
                if (isSelected){
                    first.push({
                        key: key,
                        rowsSpan: 2
                    });
                } else {
                    if (key < selected) {
                        if (!isOdd) {
                            first.push({
                                key: key,
                                rowSpan: 1
                            });
                        } else {
                            second.push({
                                key: key,
                                rowSpan: 1
                            });
                        }
                    } else {
                        if (isOdd) {
                            first.push({
                                key: key,
                                rowSpan: 1
                            });
                        } else {
                            second.push({
                                key: key,
                                rowSpan: 1
                            });
                        }
                    }
                }
            });
        }
        if (p.columns.enabled.length % 2 === 0){
            second.push({
                key: -1,
                rowSpan: 1
            });            
        }
        // console.log('first, second', first, second);
        
        firstLine = ( 
            <tr>
            {first.map( (cell, key) => {
                let column = p.columns.enabled[cell.key];
                return (
                    <td key={key} style={mobileCellStyle} rowSpan={cell.rowsSpan}>
                    {imgElement(column)}
                    </td>
                );
            })}
            </tr>
        );
        secondLine = ( 
            <tr>
            {second.map( (cell, key) => {
                let column = cell.key !== -1 ? 
                                p.columns.enabled[cell.key]: null;
                return (
                    <td key={key} style={mobileCellStyle} rowSpan={cell.rowsSpan}>
                    {imgElement(column)}
                    </td>
                );
            })}
            </tr>
        );

        
    }
    return (
        <div
            id="table-images"
            style={{
                width: p.ui.screenWidth,
                overflow: 'hidden'
            }}
        >
            <table>
                <tbody>
                    {firstLine}
                    {secondLine}
                </tbody>
            </table>
        </div>
    );
};
