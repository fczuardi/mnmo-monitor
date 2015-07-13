import React from 'react';
import {FormattedNumber} from 'react-intl';
import {varTypes} from '../../config/apiHelpers';
import tableStyles from '../styles/table';
import keys from 'lodash/object/keys';

const defaultPercentProps = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
};

export default (content, rowKey, cellKey, p) => {
    let varsCount = keys(p.vars.combos).length + 1; // +1 for the added separators
    const isPercent = (enumValue) => 
                            (varTypes[p.vars.combo[enumValue]] === 'percent') ||
                            (p.rows.type === 'detailed' && rowKey % varsCount !== 1);
    const getValue = (v, enumValue) => (
        !isNaN(parseFloat(v)) ? 
            (parseFloat(v) / (isPercent(enumValue) ? 100 : 1)) : v
    );
    const renderValue = (v, enumValue) => {
        let value = getValue(v, enumValue),
            percentProps = isPercent(enumValue) ? defaultPercentProps : null;
        return (typeof value === 'number') ? (
            <FormattedNumber 
                locales={'en-US'/* p.language.messages.locale */} 
                value={value}
                {...percentProps}
            />
        ) : value;
    };
        
    let values = content ? content.split('|') : [null, null],
        firstLine = renderValue(values[0], 'first'),
        secondLine = p.rows.type === 'detailed' ? null : renderValue(values[1], 'second'),
        cellContent = secondLine ? (
            <div>
                <span>{firstLine}</span><br/>
                <span className="secondary">{secondLine}</span>
            </div>
        ):(
            <span>
                {firstLine}
            </span>
        );
    let cellStyle = tableStyles(p).borderRight;
    if ((p.rows.type === 'detailed') && (p.columns.selected === cellKey)) {
        let columnColors = tableStyles(p).columnColors;
        cellStyle.backgroundColor = columnColors[(cellKey % columnColors.length)]
    }
    
    return (
        <td 
            key={cellKey}
            style={cellStyle}
        >
            {cellContent}
        </td>
    );
}