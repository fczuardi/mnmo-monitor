import {Store} from 'flummox';

class UIStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.register(userActions.openSubmenu, this.changeSubmenu);
        this.register(userActions.closeSubmenu, this.changeSubmenu);
        this.state = {
            menuClosed: true,
            submenu: null
        };
    }
    changeMenuState() {
        this.setState({
            menuClosed: !this.state.menuClosed
        });
        if (!this.state.menuClosed) {
            this.changeSubmenu(null);
        }
    }
    changeSubmenu(name) {
        this.setState({
            submenu: name
        });
    }
}

export default UIStore;
