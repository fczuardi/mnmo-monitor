import {Actions} from 'flummox';

class GroupsActions extends Actions {
    changeGroupSelection(groupID) {
        return parseInt(groupID);
    }
}

export default GroupsActions;
