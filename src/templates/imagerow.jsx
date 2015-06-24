import React from 'react';
import URLs from '../../config/endpoints.js';

const smallColumnWidth = 60;
const mediumColumnWidth = 106;

export default (p) => {
    let columnWidth = p.ui.isMobile ? smallColumnWidth : mediumColumnWidth,
        tableContentWidth = p.columns.enabled.length * columnWidth;
    columnWidth = tableContentWidth > p.ui.screenWidth ? columnWidth :
             Math.ceil((p.ui.screenWidth) / (p.columns.enabled.length + 1));
    let cellStyle = {
        width: columnWidth,
        minWidth: columnWidth
    };
    let imageStyle = {
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
    let firstLine = (
        <tr>
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            let groupID = p.groups.selected !== null ? p.groups.selected.id : '';
            return (
            <td key={key} style={cellStyle}>
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
            </td>
            );
        })}
        </tr>
    );
    let secondLine = null;
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
