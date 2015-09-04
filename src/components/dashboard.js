import template from '../templates/dashboard.jsx';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';

const appHeaderHeight = 55;
const smallColumnWidth = 60;
const mediumColumnWidth = 106;
const cellPadding = 8;


class Dashboard {
    render() {
        let p = merge({}, this.props);
        let varsCount = keys(p.vars.combos).length;
        let thumbnailsRowHeight = 120,
            sliderHeight = 30,
            tableTitleHeight = 30,
            defaultChartHeight = this.props.ui.isMobile ? 
                                    Math.round(p.ui.screenHeight * 0.3) : 264,
            rowHeight = (this.props.ui.isMobile && p.rows.type == 'detailed') ? 40 : 60;

        
        
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
        p.iconWidth = smallColumnWidth - 2 * cellPadding;
        p.cellPadding = cellPadding;
                    
        p.chartHeight = !p.ui.chartVisible ? 0 : defaultChartHeight;
        p.tableHeight = p.ui.screenHeight - 
                            appHeaderHeight - 
                            p.chartHeight -
                            tableTitleHeight;
        if (p.rows.type == 'detailed'){
            if(p.ui.chartVisible) {
                //table height must be the height of x rows
                //where x is the number of indexes
                p.tableHeight = p.rowHeight * varsCount + 
                                    p.rowHeight; // table header

                //chart height is the rest of the screen
                p.chartHeight = p.ui.screenHeight - 
                                    appHeaderHeight - 
                                    thumbnailsRowHeight - 
                                    sliderHeight -
                                    p.tableHeight -
                                    tableTitleHeight;
            }else{
                p.tableHeight -= thumbnailsRowHeight;
            }
        }
        
        return template(p, actions);
    }
}

export default Dashboard;
