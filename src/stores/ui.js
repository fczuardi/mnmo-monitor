import {Store} from 'flummox';

class UIStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.register(userActions.openSubmenu, this.changeSubmenu);
        this.register(userActions.closeSubmenu, this.changeSubmenu);
        this.register(userActions.openPanel, this.changePanel);
        this.register(userActions.closePanel, this.changePanel);
        this.register(sessionActions.signOut, this.resetState);
        this.state = {
            menuClosed: true,
            submenu: null,
            panel: null,
            screenWidth: window.innerWidth
        };
        window.addEventListener('resize', this.widthChange.bind(this));
    }
    changeMenuState() {
        this.setState({
            panel: null,
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
    changePanel(name) {
        this.setState({
            panel: name,
            menuClosed: true
        });
    }
    resetState() {
        this.setState({
            menuClosed: true,
            submenu: null,
            panel: null
        });
    }
    widthChange() {
        this.setState({
            screenWidth: window.innerWidth
        });
    }
}

export default UIStore;
