import React from 'react';
import cellRenderer from './tablecell.jsx';
import tableStyles from '../styles/table';
import merge from 'lodash/object/merge';

export default (row, key, p) => {
    if (p.columns.enabled.length > row.length) {
        for(var i=row.length; i < p.columns.enabled.length; i++){
            row.push('-');
        }
    }
    
    let className = tableStyles(p).getRowClassName(key);

    return (
        <tr 
            key={key}
            className={className}
            style={merge({
            }, tableStyles(p).borderBottom)}
        >
            {row.map((cell, key) => cellRenderer(cell, key, p))}
        </tr>
    );
}