import {Actions} from 'flummox';

class GroupsActions extends Actions {
    changeGroupSelection(groupID) {
        return parseInt(groupID);
    }
    changeClassSelection(classID) {
        return parseInt(classID);
    }
}

export default GroupsActions;
