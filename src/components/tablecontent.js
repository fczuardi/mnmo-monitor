import template from '../templates/tablecontent.jsx';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';

class TableContent {
    shouldComponentUpdate(nextProps) {
        return (
            (nextProps.ui.chartVisible !== this.props.ui.chartVisible) ||
            (nextProps.ui.lastVisibleRow !== this.props.ui.lastVisibleRow) ||
            (nextProps.rows.lastLoad > this.props.rows.lastLoad) ||
            (nextProps.rows.secondary.lastLoad > this.props.rows.secondary.lastLoad) ||
            (nextProps.ui.screenWidth !== this.props.ui.screenWidth) ||
            (nextProps.ui.screenHeight !== this.props.ui.screenHeight) ||
            (nextProps.columns.enabled.length !== this.props.columns.enabled.length) ||
            (nextProps.columns.selected !== this.props.columns.selected) ||
            (nextProps.ui.secondTableVisible !== this.props.ui.secondTableVisible)
        );
    }
    render() {
        // console.log('render table contents');
        let p = merge({}, this.props);
        const userActions = this.props.flux.getActions('user');
        let actions = {
            onTableScroll: (event) => {
                // null
                if (event.target.id === 'secondTableContents') {
                    userActions.secondTableScroll(
                        event.target.scrollTop, event.target.scrollLeft
                    )
                }else{
                    userActions.tableScroll(
                        event.target.scrollTop, event.target.scrollLeft
                    )
                }
            }
        };
        if (p.rows.type === 'detailed' && p.rows.data){
            let rowsWithSeparators = [];
            let headerRowsWithSeparators = [];
            let varsCount = keys(p.vars.combos).length;
            let displaySeparators = (!p.ui.chartVisible || !p.ui.isMobile);
            p.rows.data.forEach( (row, key) => {
                if (displaySeparators && (key % varsCount === 0) ){
                    //duplicate row
                    let rowCopy = row.slice();
                    rowCopy[0] = 'separator';
                    rowsWithSeparators.push(rowCopy);
                }
                rowsWithSeparators.push(row);
            });
            // the table content must have a correct number
            // of headers as well because this is used by the code
            // that styles the lines (getRowClassName)
            p.rows.headers.forEach( (row, key) => {
                if (displaySeparators && (key % varsCount === 0) ){
                    //duplicate row
                    let rowCopy = row.slice();
                    rowCopy[2] = 'separator';
                    headerRowsWithSeparators.push(rowCopy);
                }
                headerRowsWithSeparators.push(row);
            });
            p.rows.headers = headerRowsWithSeparators;
            p.rows.data = rowsWithSeparators;
        }
        return template(p, actions);
    }
}

export default TableContent;
