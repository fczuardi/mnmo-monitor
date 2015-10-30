import cellRenderer from './tablecell.jsx';

function rowHeaderCell(headers, index){
    let cellData = headers[index],
        firstValue = cellData[0].indexOf('__') === -1 ?
                                                cellData[0] :
                                                cellData[0].split('__')[1],
        secondValue = parseFloat(cellData[1]);
    if (cellData[3] === 'separator'){
        firstValue = cellData[0].split('__')[0];
    }
    let secondHeader = isNaN(secondValue) ? null : secondValue;

    return (
        <td key={'rowheader-' + index}>
            <span>{firstValue}</span><br />
            <span>{secondHeader}</span>
        </td>
    );
}
export default (p) =>
<table className={'simple-table-print'}>
    <thead>
        <th key={'headers-column'}></th>
        {p.columns.enabled.map( (column, key) => (
                <th key={key}>
                    {column.label}
                </th>
            )
        )}
    </thead>
    <tbody>
        {p.rows.data.map( (row, key) => (
                <tr key={key}>
                    {rowHeaderCell(p.rows.headers, key)}
                    {row.map( (cell, cellKey) => {
                        return cellRenderer(cell, key, cellKey, p);
                    })}
                </tr>
            )
        )}
    </tbody>
</table>;
