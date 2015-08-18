import React from 'react';
import {FormattedNumber} from 'react-intl';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';


export default (row, key, p) => {
    // console.log('row, key', row, key);
    let isVisible = (key < p.ui.lastVisibleRow);
    let className = tableStyles(p).getRowClassName(key);
    let trProps = {
        key: key,
        className: className,
        style: merge({}, tableStyles(p).borderBottom)
    };

    if (!isVisible) {
        return null
    }

    let firstValue = row[0].indexOf('__') === -1 ? 
                                                row[0] : 
                                                row[0].split('__')[1],
        secondValue = parseFloat(row[1]);
    if (row[2] === 'separator'){
        firstValue = row[0].split('__')[0];
        trProps.style = merge(trProps.style, tableStyles(p).separator);
    }
    let mainHeader = (
        <p style={{margin: 0, fontSize: 17}}>
            {firstValue}
        </p>
    );
    // let minuteHeader = (p.rows.type === 'detailed' && 
    //                     key % varsCount === 0) ? (
    //     <span> - {row[0].split('__')[0]}</span>
    // ): null;
    // let varsCount = keys(p.vars.combos).length;
    let secondHeader = isNaN(secondValue) ? (null) : (
        <p style={{margin: 0, fontSize: 15}}>
            <i 
                className={(p.user.classID !== null) ? 
                        ('header-icon-' + p.user.classID) : ''}
                style={{
                    fontSize: 12, 
                    marginRight: 3
                }} 
            />
            <span style={{
                    lineHeight: '15px',
                    verticalAlign: 'text-top'
                }}
            >
                {secondValue}
            </span>
        </p>
    );
    if (p.rows.type === 'detailed'){
        secondHeader = null;
        
    }
    return (
        <tr {...trProps}>
            <td>
                {mainHeader}
                {secondHeader}
            </td>
        </tr>
    );
}