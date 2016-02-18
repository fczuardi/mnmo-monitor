import template from '../templates/dashboard.jsx';
import tryRender from '../lib/trycomponent';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';

const appHeaderHeight = 55;
const smallColumnWidth = 60;
const smallerRowHeight = 40;
const secondTableRowHeight = 50;
const smallerSecondTableRowHeight = 30;
const mediumColumnWidth = 106;
const cellPadding = 8;
const subgroupPickerHeight = 25;
const secondTableToolbarHeight = 50;
const secondTableSeparatorHeight = 20;
const separatorHeight = 40;


class Dashboard {
    render() {
        let p = merge({}, this.props);
        let varsCount = keys(p.vars.combos).length;
        let thumbnailsRowHeight = 120,
            sliderHeight = p.ui.chartVisible && !p.ui.hasShortHeightDetail ? 30 : 0,
            tableTitleHeight = 24,
            secondTableVisible = (p.ui.secondTableVisible && p.rows.type !== 'detailed'),
            defaultChartHeight = this.props.ui.isMobile ?
                                    Math.round(p.ui.screenHeight * 0.3) : 264,
            // rowHeight = (this.props.ui.isMobile && p.rows.type == 'detailed') ? 40 : smallColumnWidth;
            rowHeight = this.props.ui.screenHeight < 640 ? smallerRowHeight :
                                                                smallColumnWidth;

        const actions = {
        };

        let columnWidth = p.ui.isMobile ? smallColumnWidth : mediumColumnWidth;
        p.rowHeight = rowHeight;
        p.secondTableRowHeight = this.props.ui.screenHeight < 640 ?
                            smallerSecondTableRowHeight : secondTableRowHeight;
        p.tableWidth = p.ui.screenWidth;
        p.tableContentWidth = p.columns.enabled.length * columnWidth;
        p.columnWidth = p.tableContentWidth > p.tableWidth ? columnWidth :
             Math.ceil((p.tableWidth) / (p.columns.enabled.length + 1));
        p.iconWidth = rowHeight - 2 * cellPadding;
        p.cellPadding = cellPadding;

        p.chartHeight = (
                    !p.ui.chartVisible ||
                    p.ui.hasShortHeight ||
                    (p.ui.hasShortHeightDetail && p.rows.type === 'detailed')
                ) ? 7 : defaultChartHeight;
        p.tableTitleHeight = tableTitleHeight;
        p.appHeaderHeight = appHeaderHeight;

        // dashboard screen table base height
        p.tableHeight = p.ui.screenHeight -
                            appHeaderHeight -
                            p.chartHeight;

        //when chart is not visible, table title height takes the chart space
        if (!p.ui.chartVisible || p.ui.hasShortHeight){
            p.tableHeight -= tableTitleHeight;
        }
        // when secondTable is visible subtract the second table height
        // from the main table
        if (secondTableVisible && !p.ui.hasShortHeight){
            // p.secondTableHeight = secondTableToolbarHeight;
            p.secondTableHeight = Math.max(1, p.rows.secondary.data.length) * p.secondTableRowHeight;
            p.secondTableHeight += p.rows.secondary.data.length * secondTableSeparatorHeight;
            p.tableHeight -= (p.secondTableHeight + secondTableToolbarHeight);
            p.secondTableSeparatorHeight = secondTableSeparatorHeight;
        }

        //on the detail screen there is also thumbnails and slider heights to
        //be considered
        if (p.rows.type == 'detailed'){
            //on mobile the subgroup picker is placed in it's own line
            p.subgroupPickerHeight = (
                p.ui.isMobile &&
                p.groups.selectedGroupSubgroups.length > 0
            ) ? subgroupPickerHeight : 0;

            if(p.ui.isMobile && p.ui.chartVisible && !p.ui.hasShortHeightDetail ) {
                // table height must be the height of x rows
                // where x is the number of indexes
                p.tableHeight = p.rowHeight * varsCount +
                                    separatorHeight +
                                    p.rowHeight; // table header
                // chart height is the rest of the screen
                p.chartHeight = p.ui.screenHeight -
                                    appHeaderHeight -
                                    sliderHeight -
                                    thumbnailsRowHeight -
                                    p.subgroupPickerHeight -
                                    p.tableHeight;
            } else if (!p.ui.hasShortHeight){
                p.tableHeight -= (thumbnailsRowHeight + sliderHeight);
            }
        }

        return tryRender('dashboard', template, p, actions);
    }
}

export default Dashboard;
