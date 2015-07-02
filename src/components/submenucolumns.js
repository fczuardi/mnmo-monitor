import template from '../templates/submenucolumns.jsx';

class ColumnsSubmenu {
    render() {
        const columnActions = this.props.flux.getActions('columns')
        const actions = {
            closeDrawer: () => 
                this.props.flux.getActions('user').closeSubmenu(),
            columnChange: (event) => 
                this.props.flux.getActions('columns').updateColumnSelectedState(event.target.value, event.target.checked),
            columnMove: (draggableIndex, dropzoneIndex) => 
                this.props.flux.getActions('columns').columnMoved(draggableIndex, dropzoneIndex),
            onImageError: (event) => {
                console.log('imageError',event.target.getAttribute('data-id'));
                columnActions.columnIconFailed(event.target.getAttribute('data-id'));
            }
        };
        return template(this.props, actions);
    }
}

export default ColumnsSubmenu;
