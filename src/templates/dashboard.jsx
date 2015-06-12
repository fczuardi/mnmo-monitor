import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';
import DataTable from '../components/datatable';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';

const chartHeight = 264;
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
    
    // let chart = (
    //     <div style={{height: chartHeight}}>
    //         <p style={{margin: 0}}>
    //             [BarChart]
    //         </p>
    //     </div>
    // );
    let chart = null; // for the future
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
