import React from 'react';
import TableHeader from '../components/tableheader';
import ImageRow from '../components/imagerow';
import Slider from '../components/slider';
import RowHeaders from '../components/rowheaders';
import TableContent from '../components/tablecontent';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';

export default (p, a) => {
    let firstCellIcon = (
        <img
            style={{
                height:'60%'
            }}
            src={
                p.ui.isMobile ?
                    './img/icon_split_mobile.png' :
                    './img/icon_split_desktop.png'
            }
        />
    );
    let firstCell = (
        <button
            className='headerCell tableHeader'
            style={{
                border: 'none',
                padding: 0,
                width: '100%',
                height: p.rowHeight
            }}
            data-type={p.rows.type}
            onClick={a.firstHeaderButtonClick}
        >
            {firstCellIcon}
        </button>
    );

    let thumbnails = p.rows.type === 'detailed' ? (
        <ImageRow {...p} />
    ) : null;

    let slider = p.rows.type === 'detailed' && p.ui.chartVisible ? (
        <Slider {...p} />
    ) : null;

    // let slider = null;

    return (
        <div>
    {slider}
    {thumbnails}
    <div
        id="dataTableContainer"
        style={{
            position: 'relative',
            width: p.tableWidth,
            height: p.tableHeight,
            overflow: 'hidden'
        }}
    >
        <div
            className="dataTableBackground"
            style={{
                position: 'absolute',
                width: p.tableWidth,
                height: p.tableHeight
            }}
        ></div>
        <div
            className="dataTable"
            style={{
                position: 'absolute',
                width: p.tableWidth,
                height: p.tableHeight,
                overflow: 'hidden',
                border: '1px solid #000',
                textAlign: 'center'
            }}
        >
            <div
                style={{
                    width: p.columnWidth,
                    height: p.tableHeight,
                    overflow: 'hidden',
                    // backgroundColor: 'blue',
                    float: 'left'
                }}
            >
                <div
                    style={merge({

                    },
                    tableStyles(p).borderBottom,
                    tableStyles(p).borderRight
                    )}
                >
                    {firstCell}
                </div>
                <RowHeaders {...p} />
            </div>
            <div
                style={{
                    float: 'left',
                }}
            >
                <TableHeader {...p} />
                <TableContent {...p} />
            </div>
        </div>
    </div>
    </div>
    );
}
