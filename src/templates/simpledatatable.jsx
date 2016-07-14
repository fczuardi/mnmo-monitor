import React from 'react';
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
            <span className="secondary">{secondHeader}</span>
        </td>
    );
}

function columnHeaderContent(column, p){
    let columnActions = p.flux.getActions('columns');
    let onImageError = (event) => {
        columnActions.columnIconFailed(event.target.getAttribute('data-id'));
    };
    let cellContent = (column.icons && !column.iconError) ? (
        <img
            onError={onImageError}
            src={column.icons.menuBitmap}
            width={p.iconWidth}
            height={p.iconWidth}
            alt={column.label}
            title={column.label}
            data-id={column.id}
        />
    ) : (
        <span>
            {column.label}
        </span>
    );
    return cellContent;
}

function compareAveragesRow(row, key, p){
    if (!p.ui.secondTableVisible) {
        return null;
    }
    var className = (key % 2 === 0 ? 'odd' : 'even');
    return (
        <div key={'secondarytablerow-' + key}>
            <tr key={'separator-' + key} className={className}>
                <td key={'separator-td-' + key} colSpan={row.length + 1}>
                    {p.rows.secondary.headers[key][4]}
                </td>
            </tr>
            <tr key={'row-' + key} className={className}>
                {rowHeaderCell(p.rows.secondary.headers, key)}
                {row.map( (cell, cellKey) => {
                    return cellRenderer(cell, key, cellKey, p);
                })}
            </tr>
        </div>
    );
}

let secondTable = p => (!p.ui.secondTableVisible) ? null : (
    <table className={'simple-table-print'}  cellSpacing="0">
        <caption>
            {p.language.messages.rows.secondTable}
        </caption>
        <tbody>{
            p.rows.secondary.data.map((row, key) =>
                compareAveragesRow(row, key, p))
        }</tbody>
    </table>
);
export default (p) => {
return (<div>
<div className={'simple-table-print-header'}>
    <img src='./img/logo_splash_small.png' />
</div>
<div className={'simple-table-print-metadata'}>
    <div className={'datablock'}>
        <dt>
            {p.language.messages.classes.title}
        </dt>
        <dd>
            {p.user.classLabel}
        </dd>
    </div>
    <div className={'datablock'}>
        <dt>
            {p.language.messages.rows.date}
        </dt>
        <dd>
            {p.rows.date}
        </dd>
    </div>
    <div className={'datablock'}>
        <dt>
            {p.language.messages.vars.title}
        </dt>
        <dd>
            {p.vars.rawCombos[p.user.variableComboID].label}
        </dd>
    </div>
    <div className={'datablock'}>
        <dt>
            {p.language.messages.groups.title}
        </dt>
        <dd>
            {p.user.groupLabel}
        </dd>
    </div>
    <div className={'datablock'}>
        <dt>
            {p.language.messages.customer.title}
        </dt>
        <dd>
            {p.user.customerName}
        </dd>
    </div>
    <div className={'datablock'}>
        <dt>
            {p.language.messages.login.username}
        </dt>
        <dd>
            {p.user.username}
        </dd>
    </div>
</div>
{secondTable(p)}
<table className={'simple-table-print'}  cellSpacing="0">
    <caption>
        {p.language.messages.rows.printTableTitle[p.rows.type]}
    </caption>
    <thead>
        <tr>
            <th key={'headers-column'}></th>
            {p.columns.enabled.map( (column, key) => (
                    <th key={key}>
                        {columnHeaderContent(column, p)}
                    </th>
                )
            )}
        </tr>
    </thead>
    <tbody>
        {p.rows.data.map( (row, key) => (
                <tr key={key} className={(key % 2 === 0 ? 'odd' : 'even')}>
                    {rowHeaderCell(p.rows.headers, key)}
                    {row.map( (cell, cellKey) => {
                        return cellRenderer(cell, key, cellKey, p);
                    })}
                </tr>
            )
        )}
    </tbody>
</table>
</div>);
};
