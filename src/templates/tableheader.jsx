import React from 'react';
import columnHeaderRenderer from './tableheadercell.jsx';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';

export default (p, a) => {

    return (
        <div
            id="table-headers"
            style={merge({
            width: p.tableWidth - p.columnWidthHeader,
            overflow: 'hidden',
            // backgroundColor: 'green',
        }, tableStyles(p).borderBottom)}>
            <table>
                <tbody>
                <tr
                    className="tableHeader"
                    style={{
                        textAlign: 'center',
                        height: p.rowHeight
                    }}
                >
                    {p.columns.enabled.map(
                        (column, key) => columnHeaderRenderer(column, key, p, a)
                    )}
                </tr>
                </tbody>
            </table>
        </div>
    );
};
