import React from 'react';
import merge from 'lodash/object/merge';
import SecondTableToolbar from '../components/secondtabletoolbar';
import RowHeaders from '../components/rowheaders';
import TableContent from '../components/tablecontent';

export default (p) => {
    let isSmall = p.ui.screenHeight < 640;
    let secondTableParams = merge({}, p);
    secondTableParams.tableHeight = p.secondTableHeight;
    secondTableParams.rowHeadersElementId = 'secondTableRowHeaders';
    secondTableParams.tableContentsElementId = 'secondTableContents';
    secondTableParams.rows.type = 'secondary';
    secondTableParams.rows.data = p.rows.secondary.data;
    secondTableParams.rows.headers = p.rows.secondary.headers;
    return (
<div
    id={'secondTableContainer'}
    style={{
        height: secondTableParams.tableHeight + 50
    }}
>
    {p.ui.isMobile ? null : (
        <SecondTableToolbar {...p} />
    )}
    <div
        className={isSmall ? 'dataTable small': 'dataTable'}
        style={{
            width: secondTableParams.tableWidth,
            height: secondTableParams.tableHeight,
            overflow: 'hidden',
            border: '1px solid #000',
            textAlign: 'center'
        }}
    >
        <div
            style={{
                width: secondTableParams.columnWidth,
                height: secondTableParams.tableHeight,
                overflow: 'hidden',
                // backgroundColor: 'blue',
                float: 'left'
            }}
        >
            <RowHeaders {...secondTableParams} />
        </div>
        <div
            style={{
                float: 'left',
            }}
        >
            <TableContent {...secondTableParams} />
        </div>
    </div>
    {!p.ui.isMobile ? null : (
        <SecondTableToolbar {...p} />
    )}
</div>
);
}
