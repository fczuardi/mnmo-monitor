import React from 'react';
import TableHeader from '../components/tableheader';
import ImageRow from '../components/imagerow';
import Slider from '../components/slider';
import RowHeaders from '../components/rowheaders';
import TableContent from '../components/tablecontent';
import tableStyles from '../styles/tablestyles';
import merge from 'lodash/object/merge';

export default (p, a) => {
    let isSecondTable = (p.rows.type === 'secondary');
    let isSmall = p.ui.screenHeight < 640;
    let hasDesktopWidth = p.ui.screenWidth > 600;
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

    let thumbnails = p.rows.type === 'detailed' && !p.ui.hasShortHeight ? (
        <ImageRow {...p} />
    ) : null;

    let slider = p.rows.type === 'detailed' &&
                    p.ui.chartVisible &&
                    !p.ui.hasShortHeightDetail ? (
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
            className={hasDesktopWidth
                ? 'dataTable desktop'
                : isSecondTable && isSmall
                    ? 'dataTable small'
                    : 'dataTable'
            }

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
                    width: p.columnWidthHeader,
                    height: p.tableHeight,
                    overflow: 'hidden',
                    // backgroundColor: 'blue',
                    float: 'left'
                }}
            >
                <div
                    style={merge(tableStyles(p).borderBottom,
                        tableStyles(p).borderRight,
                        {
                            width: p.columnWidthHeader
                        }
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
