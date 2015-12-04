import React from 'react';
import cellRenderer from './tablecell.jsx';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';

export default (row, key, p) => {
    let renderRow = row.slice(0);
    if (p.columns.enabled.length > renderRow.length) {
        for(var i=renderRow.length; i < p.columns.enabled.length; i++){
            renderRow.push('');
        }
    }


    let isVisible = (key < p.ui.lastVisibleRow);

    if (!isVisible) {
        return null;
    }

    let className = '';
    let trContents = null;
    let trStyle = merge({}, tableStyles(p).borderBottom);

    if (renderRow[0] === 'separator'){
        trStyle = merge(trStyle, tableStyles(p).separator);
        if (p.rows.type === 'secondary'){
            trStyle.height = p.secondTableSeparatorHeight;
        }
        trContents = (
            <td
                colSpan={renderRow.length}
            >
            </td>
        );
    }else{
        className = tableStyles(p).getRowClassName(key);
        trContents = renderRow.map( (cell, cellKey) => {
            return cellRenderer(cell, key, cellKey, p);
        });
    }
    return (
        <tr
            key={key}
            className={className}
            style={trStyle}
        >
            {trContents}
        </tr>
    );
}
