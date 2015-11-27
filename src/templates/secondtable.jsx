import merge from 'lodash/object/merge';
import SecondTableToolbar from '../components/secondtabletoolbar';
import RowHeaders from '../components/rowheaders';
import TableContent from '../components/tablecontent';

export default (p) => {

    let secondTableParams = merge({}, p);
    secondTableParams.tableHeight = p.seconTableHeight;
    secondTableParams.rowHeadersElementId = 'secondTableRowHeaders';
    secondTableParams.tableContentsElementId = 'secondTableContents';
    return (
<div
    id={'secondTableContainer'}
>
    <SecondTableToolbar {...p} />
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
</div>
);
}
