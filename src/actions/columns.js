import {Actions} from 'flummox';

class ColumnActions extends Actions {
    updateColumnSelectedState(columnID, checked) {
        return {
            columnID: columnID,
            checked: checked
        };
    }
    columnsFetched(columns) {
        return columns;
    }
    columnsPublished(columns){
        return columns;
    }
    columnMoved(oldIndex, newIndex){
        return {
            oldIndex: parseInt(oldIndex),
            newIndex: parseInt(newIndex)
        };
    }
    columnHeaderSelected(index){
        return index;
    }
}

export default ColumnActions;
