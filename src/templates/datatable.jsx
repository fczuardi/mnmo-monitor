import React from 'react';

const style = {
    table: {
        minWidth: '100%'
    },
    tr: {
        color: '#fff',
        textAlign: 'center'
    },
    td: {
        borderRight: '1px solid white',
    },
    firstColumn: {
        borderRight: '1px solid white',
        width: '15%'
    }
};
export default (p, a) =>
<table
    style={style.table}
>
    <thead>
        <tr style={style.tr}>
            <td style={style.firstColumn}>
                <button
                    style={{background: 'none', border: 'none'}}
                    data-type={p.rows.type}
                    onClick={a.firstHeaderButtonClick}
                >
                    {( p.rows.type === 'list' ?
                        p.language.messages.rows.mergeRows :
                        p.language.messages.rows.unmergeRows
                    )}
                </button>
            </td>
        {p.columns.enabled.map( (column, key) => (
            <td key={key} style={style.td}>
                {column.label}
            </td>
        ))}
        </tr>
    </thead>
    <tbody>
    {p.rows.data.map( (row, rowKey) => (
        <tr 
            key={rowKey}
            style={style.tr}
        >
            <td style={style.td}>
                {p.rows.headers[rowKey][0]}
            </td>
        {row.map( (column, columnKey) => (
            <td key={columnKey} style={style.td}>
                {column}
            </td>
        ))}
        </tr>
    ))}
    </tbody>
</table>;
