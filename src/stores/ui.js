import {Store} from 'flummox';

const INFINITE_SCROLL_THRESHOLD = 0;
const ROWS_PAGE_SIZE = 30;



const mobileBreakpointWidth = 599;

class UIStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        // const rowsActions = flux.getActions('rows');
        this.rowsStore = flux.getStore('rows');
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.register(userActions.openSubmenu, this.changeSubmenu);
        this.register(userActions.closeSubmenu, this.changeSubmenu);
        this.register(userActions.openPanel, this.changePanel);
        this.register(userActions.closePanel, this.changePanel);
        this.register(userActions.tableScroll, this.changeTableScroll);
        this.register(sessionActions.signOut, this.resetState);
        // this.register(rowsActions.rowsFetchCompleted, this.unlockInfiniteLoad);
        this.register(userActions.errorArrived, this.displayError);
        this.register(userActions.errorDismissed, this.resetError);
        this.register(sessionActions.tokenGranted, this.resetError);
        this.userActions = userActions;
        this.state = {
            menuClosed: true,
            submenu: null,
            panel: null,
            supportsSVG: document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"),
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            isMobile: (window.innerWidth <= mobileBreakpointWidth),
            lastVisibleRow: ROWS_PAGE_SIZE,
            tableScrollTop: 0,
            tableScrollLeft: 0,
            isLoading: false,
            isFakeLoading: false,
            error: null
        };
        this.ticking = false;
        this.nextPageLoadSent = true;
        this.coordX = 0;
        this.coordY = 0;
        this.scrollEndInterval = 0;
        window.addEventListener('resize', this.widthChange.bind(this));
        this.scrollUpdate = this.scrollUpdate.bind(this);
        this.addListener('change', this.stopTicking);
        this.rowStateChanged = this.rowStateChanged.bind(this);
        this.rowsStore.addListener('change', this.rowStateChanged);
        this.previousLoadingState = this.rowsStore.state.loading;
    }
    
    displayError(message){
        this.setState({
            error: message
        });
    }
    resetError() {
        this.setState({
            error: null
        });
    }
    
    rowStateChanged() {
        if (this.rowsStore.state.data.length === 0){
            this.resetScroll();
        }
        if (this.previousLoadingState !== this.rowsStore.state.loading){
            this.previousLoadingState = this.rowsStore.state.loading;
            if (this.rowsStore.state.loading === true){
                this.rowsLoading();
            }else{
                this.unlockInfiniteLoad();
            }
        }
    }
    
    stopTicking() {
        this.ticking = false;
    }
    changeMenuState() {
        this.setState({
            panel: null,
            menuClosed: !this.state.menuClosed
        });
        if (!this.state.menuClosed) {
            this.changeSubmenu(null);
        }else{
            document.body.scrollTop = 0;
        }
    }
    changeSubmenu(name) {
        this.setState({
            submenu: name
        });
    }
    changePanel(name) {
        if (this.state.panel === name) {
            name = null;
        }
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
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            isMobile: (window.innerWidth <= mobileBreakpointWidth)
        });
    }
    rowsLoading(){
        this.setState({
            isLoading: true,
            isFakeLoading: false
        });
    }
    unlockInfiniteLoad(){
        this.nextPageLoadSent = false;
        this.setState({
            isLoading: false
        });
    }
    raiseVisibleRowsCount(isNextPageCached){
        let lastVisibleRow = this.state.lastVisibleRow + ROWS_PAGE_SIZE;
        // console.log('raiseVisibleRowsCount', isNextPageCached, lastVisibleRow);
        let store = this;
        if (isNextPageCached) {
            this.setState({
                isFakeLoading: true
            });
            window.setTimeout(function(){
                store.setState({
                    lastVisibleRow:lastVisibleRow,
                    isFakeLoading: false
                });
            }, 1000);
        } else {
            store.setState({
                lastVisibleRow:lastVisibleRow
            });
        }
    }
    resetScroll(){
        this.setState({
            lastVisibleRow: ROWS_PAGE_SIZE
        });
    }
    scrollUpdate(){
        let tableheaders = document.getElementById('table-headers'),
            rowheaders = document.getElementById('row-headers'),
            tableContents = document.getElementById('table-contents'),
            scrollEnded = this.coordY >= (
                                    tableContents.scrollHeight - 
                                    tableContents.offsetHeight - 
                                    INFINITE_SCROLL_THRESHOLD ),
            store = this;

        tableheaders.scrollLeft = this.coordX;
        rowheaders.scrollTop = this.coordY;
        
        if (scrollEnded && 
            !this.nextPageLoadSent &&
            !this.state.isLoading &&
            !this.state.isFakeLoading
        ) {
            let isNextPageLoaded = (store.state.lastVisibleRow < store.rowsStore.state.data.length);
            if (!isNextPageLoaded){
                this.nextPageLoadSent = true;
                this.userActions.tableScrollEnded();
            }
            store.raiseVisibleRowsCount(isNextPageLoaded);
        }
        this.stopTicking();
    }
    changeTableScroll(coord){
        this.coordX = coord.left;
        this.coordY = coord.top;
        if (!this.ticking) {
            this.ticking = true;
            window.requestAnimationFrame(this.scrollUpdate);
        }
    }
}

export default UIStore;
