import merge from 'lodash/object/merge';
import SecondTableToolbar from '../components/secondtabletoolbar';
import RowHeaders from '../components/rowheaders';
import TableContent from '../components/tablecontent';

export default (p) => {

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
>
    {p.ui.isMobile ? null : (
        <SecondTableToolbar {...p} />
    )}
    <div>
        <div
            style={{
                float:'left'
            }}
        >
            <RowHeaders {...secondTableParams} />
        </div>
        <TableContent {...secondTableParams} />
    </div>
    {!p.ui.isMobile ? null : (
        <SecondTableToolbar {...p} />
    )}
</div>
);
}
