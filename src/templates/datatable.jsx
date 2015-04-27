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
    }
};
export default (p) =>
<table
    style={style.table}
>
    <thead>
        <tr style={style.tr}>
            <td style={style.td}>
                Foo
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
