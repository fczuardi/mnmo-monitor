import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';
import DataTable from '../components/datatable';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';

export default (p, a) => {
    // let subgroupsButton = (p.groups.selected &&
    //                         p.groups.selected.subgroupsCount > 0) ? (
    //     <button
    //         style={{
    //             background: 'none',
    //         }}
    //         onClick={a.subgroupsButtonClicked}
    //     >
    //         Subgroups
    //     </button>
    //                         ) : null;
    
    let chart = (!p.ui.chartVisible) ? null : (
        <div style={{
            height: p.chartHeight
        }}>
            <p style={{margin: 0, opacity: 0.5}}>
                Loading Chart…
            </p>
        </div>
    );
    return (
<div style={{paddingTop: 53, width: '100%'}}>
    <Header {...p} />
    <Menu {...p} />
    <PanelRouter {...p} />
    {chart}
    <DataTable {...p} />
    <NetworkMessages {...p} />
    <ErrorDialog {...p} />
</div>
    );
}
