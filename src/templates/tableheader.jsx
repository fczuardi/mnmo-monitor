import React from 'react';
import columnHeaderRenderer from './tableheadercell.jsx';
import tableStyles from '../styles/table';
import merge from 'lodash/object/merge';

export default (p) => {

    return (
        <div
            id="table-headers"
            style={merge({
            width: p.tableWidth - p.columnWidth,
            overflow: 'hidden',
            // backgroundColor: 'green',
        }, tableStyles(p).borderBottom)}>
            <table>
                <tr
                    className="tableHeader"
                    style={{
                        textAlign: 'center',
                        height: p.rowHeight
                    }}
                >
                    {p.columns.enabled.map(
                        (column, key) => columnHeaderRenderer(column, key, p)
                    )}
                </tr>
            </table>
        </div>
    );
};
