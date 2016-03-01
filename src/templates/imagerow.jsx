import React from 'react';
import URLs from '../../config/endpoints.js';
import ToolbarButton from 'mnmo-components/lib/themes/mnmo/toolbarbutton';
import merge from 'lodash/object/merge';
import tableStyles from '../styles/tablestyles';
// import moment from 'moment';

const smallColumnWidth = 60;
const mediumColumnWidth = 106;
const thumbnailWidth = 157;

export default (p,a) => {
    let cellStyle = {
        position: 'relative',
        borderRight: '1px solid #000',
        width: p.columnWidth - 1,
        minWidth: p.columnWidth - 1,
        backgroundColor: 'rgba(0,0,0,0.8)'
    };
    let mobileCellStyle = {
        height: p.rowHeight,
        overflow: 'hidden',
        position: 'relative',
        borderRight: '1px solid #000',
        width: 2 * p.columnWidth - 1,
        minWidth: 2 * p.columnWidth - 1,
    };
    let imageStyle = {
        height: '100%',
        top: 0,
        margin: 'auto'
    };
    if (p.ui.isMobile){
        imageStyle.position = 'absolute';
    }
    let failedImage = (event) => {
            event.target.parentNode.style.height = 'auto';
            event.target.style.display = 'none';
        },
        loadedImage = (event) => {
            event.target.style.display = 'block';
        };

    let selectedGroupSubgroupsIndexes = {};
    p.groups.selectedGroupSubgroups.map( (subgroup, index) => {
        selectedGroupSubgroupsIndexes[subgroup.id] = index;
    });
    let selectedSubgroupIndex = selectedGroupSubgroupsIndexes[p.user.subgroupID] ?
                            selectedGroupSubgroupsIndexes[p.user.subgroupID] :
                            0;
    let selectedSubgroup = p.groups.selectedGroupSubgroups.length === 0 ? null :
                        p.groups.selectedGroupSubgroups[selectedSubgroupIndex];
    let subgroupPicker = selectedSubgroup === null ? null :
    (
        <div style={{
            width: '100%',
            height: p.ui.isMobile ? p.subgroupPickerHeight : 'auto',
            color: '#FFFFFF',
            textAlign: 'center',
            paddingLeft: 10
        }}>
            <ToolbarButton
                type={'dialogToggle'}
                closed={(p.ui.panel !== 'subgroups')}
                onClick={a.subgroupPickerClicked}
            >
                {selectedSubgroup.shortLabel}
            </ToolbarButton>
        </div>
    );
    let emptyCell = p.ui.isMobile ? null : (
        <td key="first" style={cellStyle}>
            {subgroupPicker}
        </td>
    );
    let groupID = selectedSubgroup !== null ? selectedSubgroup.secondaryId :
                p.groups.selected === null ? '' :
                p.groups.selected.secondaryId !== -1 ?
                p.groups.selected.secondaryId : p.groups.selected.id;
    let imgElement = (column, key) => {
        let columnColors = tableStyles(p).columnColors;
        let backgroundColor = columnColors[(key % columnColors.length)];
        let hasThumbnail = (
            column !== null &&
            column.thumbnails !== false &&
            p.groups.selected &&
            p.groups.selected.thumbnailsUrl
        );
        let isSelected = p.columns.selected === key;
        let divStyle = {
            backgroundColor: backgroundColor,
            height: p.ui.isMobile ? 60 : 120,
            minHeight: p.ui.isMobile ? 60 : 120,
            width: p.ui.isMobile ? mobileCellStyle.width: cellStyle.width,
            overflow: 'hidden',
            margin: p.ui.isMobile ? 0 : 'auto'
        };
        if (p.ui.isMobile && isSelected && !hasThumbnail){
            divStyle.position = 'absolute';
            divStyle.height = divStyle.minHeight = 120;
            divStyle.top = 0;
        }
        if (!hasThumbnail){
            return(
                <div
                    key={key}
                    style={divStyle}>
                </div>
            );
        }
        let style = merge({}, imageStyle);
        if (p.ui.isMobile){
            style = merge(style, {height: 'auto', width:'100%'});
            if (isSelected){
                style = merge(style, {height: '100%', width:'auto', marginLeft: -22});
            }
        }else{
            if (p.columnWidth < thumbnailWidth){
                style = merge(style, {marginLeft: -(thumbnailWidth - p.columnWidth)/2});
            }
        }
        //different than the dates on the tables that can change
        //from one day to another at different times depending on country,
        //for the thumbnails call the day always turn at 00:00
        //so we must add 1 day if the time is from 00:00 until the 'lastMinute'
        //value for that country
        // let tableDay = moment(
        //     p.rows.date.replace(/-/gi, '') + 'T' + p.ui.minute
        // );
        // let tableDayStart = moment(
        //     p.rows.date.replace(/-/gi, '') + 'T' + p.calendar.firstMinute.replace(/:/gi, '')
        // );
        // let realDayStart = moment(
        //     p.rows.date.replace(/-/gi, '') + 'T0000'
        // );
        // let realDay = tableDay.clone();
        //
        // // console.log('tableDay', tableDay.format('YYYYMMDD'),
        // //             'tableDayEnd', tableDayEnd.format('YYYYMMDD'));
        //
        // //isBetween match is exclusive http://momentjs.com/docs/#/query/is-between/
        // if (tableDay.isBetween(realDayStart.subtract(1, 'm'), tableDayStart)){
        //     realDay.add(1, 'd');
        // }
        //
        // let dayParam = realDay.format('YYYYMMDD');
        // // console.log('dayParam', dayParam);
        let dayParam = p.rows.date.replace(/-/gi, '');
        return (
            <div
                key={key}
                style={divStyle}
            >
            <img
                onLoad={loadedImage}
                onError={failedImage}
                style={style}
                src={hasThumbnail ? (
                    p.groups.selected.thumbnailsUrl + '?' +
                    URLs.images.groupParam + '=' + groupID + '&' +
                    URLs.images.columnParam + '=' + column.id + '&' +
                    URLs.images.dayParam + '=' + dayParam + '&' +
                    URLs.images.hourParam + '=' + p.ui.minute
                ) : null}
            />
            <div
                style={{
                    position: 'absolute',
                    backgroundColor: backgroundColor,
                    width: 6,
                    height: '100%',
                    top: 0,
                    right: 0
                }}
            ></div>

            </div>
        );
    };
    let firstLine = (
        <tr>
        {emptyCell}
        {p.columns.enabled.map( (column, key) => {
            return (
            <td key={key} style={cellStyle}>
                {imgElement(column, key)}
            </td>
            );
        })}
        </tr>
    );
    let secondLine = null;
    if (p.ui.isMobile){
        let first = [];
        let second = [];
        let bucket = first;
        //special case, only 2 columns and second selected
        if (p.columns.enabled.length === 2 && p.columns.selected === 1){
            first.push({
                key: 1,
                rowsSpan: 2
            });
            first.push({
                key: 0,
                rowSpan: 1
            });
        } else {
            p.columns.enabled.forEach( (column, key) => {
                let selected = p.columns.selected;
                let selectedIsOdd = (selected % 2 === 1);
                let isSelected = (key === selected);
                let isPreviousSelected = ((key - 1) === selected);
                let isNextSelected = ((key + 1) === selected);
                let isOdd = (key % 2 === 1);

                if (isSelected){
                    first.push({
                        key: key,
                        rowsSpan: 2
                    });
                } else {
                    if (key < selected) {
                        if (!isOdd) {
                            first.push({
                                key: key,
                                rowSpan: 1
                            });
                        } else {
                            second.push({
                                key: key,
                                rowSpan: 1
                            });
                        }
                    } else {
                        if (isOdd) {
                            first.push({
                                key: key,
                                rowSpan: 1
                            });
                        } else {
                            second.push({
                                key: key,
                                rowSpan: 1
                            });
                        }
                    }
                }
            });
        }
        if (p.columns.enabled.length % 2 === 0){
            second.push({
                key: -1,
                rowSpan: 1
            });
        }
        // console.log('first, second', first, second);

        firstLine = (
            <tr>
            {first.map( (cell, key) => {
                let column = p.columns.enabled[cell.key];
                return (
                    <td key={key} style={mobileCellStyle} rowSpan={cell.rowsSpan}>
                    {imgElement(column, cell.key)}
                    </td>
                );
            })}
            </tr>
        );
        secondLine = (
            <tr style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
            {second.map( (cell, key) => {
                let isEmptyCell = cell.key === -1;
                let column = isEmptyCell ? null :
                                p.columns.enabled[cell.key];
                let style = mobileCellStyle;
                if (isEmptyCell){
                    style = merge(style, {height: 'auto'});
                }
                return (
                    <td key={key} style={style} rowSpan={cell.rowsSpan}>
                    {imgElement(column, cell.key)}
                    </td>
                );
            })}
            </tr>
        );


    }
    return (
        <div
            id="table-images"
            style={{
                width: p.ui.screenWidth,
                overflow: 'hidden'
            }}
        >
            {p.ui.isMobile ? subgroupPicker : null}
            <table style={{marginLeft: 1}}>
                <tbody>
                    {firstLine}
                    {secondLine}
                </tbody>
            </table>
        </div>
    );
};
