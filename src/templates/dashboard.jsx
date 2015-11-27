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
import MultiPicker from 'mnmo-components/lib/themes/mnmo/multipicker';
import SplitScreenMenu from '../components/splitscreenmenu';
import SecondTable from '../components/secondtable';


export default (p, a) => {
    let useMobileLogo = p.ui.screenWidth <= 710;
    let splashScreen = (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'table'
        }}>
            <CenteredBox>
                <div style={{
                    width:'100%',
                    textAlign: useMobileLogo ? 'center' : 'left',
                    position: 'relative'
                }}>
                    <img
                        src={
                        useMobileLogo ? './img/logo_splash_small.png' :
                                        './img/logo_splash_big.png'
                        }
                        style={{
                            position: 'relative',
                            left: useMobileLogo ? 0 : '50%',
                            marginLeft: useMobileLogo ? -15 : - 347
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
                    left: 0
                }}
            >
                <p>
                    {p.language.messages.splash.appName}
                </p>
                <p style={{
                    opacity: 0.3
                }}>
                    {p.ui.version}
                </p>
            </footer>
            <ErrorDialog {...p} />
        </div>
    );

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
    let splitScreenMenuBackground = (
        <div
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                zIndex: 1,
                backgroundColor: '#000000',
                opacity: 0.7,
                display: p.ui.splitScreenMenuClosed ? 'none' : 'block'
            }}
            onClick={p.flux.getActions('user').splitScreenButtonToggle}
        />
    );
    let secondTable = (p.ui.secondTableVisible && p.rows.type !== 'detailed') ?
        (
            <SecondTable {...p} />
        ) : null;
    let dashboard = p.ui.displaySplash ? splashScreen : (
        <div style={{paddingTop: 53, width: '100%'}}>
            <Header {...p} />
            <Menu {...p} />
            <PanelRouter {...p} />
            {chartContainer}
            {secondTable}
            {tableTitle}
            {splitScreenMenuBackground}
            <SplitScreenMenu {...p} />
            <div style={{position:'absolute'}}>
                <DataTable {...p} />
            </div>
            <NetworkMessages {...p} />
            <ErrorDialog {...p} />
            <Analytics {...p} />
        </div>
    );
    return dashboard;
}
