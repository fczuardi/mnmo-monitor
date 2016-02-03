import {Actions} from 'flummox';

class ColumnActions extends Actions {
    updateColumnSelectedState(columnID, checked, columnIndex) {
        return {
            columnIndex: parseInt(columnIndex),
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
    columnIconFailed(columnID){
        return parseInt(columnID);
    }
}

export default ColumnActions;
