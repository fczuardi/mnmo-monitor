import React from 'react';
import {FormattedNumber} from 'react-intl';
import {varTypes} from '../../config/apiHelpers';
import tableStyles from '../styles/tablestyles';
import keys from 'lodash/object/keys';

const defaultPercentProps = {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
};

const defaultNumberProps = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
}

export default (content, rowKey, cellKey, p) => {
    let tableHasSeparators = (p.rows.type === 'detailed' && (!p.ui.chartVisible || !p.ui.isMobile));
    let firstRowWithValue = tableHasSeparators ? 1 : 0;
    let varsCount = keys(p.vars.combos).length + firstRowWithValue; // +1 for the added separators
    const isPercent = (enumValue) => (p.rows.type === 'detailed') ?
                        (rowKey % varsCount !== firstRowWithValue) :
                        (varTypes[p.vars.combo[enumValue]] === 'percent');
    const getValue = (v, enumValue) => {
        return !isNaN(parseFloat(v)) ?
            (parseFloat(v) / (isPercent(enumValue) ? 100 : 1)) : v
    };
    const renderValue = (v, enumValue) => {
        let value = getValue(v, enumValue),
            percentProps = isPercent(enumValue) ? defaultPercentProps : defaultNumberProps;
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
    let cellStyle = tableStyles ? tableStyles(p).borderRight : {};
    if ((p.rows.type === 'detailed') && (p.columns.selected === cellKey)) {
        let columnColors = tableStyles ? tableStyles(p).columnColors : null;
        cellStyle.backgroundColor = columnColors ? columnColors[(cellKey % columnColors.length)] : 'inherit'
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
