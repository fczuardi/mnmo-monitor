import {Store} from 'flummox';

const INFINITE_SCROLL_THRESHOLD = 0;
const VISIBEL_ROWS_OUTSIDE = 40;



const mobileBreakpointWidth = 599;
const appHeaderHeight = 55;
const chartHeight = 264;
const rowHeight = 60;



class UIStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        const rowsActions = flux.getActions('rows');
        this.rowsStore = flux.getStore('rows');
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.register(userActions.openSubmenu, this.changeSubmenu);
        this.register(userActions.closeSubmenu, this.changeSubmenu);
        this.register(userActions.openPanel, this.changePanel);
        this.register(userActions.closePanel, this.changePanel);
        this.register(userActions.tableScroll, this.changeTableScroll);
        this.register(sessionActions.signOut, this.resetState);
        this.register(rowsActions.rowsFetchCompleted, this.unlockInfiniteLoad);
        this.register(userActions.errorArrived, this.displayError);
        this.register(userActions.errorDismissed, this.resetError);
        this.userActions = userActions;
        this.state = {
            menuClosed: true,
            submenu: null,
            panel: null,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            isMobile: (window.innerWidth <= mobileBreakpointWidth),
            visibleStart: 0,
            visibleEnd: 5,
            tableScrollTop: 0,
            tableScrollLeft: 0,
            isLoading: true,
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
            isLoading: true
        });
        this.setRenderedRows(document.getElementById('table-contents').scrollTop, true);
    }
    unlockInfiniteLoad(){
        this.nextPageLoadSent = false;
        this.setState({
            isLoading: false
        });
        this.setRenderedRows(document.getElementById('table-contents').scrollTop, false);
    }
    setRenderedRows(tableScroll, forceUpdate) {
        // - p.rows.data and p.rows.headers can be huge arrays (1500 rows)
        // - drawing a huge table is not an option.
        //
        // the idea then is to draw all rows as empty with the exception of
        // a slice of visible rows
        let tableHeight = this.state.screenHeight - 
                            appHeaderHeight - 
                            (this.state.isMobile ? 0 : chartHeight);
        let currentRow = Math.floor(tableScroll / rowHeight);
        let currentEnd = currentRow + Math.floor(tableHeight / rowHeight);

        if (
            (forceUpdate) ||
            (currentRow < this.state.visibleStart) ||
            (currentEnd > this.state.visibleEnd)
        ){
            // console.log('change start:', this.state.visibleStart, currentRow - VISIBEL_ROWS_OUTSIDE);
            // console.log('change end:', this.state.visibleEnd, currentEnd + VISIBEL_ROWS_OUTSIDE);
            this.setState({
                // visibleStart: currentRow - VISIBEL_ROWS_OUTSIDE,
                visibleStart: -1,
                visibleEnd: currentEnd + VISIBEL_ROWS_OUTSIDE
            });
        }
    }
    scrollUpdate(){
        let tableheaders = document.getElementById('table-headers'),
            rowheaders = document.getElementById('row-headers'),
            tableContents = document.getElementById('table-contents'),
            shouldLoadNextPage = this.coordY >= (
                                    tableContents.scrollHeight - 
                                    tableContents.offsetHeight - 
                                    INFINITE_SCROLL_THRESHOLD ),
            store = this;

        tableheaders.scrollLeft = this.coordX;
        rowheaders.scrollTop = this.coordY;
        
        if (shouldLoadNextPage && !this.nextPageLoadSent) {
           this.nextPageLoadSent = true;
            this.userActions.tableScrollEnded();
        }
        window.clearInterval(this.scrollEndInterval);
        this.scrollEndInterval = window.setInterval(function(){
            store.setRenderedRows(tableContents.scrollTop);
            window.clearInterval(store.scrollEndInterval);
        }, 200);
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
