import {Store} from 'flummox';

class UIStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.state = {
            menuClosed: true
        };
    }
    changeMenuState() {
        this.setState({
            menuClosed: !this.state.menuClosed
        });
    }
}

export default UIStore;
