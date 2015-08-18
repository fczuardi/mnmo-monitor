import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';
import DashboardChart from '../components/dashboardchart';
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
    
    let tableTitleText = p.rows.date === '' ? null : (
        <span>
            <span style={{
                fontWeight: 700,
                fontSize: 15
            }}>
                {p.language.messages.rows.date}:
            </span>
            <span style={{
                marginLeft: 3
            }}>
                {p.rows.date}
            </span>
        </span>
    );
    let tableTitle = (
        <div style={{
            position: 'relative',
            width: '100%',
            height: 30,
            lineHeight: '30px',
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            textAlign: 'center'
        }}>
            {tableTitleText}
        </div>
    );
    let chartContent = (!p.ui.chartVisible) ? null : 
                        (p.rows.type !== 'detailed') ? (
        <DashboardChart {...p} />
    ) : (
        //<LineChart {...p} />
        <p style={{margin: 0, opacity: 0.5}}>
            Loading Chart…
        </p>
    );
    let chartContainer = (
        <div style={{
            position: 'relative',
            height: p.chartHeight
        }}>
            {chartContent}
        </div>
    );
    return (
<div style={{paddingTop: 53, width: '100%'}}>
    <Header {...p} />
    <Menu {...p} />
    <PanelRouter {...p} />
    {chartContainer}
    {tableTitle}
    <DataTable {...p} />
    <NetworkMessages {...p} />
    <ErrorDialog {...p} />
</div>
    );
}
