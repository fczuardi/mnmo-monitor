import {Component} from 'react';
import template from '../templates/rowheaders.jsx';
import merge from 'lodash/object/merge';
import keys from 'lodash/object/keys';

class RowHeaders extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            (nextProps.ui.chartVisible !== this.props.ui.chartVisible) ||
            (nextProps.ui.lastVisibleRow !== this.props.ui.lastVisibleRow) ||
            (nextProps.rows.lastLoad > this.props.rows.lastLoad) ||
            (nextProps.rows.secondary.lastLoad > this.props.rows.secondary.lastLoad) ||
            (nextProps.rows.hideFirstRow > this.props.rows.hideFirstRow) ||
            (nextProps.ui.screenWidth !== this.props.ui.screenWidth) ||
            (nextProps.ui.screenHeight !== this.props.ui.screenHeight) ||
            (nextProps.columns.enabled.length !== this.props.columns.enabled.length) ||
            (nextProps.ui.secondTableVisible !== this.props.ui.secondTableVisible)
        );
    }
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            onRemoveClicked: (ev) => {
                console.log('remove row clicked!', ev.target.getAttribute('data-key'));
                userActions.secondTableFormChanged('action', ev.target.getAttribute('data-key'));
            }
        }
        let p = merge({}, this.props);
        let isSecondary = p.rows.type === 'secondary';
        if (
            isSecondary ||
            (p.rows.type === 'detailed' && p.rows.headers)
        ){
            let rowsWithSeparators = [];
            let varsCount = keys(p.vars.combos).length;
            // let displaySeparators = (!p.ui.chartVisible || !p.ui.isMobile);
            let displaySeparators = true;
            p.rows.headers.forEach( (row, key) => {
                if (
                    isSecondary ||
                    (displaySeparators && (key % varsCount === 0))
                ){
                    //duplicate row
                    let rowCopy = row.slice();
                    if (isSecondary){
                        rowCopy = ['', '', '', ''];
                    }
                    rowCopy[3] = 'separator';
                    rowsWithSeparators.push(rowCopy);
                }
                rowsWithSeparators.push(row);
            });
            p.rows.headers = rowsWithSeparators;
        }
        // console.log('render RowHeaders', this.props.rows.headers);
        return template(p, actions);
    }
}

export default RowHeaders;
