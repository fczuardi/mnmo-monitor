import React from 'react';
import merge from 'lodash/object/merge';
export default (p, a) => {
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
            left: 45
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
        width: 70,
        height: 90,
        float: 'left',
        overflow: 'hidden',
        fontSize: 12,
        marginRight: 5,
        //shared styles blue[1]
        color: '#0d99db',
        border: '1px solid #0d99db',
        backgroundColor: '#FFFFFF',
        position: 'relative'
    };
    let selectorButtonIconStyle = {
        fontSize: 30,
        display: 'block',
        marginTop: -20
    }
    let selectorActiveButtonStyles = merge({},
        selectorButtonStyles,
        {
            color: selectorButtonStyles.backgroundColor,
            backgroundColor: selectorButtonStyles.color
        }
    );
    let buttonTextStyle = {
        display: 'block',
        width: 70,
        textAlign: 'center',
        top: 52,
        left: 0,
        position: 'absolute'
    }
    let iconLine = {
        position:'relative',
        top: -24
    };
    let secondTableButton = p.rows.type !== 'detailed' && !p.ui.hasShortHeight ? (
        <button
            style={
                p.ui.secondTableVisible ?
                    selectorActiveButtonStyles :
                    selectorButtonStyles
            }
            onClick={a.secondTableOnClicked}
        >
            <i
                className="icon-chart-bar"
                style={selectorButtonIconStyle}
            />
            <span style={iconLine}>----------</span>
            <span
                style={merge({}, buttonTextStyle, {
                    fontSize: 9
                })}
            >
                {p.language.messages.rows.secondTable}
            </span>
        </button>
    ): null;
    let chartButton = p.ui.hasShortHeight ? null : (
        <button
            style={
                p.ui.chartVisible ?
                    selectorActiveButtonStyles :
                    selectorButtonStyles
            }
            onClick={a.chartOnClicked}
        >
            <i
                className="icon-chart-bar"
                style={selectorButtonIconStyle}
            />
            <span style={buttonTextStyle}>
                {p.language.messages.chart.onButton}
            </span>
        </button>
    );
    let emptyChartButton = (
        <button
            style={
                !p.ui.chartVisible && !p.ui.secondTableVisible ?
                    selectorActiveButtonStyles :
                    selectorButtonStyles
            }
            onClick={a.chartOffClicked}
        >
        <i
            className="icon-empty"
            style={selectorButtonIconStyle}
        />
        <span style={buttonTextStyle}>
            {p.language.messages.chart.offButton}
        </span>
        </button>
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
            {chartButton}
            {secondTableButton}
            {emptyChartButton}
        </div>
    );
    let bottomSelector = p.rows.type !== 'detailed' ? (
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
                <i
                    className="icon-clock"
                    style={selectorButtonIconStyle}
                />
                <span style={buttonTextStyle}>
                    {p.language.messages.rows.unmergeRows}
                </span>
            </button>
            <button
                style={
                    p.rows.type === 'merged' ?
                        selectorActiveButtonStyles :
                        selectorButtonStyles
                }
                onClick={a.rowTypeMergedClicked}
            >
                <i
                    className="icon-chart-bar"
                    style={selectorButtonIconStyle}
                />
                <span style={iconLine}>----------</span>
                <span style={buttonTextStyle}>
                    {p.language.messages.rows.mergeRows}
                </span>
            </button>
        </div>
    ): null;
    return (
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
}
