import React from 'react';
import rowRenderer from './rowheader.jsx';
import tableStyles from '../styles/table';
import merge from 'lodash/object/merge';

export default (p) => 
<div
    id="row-headers"
    style={{
        height: p.tableHeight - p.rowHeight,
        width: p.columnWidth,
        // backgroundColor: 'orange',
        overflow: 'hidden'
    }}
>
    <table
        style={merge({
            width: p.columnWidth,
            textAlign: 'center'
        }, tableStyles(p).borderRight)}
    >
        <tbody>
            {p.rows.headers.map((row, key) => rowRenderer(row, key, p))}
        </tbody>
    </table>
</div>;
