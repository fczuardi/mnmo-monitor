import React from 'react';
import cellRenderer from './tablecell.jsx';
import tableStyles from '../styles/table';
import merge from 'lodash/object/merge';

export default (row, key, p) => {
    let renderRow = row.slice(0);
    if (p.columns.enabled.length > renderRow.length) {
        for(var i=renderRow.length; i < p.columns.enabled.length; i++){
            renderRow.push('-');
        }
    }
    
    let className = tableStyles(p).getRowClassName(key);
    
    let isVisible = (key < p.ui.lastVisibleRow);
    
    if (!isVisible) {
        return null;
    }
    
    return (
        <tr 
            key={key}
            className={className}
            style={merge({
            }, tableStyles(p).borderBottom)}
        >
            {row.map( (cell, key) => {
                return cellRenderer(cell, key, p);
            } )}
        </tr>
    );
}