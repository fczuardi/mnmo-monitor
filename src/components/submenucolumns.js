import template from '../templates/submenucolumns.jsx';
import tryRender from '../lib/trycomponent';

class ColumnsSubmenu {
    render() {
        const columnActions = this.props.flux.getActions('columns')
        const actions = {
            closeDrawer: () =>
                this.props.flux.getActions('user').closeSubmenu(),
            editColors: () =>
                this.props.flux.getActions('user').openSubmenu('colors'),
            columnChange: (event) => {
                return this.props.flux.getActions('columns').updateColumnSelectedState(
                    event.target.value,
                    event.target.checked,
                    event.nativeEvent.target.getAttribute('data-index')
                );
            },
            columnMove: (draggableIndex, dropzoneIndex) =>
                this.props.flux.getActions('columns').columnMoved(draggableIndex, dropzoneIndex),
            onImageError: (event) => {
                console.log('imageError',event.target.getAttribute('data-id'));
                columnActions.columnIconFailed(event.target.getAttribute('data-id'));
            }
        };
        return tryRender('submenucolumns', template, this.props, actions);
    }
}

export default ColumnsSubmenu;
