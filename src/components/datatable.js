import template from '../templates/datatable.jsx';
import merge from 'lodash/object/merge';
// import keys from 'lodash/object/keys';

const smallColumnWidth = 60;
const mediumColumnWidth = 106;
const cellPadding = 8;
const rowHeight = 60;
const appHeaderHeight = 55;
// const chartHeight = 264;
const chartHeight = 0;

class DataTable {
    render() {
        const rowsActions = this.props.flux.getActions('rows');
        let actions = {
            firstHeaderButtonClick: (event) => 
                rowsActions.rowsTypeSwitchClicked(
                    event.target.getAttribute('data-type')
                )
        };
        let p = merge({}, this.props),
            isMobile = p.ui.isMobile,
            columnWidth = isMobile ? smallColumnWidth : mediumColumnWidth,
            iconWidth = smallColumnWidth - 2 * cellPadding;
        p.tableWidth = p.ui.screenWidth;
        p.tableContentWidth = p.columns.enabled.length * columnWidth;
        p.tableHeight = p.ui.screenHeight - 
                            appHeaderHeight - 
                            (isMobile ? 0 : chartHeight);
        if (p.rows.type === 'detailed' ){
            // let variablesCount = keys(this.props.vars.combos).length;
            // p.tableHeight = rowHeight * (variablesCount + 1) - (variablesCount - 1);
            
            let sliderElement = document.getElementById('table-slider');
            let imagesElement = document.getElementById('table-images');

            if (sliderElement !== null){
                p.tableHeight -= sliderElement.offsetHeight;
            }
            if (imagesElement !== null){
                p.tableHeight -= imagesElement.offsetHeight;
            }
        }
        p.columnWidth = p.tableContentWidth > p.tableWidth ? columnWidth :
             Math.ceil((p.tableWidth) / (p.columns.enabled.length + 1));
        p.rowHeight = rowHeight;
        p.iconWidth = iconWidth;
        p.cellPadding = cellPadding;
        p.isMobile = isMobile;
        return template(p, actions);
    }
}

export default DataTable;
