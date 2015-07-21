import React from 'react';
import URLs from '../../config/endpoints.js';
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
    let imageStyle = {
        width: '100%',
        top: 0
    };
    if (p.ui.isMobile){
        imageStyle.position = 'absolute';
    }
    let failedImage = (event) => {
            event.target.parentNode.style.height = 'auto';
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
    let imgElement = (column, key) => {
        if (column === null){
            return(
                <div></div>
            );
        }
        let columnColors = tableStyles(p).columnColors;
        let backgroundColor = columnColors[(key % columnColors.length)]
        let style = merge({}, imageStyle);
        if (p.columns.selected === key && p.ui.isMobile){
            style = merge(style, {height: '100%', width:'auto'});
        }
        return (
            <div 
                key={key}
            >
            <img 
                onLoad={loadedImage}
                onError={failedImage}
                style={style}
                src={(
                    URLs.thumbnailsUrl +
                    '?' +
                    URLs.images.groupParam + '=' + groupID + '&' +
                    URLs.images.columnParam + '=' + column.id + '&' +
                    URLs.images.dayParam + '=' + p.rows.date.split('-').join('') + '&' +
                    URLs.images.hourParam + '=' + p.ui.minute
                )}
            />
            <div 
                style={{
                    position: 'absolute',
                    backgroundColor: backgroundColor,
                    width: 6,
                    height: '100%',
                    top: 0,
                    right: 0
                }}
            ></div>
            
            </div>
        );
    };
    let firstLine = (
        <tr>
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            return (
            <td key={key} style={cellStyle}>
                {imgElement(column, key)}
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
                    {imgElement(column, cell.key)}
                    </td>
                );
            })}
            </tr>
        );
        secondLine = ( 
            <tr>
            {second.map( (cell, key) => {
                let isEmptyCell = cell.key === -1;
                let column = isEmptyCell ? null :
                                p.columns.enabled[cell.key];
                let style = mobileCellStyle;
                if (isEmptyCell){
                    style = merge(style, {height: 'auto'});
                }
                return (
                    <td key={key} style={style} rowSpan={cell.rowsSpan}>
                    {imgElement(column, cell.key)}
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
            <table style={{marginLeft: 1}}>
                <tbody>
                    {firstLine}
                    {secondLine}
                </tbody>
            </table>
        </div>
    );
};
