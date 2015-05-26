import template from '../templates/tablecontent.jsx';

class TableContent {
    shouldComponentUpdate(nextProps) {
        return (nextProps.rows.lastLoad > this.props.rows.lastLoad);
    }
    render() {
        console.log('render table contents');
        const userActions = this.props.flux.getActions('user');
        let actions = {
            onTableScroll: (event) => 
                // null
                userActions.tableScroll(
                    event.target.scrollTop, event.target.scrollLeft
                )
        };
        return template(this.props, actions);
    }
}

export default TableContent;