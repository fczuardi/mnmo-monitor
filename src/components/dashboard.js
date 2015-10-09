import template from '../templates/dashboard.jsx';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';

const appHeaderHeight = 55;
const smallColumnWidth = 60;
const smallerRowHeight = 40;
const mediumColumnWidth = 106;
const cellPadding = 8;
const subgroupPickerHeight = 25;


class Dashboard {
    render() {
        let p = merge({}, this.props);
        let varsCount = keys(p.vars.combos).length;
        let thumbnailsRowHeight = 120,
            sliderHeight = 30,
            tableTitleHeight = 24,
            defaultChartHeight = this.props.ui.isMobile ?
                                    Math.round(p.ui.screenHeight * 0.3) : 264,
            // rowHeight = (this.props.ui.isMobile && p.rows.type == 'detailed') ? 40 : smallColumnWidth;
            rowHeight = this.props.ui.screenHeight < 640 ? smallerRowHeight : smallColumnWidth;

        const actions = {
            subgroupsButtonClicked: () =>
                this.props.flux.getActions('user').openPanel('subgroups')
        };

        let columnWidth = p.ui.isMobile ? smallColumnWidth : mediumColumnWidth;
        p.rowHeight = rowHeight;
        p.tableWidth = p.ui.screenWidth;
        p.tableContentWidth = p.columns.enabled.length * columnWidth;
        p.columnWidth = p.tableContentWidth > p.tableWidth ? columnWidth :
             Math.ceil((p.tableWidth) / (p.columns.enabled.length + 1));
        p.iconWidth = rowHeight - 2 * cellPadding;
        p.cellPadding = cellPadding;

        p.chartHeight = !p.ui.chartVisible ? 0 : defaultChartHeight;
        p.tableTitleHeight = tableTitleHeight;
        p.appHeaderHeight = appHeaderHeight;

        // dashboard screen table base height
        p.tableHeight = p.ui.screenHeight -
                            appHeaderHeight -
                            p.chartHeight;

        //when chart is not visible, table title height takes the chart space
        if (!p.ui.chartVisible){
            p.tableHeight -= tableTitleHeight;
        }
        //on the detail screen there is also thumbnails and slider heights to
        //be considered
        if (p.rows.type == 'detailed'){
            //on mobile the subgroup picker is placed in it's own line
            p.subgroupPickerHeight = (
                p.ui.isMobile &&
                p.groups.selectedGroupSubgroups.length > 0
            ) ? subgroupPickerHeight : 0;

            if(p.ui.isMobile && p.ui.chartVisible) {
                // table height must be the height of x rows
                // where x is the number of indexes
                p.tableHeight = p.rowHeight * varsCount +
                                    p.rowHeight; // table header
                // chart height is the rest of the screen
                p.chartHeight = p.ui.screenHeight -
                                    appHeaderHeight -
                                    sliderHeight -
                                    thumbnailsRowHeight -
                                    p.subgroupPickerHeight -
                                    p.tableHeight;
            } else {
                p.tableHeight -= (thumbnailsRowHeight + sliderHeight);
            }
        }

        return template(p, actions);
    }
}

export default Dashboard;
