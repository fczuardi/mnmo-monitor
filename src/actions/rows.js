import {Actions} from 'flummox';

class RowsActions extends Actions {
    rowsFetchCompleted(data) {
        return data;
    }
    secondaryRowsFetchCompleted(data) {
        return data;
    }
    rowsTypeSwitchClicked(currentType) {
        let nextType = currentType === 'list' ? 'merged' : 'list';
        return nextType;
    }
    fetchAgainRequested() {
        return null;
    }
    secondTableAddFormSubmitted(){
        return null;
    }
    rowPanelHeightCalculated(h){
        return h;
    }
    baseUpdate(baseID) {
        return parseInt(baseID);
    }
    returnChangedStartTime(){
        // console.log('ACTION returnChangedStartTime');
        return null;
    }
}

export default RowsActions;
