import React from 'react';
import {FormattedNumber} from 'react-intl';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';


export default (row, key, p, a) => {
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
        secondValue = parseFloat(row[1]),
        isSeparator = row[3] === 'separator',
        isDetailed = p.rows.type === 'detailed';
    if (isSeparator){
        firstValue = row[0].split('__')[0];
        trProps.style = merge(trProps.style, tableStyles(p).separator);
        if (p.rows.type === 'secondary'){
            trProps.style.height = p.secondTableSeparatorHeight;
        }
    }
    let splittedFirstValue = firstValue.split(' - ');
    let isMerged  = (splittedFirstValue.length > 1);
    let isSecondTable = (p.rows.type === 'secondary');
    let fontSizes = [15, 17, 25, 14, 12, 36];
    if (p.ui.screenHeight <= 640){
        if (isMerged) {
            fontSizes = [10, 12, 17, 9, 7, 26];
        } else {
            fontSizes = [13, 15, 23, 12, 10, 34];
        }
    }
    let titleStyle = {
        fontSize: isMerged ? fontSizes[0] :
                    isSecondTable ? fontSizes[3] : fontSizes[1]
    }
    let firstTitle = isMerged ? (
        <span
            style={titleStyle}
        >
            {splittedFirstValue[0]} <br />
            {splittedFirstValue[1]}
        </span>
    ): (
        <span
            style={titleStyle}
        >
            {firstValue}
        </span>
    );
    let mergedIcon = (isMerged && key === 0) ? (
        <span
            style={{
                position: 'absolute',
                fontSize: fontSizes[2],
                lineHeight: fontSizes[5] + 'px',
                marginLeft: -10
            }}
        >[</span>
    ): null;
    // let firstIcon = (p.rows.headers && p.rows.headers[key][2] !== 4) ? null :
    let firstIcon = (p.rows.headers && parseInt(p.rows.headers[key][2]) !== 0) ? null :
    (
        <span
            className="icon-attention"
            style={{
                color: '#D1A800',
                fontSize: fontSizes[3],
                marginRight: 5
            }}
        >
        </span>
    );
    let mainHeader = (
        <p style={{
            margin: 0,
            marginBottom: isDetailed ? 4 : 0,
            position: 'relative',
            fontSize: titleStyle.fontSize
        }}>
            {firstIcon}
            {mergedIcon}
            {firstTitle}
        </p>
    );
    // let minuteHeader = (p.rows.type === 'detailed' &&
    //                     key % varsCount === 0) ? (
    //     <span> - {row[0].split('__')[0]}</span>
    // ): null;
    // let varsCount = keys(p.vars.combos).length;
    let secondHeader = isNaN(secondValue) ? (null) : (
        <p style={{margin: 0, fontSize: isSecondTable ? fontSizes[3] : fontSizes[0]}}>
            <i
                className={(p.user.classID !== null) ?
                        ('header-icon-' + p.user.classID) : ''}
                style={{
                    fontSize: fontSizes[4],
                    marginRight: 3
                }}
            />
            <span style={{
                    lineHeight: fontSizes[0] + 'px',
                    verticalAlign: 'text-top'
                }}
            >
                {secondValue}
            </span>
        </p>
    );
    if (isDetailed && isSeparator){
        secondHeader = null;
    }
    let removeButton = null;
    if (
        !p.rows.secondary.autoUpdate &&
        p.rows.type === 'secondary' &&
        row[3] !== 'separator'
    ){
        let loading = p.rows.secondary.loading === true;
        let removeButtonIcon = 'icon-cancel';
        removeButtonIcon += loading ? ' addRowButtonDisabled' : '';
        removeButton = (
            <div
                className={removeButtonIcon}
                style={{
                    border: '2px solid white',
                    color: 'white',
                    backgroundColor: 'black',
                    borderRadius: 12,
                    width:  12,
                    height: 12,
                    fontSize: 12,
                    lineHeight: '12px',
                    cursor: loading ? 'auto': 'pointer',
                    textAlign: 'center',
                    position: 'absolute',
                    top: -14,
                    left: 5
                }}
                data-key={key}
                onClick={loading ? null : a.onRemoveClicked}
            ></div>
        )
    }
    return (
        <tr {...trProps}>
            <td style={{
                position: 'relative'
            }}>
                {mainHeader}
                {secondHeader}
                {removeButton}
            </td>
        </tr>
    );
}
