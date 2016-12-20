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
    let isDesktop = (p.ui.screenHeight > 640);

    // font sizes (title)
    let mergedTitleSize = isDesktop ? 15 : 10;
    let secondTableTitleSize = isDesktop ? 12 : 10;
    let listTitleSize = isDesktop ? 17 : 15;
    let iconSize = isDesktop ? 14 : isMerged ? 9 : 12;

    // font sizes (subtitle)
    let secondTableSubtitleSize = isDesktop ? 12 : isMerged ? 7 : 10;
    let listSubtitleSize = isDesktop ? 15 : isMerged ? 10 : 13;
    let subtitleIconSize = isDesktop ? 12 : isMerged ? 7 : 10;

    // font sizes (big bracket)
    let bracketSize = isDesktop ? 25 : 17;
    let bracketLineHeight = isDesktop ? '36px' : '26px';

    let titleStyle = {
        fontSize: isMerged
                    ? mergedTitleSize
                    : isSecondTable
                        ? secondTableTitleSize
                        : listTitleSize
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
                fontSize: bracketSize,
                lineHeight: bracketLineHeight,
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
                fontSize: iconSize,
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
    let secondHeader = isNaN(secondValue) ? (null) : (
        <p style={{
            margin: 0,
            fontSize: isSecondTable ? secondTableSubtitleSize : listSubtitleSize
        }}>
            <i
                className={(p.user.classID !== null) ?
                        ('header-icon-' + p.user.classID) : ''}
                style={{
                    fontSize: subtitleIconSize,
                    marginRight: 3
                }}
            />
            <span style={{
                    lineHeight: listSubtitleSize + 'px',
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
    let baseRow = (
      <tr {...trProps}>
          <td style={{
              position: 'relative',
              height: trProps.style.height
          }}>
              {mainHeader}
              {secondHeader}
              {removeButton}
          </td>
      </tr>
    );
    let baseColumn = (
      <tr {...trProps}>
          <td style={{
              height: trProps.style.height
          }}>
              {mainHeader}
              {removeButton}
          </td>
          <td style={{
              height: trProps.style.height
          }}>{secondHeader}</td>
      </tr>
    );
    return (
        p.user.baseID === 0 ? baseColumn : baseRow
    );
}
