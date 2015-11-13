import React from 'react';
import merge from 'lodash/object/merge';
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

    let circleStyles = {
        'div': {
            'mobile': {
                width: 220,
                height: 220,
                borderRadius: 220,
                left: -60,
                top: -20
            },
            'desktop': {
                width: 300,
                height: 300,
                borderRadius: 300,
                left: -80,
                top: -30
            }
        },
        'img': {
            'mobile': {
                position: 'absolute',
                top: 46,
                left: 80,
                height: 110
            },
            'desktop': {
                position: 'absolute',
                top: 90,
                left: 100
            }
        }

    };
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
    let splitScreenMenuBackgroundCircle = (
        <div
            style={merge({
                position: 'absolute',
                backgroundColor: '#000000',
                zIndex: 2
            }, p.ui.isMobile ? circleStyles.div.mobile : circleStyles.div.desktop)}
            onClick={p.flux.getActions('user').splitScreenButtonToggle}
        >
            <img
                style={
                    p.ui.isMobile ?
                        circleStyles.img.mobile :
                        circleStyles.img.desktop
                }
                src={
                    p.ui.isMobile ?
                        './img/icon_split_big_mobile.png' :
                        './img/icon_split_big_desktop.png'
                }
            />
        </div>
    );
    let balloonStyle = {
        position: 'absolute',
        zIndex: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25
    }
    let balloonStyles = {
        'desktop': {
            left: 135
        },
        'mobile': {
            left: 95
        },
        'top': {
            mobile: {
                bottom: -77
            },
            desktop: {
                bottom: -87
            }
        },
        'bottom': {
            mobile: {
                top: 82
            },
            desktop: {
                top: 93
            }
        }
    };
    let selectorButtonStyles = {
        background: 'none',
        borderRadius: 5,
        padding: 20,
        fontSize: 12,
        marginRight: 5,
        //shared styles blue[1]
        color: '#0d99db',
        border: '1px solid #0d99db',
        backgroundColor: '#FFFFFF'
    };
    let selectorActiveButtonStyles = merge({},
        selectorButtonStyles,
        {
            color: selectorButtonStyles.backgroundColor,
            backgroundColor: selectorButtonStyles.color
        }
    );
    let topSelector = (
        <div
            style={merge(
                {},
                balloonStyle,
                p.ui.isMobile ? balloonStyles.mobile : balloonStyles.desktop,
                p.ui.isMobile ? balloonStyles.top.mobile : balloonStyles.top.desktop
            )}
        >
            <button
                style={
                    p.ui.chartVisible ?
                        selectorActiveButtonStyles :
                        selectorButtonStyles
                }
                onClick={a.chartOnClicked}
            >
                {p.language.messages.chart.onButton}
            </button>
            <button
                style={
                    !p.ui.chartVisible ?
                        selectorActiveButtonStyles :
                        selectorButtonStyles
                }
                onClick={a.chartOffClicked}
            >
                {p.language.messages.chart.offButton}
            </button>
        </div>
    );
    let bottomSelector = (
        <div
            style={merge(
                {},
                balloonStyle,
                p.ui.isMobile ? balloonStyles.mobile : balloonStyles.desktop,
                p.ui.isMobile ? balloonStyles.bottom.mobile : balloonStyles.bottom.desktop
            )}
        >
            <button
                style={
                    p.rows.type === 'list' ?
                        selectorActiveButtonStyles :
                        selectorButtonStyles
                }
                onClick={a.rowTypeListClicked}
            >
                {p.language.messages.rows.unmergeRows}
            </button>
            <button
                style={
                    p.rows.type === 'merged' ?
                        selectorActiveButtonStyles :
                        selectorButtonStyles
                }
                onClick={a.rowTypeMergedClicked}
            >
                {p.language.messages.rows.mergeRows}
            </button>
        </div>
    );
    let splitMenu = (
        <div
            style={{
                position: 'relative',
                display: p.ui.splitScreenMenuClosed ? 'none' : 'block'
            }}
        >
            {splitScreenMenuBackgroundCircle}
            {topSelector}
            {bottomSelector}
        </div>
    );
    let dashboard = p.ui.displaySplash ? splashScreen : (
        <div style={{paddingTop: 53, width: '100%'}}>
            <Header {...p} />
            <Menu {...p} />
            <PanelRouter {...p} />
            {chartContainer}
            {tableTitle}
            {splitScreenMenuBackground}
            {splitMenu}
            <DataTable {...p} />
            <NetworkMessages {...p} />
            <ErrorDialog {...p} />
            <Analytics {...p} />
        </div>
    );
    return dashboard;
}
