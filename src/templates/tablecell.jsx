import React from 'react';
import {FormattedNumber} from 'react-intl';
import {varTypes} from '../../config/apiHelpers';
import tableStyles from '../styles/tablestyles';
import keys from 'lodash/object/keys';
import find from 'lodash/collection/find';

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
    let tableHasSeparators = (p.rows.type === 'detailed');
    let firstRowWithValue = tableHasSeparators ? 1 : 0;
    let varsCount = keys(p.vars.combos).length + firstRowWithValue; // +1 for the added separators
    let cellRowHeader = (p.rows.headers && p.rows.headers[rowKey]) ? p.rows.headers[rowKey][0] : null;
    //there are 3 possible headers from where we can extract the row var label:
    //'18:02__VARLABEL', '18:02' and 'VARLABEL'
    let selectedVar = find(p.vars.rawCombos, 'id', p.user.variableComboID);
    let selectedVarLabel = selectedVar && selectedVar.label ? selectedVar.label : cellRowHeader;
    let cellVarLabel = (
        cellRowHeader.indexOf('__') !== -1 ? cellRowHeader.split('__')[1] : ( //'18:02__VARLABEL'
            cellRowHeader.indexOf(':') !== -1 ? //'18:02'
                // in this case we get from the user selected main var
                selectedVarLabel :
                cellRowHeader //'VARLABEL'
        )
    );
    // console.log('cellRowHeader', cellRowHeader, cellVarLabel);
    const isPercent = (enumValue) => {
        let labels = cellVarLabel.split('-');
        let label = enumValue === 'first' ? labels[0] : (labels[1] || '-');
        return (varTypes[label] === 'percent');
    };
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
    if (cellKey === 0){
        cellStyle.height = p.rowHeight;
    }
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
