import React from 'react';
import {FormattedNumber} from 'react-intl';


export default (row, key, p) => {
    let firstValue = row[0],
        secondValue = parseFloat(row[1]);
    let mainHeader = (
        <p style={{margin: 0, fontSize: 17}}>
            {firstValue}
        </p>
    );
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
                <FormattedNumber 
                    locales={'en-US'/*p.language.messages.locale*/} 
                    value={secondValue}
                />
            </span>
        </p>
    );
    return (
        <div 
            key={key}
            style={{
                height: p.rowHeight - 1,
                borderBottom: '1px solid #000'
            }}
        >
            {mainHeader}
            {secondHeader}
        </div>
    );
}