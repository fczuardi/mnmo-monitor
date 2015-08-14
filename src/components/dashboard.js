import template from '../templates/dashboard.jsx';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';

const appHeaderHeight = 55;
const rowHeight = 60;

class Dashboard {
    render() {
        let p = merge({}, this.props);
        let varsCount = keys(p.vars.combos).length;
        let thumbnailsRowHeight = 120,
            sliderHeight = 30,
            tableTitleHeight = 30,
            defaultChartHeight = 264;

        
        
        const actions = {
            subgroupsButtonClicked: () =>
                this.props.flux.getActions('user').openPanel('subgroups')
        };
    
        p.rowHeight = rowHeight;
                            
        p.chartHeight = !p.ui.chartVisible ? tableTitleHeight : defaultChartHeight;
        p.tableHeight = p.ui.screenHeight - 
                            appHeaderHeight - 
                            p.chartHeight;
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
                                    p.tableHeight;
            }else{
                p.tableHeight -= thumbnailsRowHeight;
            }
        }
        
        return template(p, actions);
    }
}

export default Dashboard;
