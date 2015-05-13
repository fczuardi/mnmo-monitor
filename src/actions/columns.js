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
}

export default ColumnActions;
