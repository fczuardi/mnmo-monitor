import {Actions} from 'flummox';

class GroupsActions extends Actions {
    changeGroupSelection(groupID) {
        return parseInt(groupID);
    }
    changeSubGroupSelection(subGroupID) {
        return parseInt(subGroupID);
    }
    changeClassSelection(classID) {
        return parseInt(classID);
    }
}

export default GroupsActions;
