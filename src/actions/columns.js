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
    colorSwitchToggle(index){
        return index;
    }
    columnColorChanged(index, color){
        return {
            index: index,
            color: color
        };
    }
    columnIconFailed(columnID){
        return parseInt(columnID);
    }
    outOfSync(){
        return null;
    }
}

export default ColumnActions;
