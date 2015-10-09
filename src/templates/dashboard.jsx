import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';
import DashboardChart from '../components/dashboardchart';
import DetailChart from '../components/detailchart';
import DataTable from '../components/datatable';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';
import Analytics from '../components/analytics';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';

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
                fontWeight: 700
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
            position: p.ui.chartVisible ? 'absolute' : 'inherit',
            top: p.appHeaderHeight - 2,
            width: '100%',
            height: p.tableTitleHeight,
            lineHeight: p.tableTitleHeight + 'px',
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            textAlign: 'center',
            fontSize: 12
        }}>
            {tableTitleText}
        </div>
    );
    let chartContent = (!p.ui.chartVisible) ? null :
                        (p.rows.type !== 'detailed') ? (
        <DashboardChart {...p} />
    ) : (
        <DetailChart {...p} />
    );
    let chartContainer = (
        <div style={{
            position: 'relative',
            height: p.chartHeight
        }}>
            {chartContent}
        </div>
    );
    let splashScreen = (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'table'
        }}>
            <CenteredBox>
                <div style={{
                    width:'100%',
                    textAlign: p.ui.isMobile ? 'center' : 'left',
                    position: 'relative'
                }}>
                    <img
                        src={
                        p.ui.isMobile ? './img/logo_splash_small.png' :
                                        './img/logo_splash_big.png'
                        }
                        style={{
                            position: 'relative',
                            left: p.ui.isMobile ? 0 : '50%',
                            marginLeft: p.ui.isMobile ? -15 : - 219
                        }}
                    />
                    <div className="spinner" style={{
                        position:'absolute',
                        top: 100,
                        left:'50%',
                        marginLeft: -20
                    }}></div>
                </div>
            </CenteredBox>
            <footer
                style={{
                    width: '100%',
                    textAlign: 'center',
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    opacity: 0.3
                }}
            >
                {p.ui.version}
            </footer>
            <ErrorDialog {...p} />
        </div>
    );
    let dashboard = p.ui.displaySplash ? splashScreen : (
        <div style={{paddingTop: 53, width: '100%'}}>
            <Header {...p} />
            <Menu {...p} />
            <PanelRouter {...p} />
            {chartContainer}
            {tableTitle}
            <DataTable {...p} />
            <NetworkMessages {...p} />
            <ErrorDialog {...p} />
            <Analytics {...p} />
        </div>
    );
    return dashboard;
}
