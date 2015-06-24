import React from 'react';
import URLs from '../../config/endpoints.js';

export default (p) => {
    let firstLine = (
        <tr>
        {p.columns.enabled.map( (column, key) => {
            let groupID = p.groups.selected !== null ? p.groups.selected.id : '';
            return (
            <td key={key}>
                <img src={(
                    URLs.thumbnailsUrl +
                    '?' +
                    URLs.images.groupParam + '=' + groupID + '&' +
                    URLs.images.columnParam + '=' + column.id + '&' +
                    URLs.images.dayParam + '=' + p.rows.date.split('-').join('') + '&' +
                    URLs.images.hourParam + '=' + p.ui.minute
                )} />
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
