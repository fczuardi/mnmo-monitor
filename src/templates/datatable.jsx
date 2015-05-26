import React from 'react';
import TableHeader from '../components/tableheader';
import RowHeaders from '../components/rowheaders';
import TableContent from '../components/tablecontent';
import tableStyles from '../styles/table';

export default (p, a) => {
    let firstCell = (
        <button
            className='headerCell'
            style={{
                border: 'none', 
                width: '100%', 
                backgroundColor: 'inherit',
                color: '#767677',
                textTransform: 'uppercase'
            }}
            data-type={p.rows.type}
            onClick={a.firstHeaderButtonClick}
        >
            {( p.rows.type === 'list' ?
                p.language.messages.rows.mergeRows :
                p.language.messages.rows.unmergeRows
            )}
        </button>
    );
    return (
        <div
            style={{
                width: p.tableWidth,
                height: p.tableHeight,
                overflow: 'hidden',
                textAlign: 'center'
            }}
        >
            <div
                style={{
                    width: p.columnWidth,
                    height: p.tableHeight,
                    overflow: 'hidden',
                    // backgroundColor: 'blue',
                    float: 'left'
                }}
            >
                <div 
                    style={tableStyles(p).borderBottom}
                >
                    {firstCell}
                </div>
                <RowHeaders {...p} />
            </div>
            <div 
                style={{
                    float: 'left',
                }}
            >
                <TableHeader {...p} />
                <TableContent {...p} />
            </div>
        </div>
    );
}