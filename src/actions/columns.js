import {Actions} from 'flummox';

class ColumnActions extends Actions {
    updateColumnSelectedState(columnID, checked) {
        return {
            columnID: columnID,
            checked: checked
        };
    }
}

export default ColumnActions;
