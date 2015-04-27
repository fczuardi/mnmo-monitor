import {Actions} from 'flummox';

class RowsActions extends Actions {
    rowsFetchCompleted(data) {
        return data;
    }
    rowsTypeSwitchClicked(currentType) {
        let nextType = currentType === 'list' ? 'merged' : 'list';
        return nextType;
    }
}

export default RowsActions;
