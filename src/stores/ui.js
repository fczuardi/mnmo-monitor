import {Store} from 'flummox';
import keys from 'lodash/object/keys';
import moment from 'moment';

const INFINITE_SCROLL_THRESHOLD = 0;
const ROWS_PAGE_SIZE = 30;

const mobileBreakpointWidth = 599;
const smallColumnWidth = 60;
const smallerRowHeight = 40;

class UIStore extends Store {
    constructor(flux) {
        super();
        const userActions = flux.getActions('user');
        const sessionActions = flux.getActions('session');
        const columnsActions = flux.getActions('columns');
        const rowsActions = flux.getActions('rows');
        this.rowsStore = flux.getStore('rows');
        this.variablesStore = flux.getStore('vars');
        this.userStore = flux.getStore('user');
        this.register(sessionActions.tokenGranted, this.showSplash);
        this.register(userActions.preferencesFetched, this.hideSplash);
        this.register(rowsActions.rowsFetchCompleted, this.hideSplash);
        this.register(rowsActions.rowsTypeSwitchClicked, this.rowTypeSwitched);
        this.register(rowsActions.rowPanelHeightCalculated, this.setRowPanelHeight);
        this.register(userActions.menuVisibilityToggle, this.changeMenuState);
        this.register(userActions.chartVisibilityToggle, this.toggleChart);
        this.register(userActions.openSubmenu, this.changeSubmenu);
        this.register(userActions.closeSubmenu, this.changeSubmenu);
        this.register(userActions.openPanel, this.changePanel);
        this.register(userActions.closePanel, this.changePanel);
        this.register(userActions.navigateToScreen, this.changeScreen);
        this.register(userActions.tableScroll, this.changeTableScroll);
        this.register(userActions.secondTableScroll, this.changeSecondTableScroll);
        this.register(userActions.sliderScroll, this.sliderTableScroll);
        this.register(sessionActions.signOut, this.resetMenuState);
        this.register(userActions.changePasswordPublished, this.resetScreen);
        this.register(userActions.forgotPasswordAccepted, this.resetScreen);
        this.register(userActions.errorArrived, this.displayError);
        this.register(userActions.errorDismissed, this.resetError);
        this.register(userActions.splitScreenButtonToggle, this.splitScreenMenuToggle);
        this.register(userActions.secondTableEnabled, this.displaySecondTable);
        this.register(sessionActions.tokenGranted, this.resetError);
        this.register(columnsActions.columnHeaderSelected, this.resetMenuState);
        this.userActions = userActions;
        this.state = {
            // first digit is cosmetic, don't mean nothing,
            // the next 3 follows semver (major.minor.patch) http://semver.org/
            version: 'v3.0.6.20',
            menuClosed: true,
            submenu: null,
            panel: null,
            screen: null,
            chartVisible: true,
            secondTableVisible: false,
            splitScreenMenuClosed: true,
            displaySplash: true,
            supportsSVG: document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'),
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            rowPanelHeight: 0,
            isMobile: (window.innerWidth <= mobileBreakpointWidth),
            lastVisibleRow: ROWS_PAGE_SIZE,
            tableScrollTop: 0,
            tableScrollLeft: 0,
            isLoading: false,
            isFakeLoading: false,
            minute: '000000', // hhmmss
            oldestMinute: '000000',
            newestMinute: '000000',
            error: null,
            warning: null,
            canDragSlide: true
        };
        this.ticking = false;
        this.secondTicking = false;
        this.nextPageLoadSent = true;
        this.coordX = 0;
        this.coordY = 0;
        this.secondCoordX = 0;
        this.secondCoordY = 0;
        this.scrollEndInterval = 0;
        this.imageUpdateInterval = 0;
        if (window.addEventListener) {
            window.addEventListener('resize', this.widthChange.bind(this));
        }else{
            window.attachEvent('onresize', this.widthChange.bind(this));
        }
        this.scrollUpdate = this.scrollUpdate.bind(this);
        this.secondScrollUpdate = this.secondScrollUpdate.bind(this);
        this.addListener('change', this.stopTicking);
        this.rowStateChanged = this.rowStateChanged.bind(this);
        this.sliderTableScroll = this.sliderTableScroll.bind(this);
        this.rowsStore.addListener('change', this.rowStateChanged);
        this.previousLoadingState = this.rowsStore.state.loading;
    }

    setRowPanelHeight(h){
        this.setState({
            rowPanelHeight: h
        });

    }
    showSplash(){
        this.setState({
            displaySplash: true
        });
    }

    hideSplash(){
        //check to see if user preferences and rows have finished loading
        if (
            this.userStore.state.groupID === null ||
            this.rowsStore.state.loading === true
        ){
            return null;
        }
        this.setState({
            displaySplash: false
        });
    }

    displayError(info){
        console.log('displayError', info);
        this.setState({
            error: info.message,
            errorTryAgainAction: info.tryAgainAction,
            warning: info.warning
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
                this.updateMinute();
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
    toggleChart(status) {
        let newVisibility = status !== undefined ?
                                status === 'on' :
                                ! this.state.chartVisible;
        this.setState({
            chartVisible: newVisibility,
            secondTableVisible: false,
            splitScreenMenuClosed: true
        });
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
    changeScreen(name) {
        this.setState({
            screen: name,
            menuClosed: true
        });
    }
    resetScreen() {
        this.changeScreen(null);
    }
    resetMenuState() {
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
        let tableheaders = document.getElementById('table-headers'),
            rowheaders = document.getElementById('row-headers'),
            tableContents = document.getElementById('table-contents'),
            tableImages = document.getElementById('table-images') || {},
            columnBars = document.getElementById('column-bars') || {};

        if (!tableContents){
            return null;
        }

        this.coordY =
        this.coordX =
        tableheaders.scrollTop =
        tableheaders.scrollLeft =
        rowheaders.scrollTop =
        rowheaders.scrollLeft =
        tableContents.scrollTop =
        tableContents.scrollLeft =
        tableImages.scrollTop =
        tableImages.scrollLeft =
        columnBars.scrollLeft = 0;
        this.setState({
            lastVisibleRow: ROWS_PAGE_SIZE
        });
    }
    minuteFromHeader(text){
        return text.substring(5,0).replace(':', '') + '00';
    }
    updateMinute(){
        let store = this;
        let varsCount = keys(this.variablesStore.state.combos).length;
        let rowHeight = this.state.screenHeight < 640 ? smallerRowHeight : smallColumnWidth;
        let displaySeparators = (!this.state.chartVisible || !this.state.isMobile);
        let separatorHeight = displaySeparators ? 40 : 0;
        // let currentRow = Math.floor(this.coordY / (rowHeight + separatorHeight));
        let currentMinuteIndex = Math.floor(
            this.coordY / (rowHeight * varsCount + separatorHeight)
        );
        // console.log('currentMinuteIndex',
        //     currentMinuteIndex,
        //     this.state.chartVisible,
        //     displaySeparators,
        //     separatorHeight
        // );
        let minute = this.rowsStore.state.headers[currentMinuteIndex] ?
                        this.minuteFromHeader(
                            this.rowsStore.state.headers[currentMinuteIndex][0]
                        ):
                        '';
        let oldestMinute = this.rowsStore.state.headers[this.rowsStore.state.headers.length - 1] ?
                        this.minuteFromHeader(this.rowsStore.state.headers[this.rowsStore.state.headers.length - 1][0]):
                        '';
        let newestMinute = this.rowsStore.state.headers[0] ?
                        this.minuteFromHeader(this.rowsStore.state.headers[0][0]):
                        '';
        // console.log(
        //     'minute', minute, 'oldestMinute', oldestMinute, 'newestMinute', newestMinute
        // );
        let newState = {
            minute: minute,
            oldestMinute: oldestMinute,
            newestMinute: newestMinute
        };

        // console.log('stop 10sec interval update');
        window.clearInterval(this.imageUpdateInterval);

        if (minute.substring(2, 4) === newestMinute.substring(2, 4) &&
            this.userStore.state.autoUpdate &&
            this.rowsStore.state.type === 'detailed'){
            // console.log('start 10sec interval update');
            this.imageUpdateInterval = window.setInterval(function(){
                let formatedMinute = store.state.minute.substring(0,2) + ':' +
                                store.state.minute.substring(2,4) + ':' +
                                store.state.minute.substring(4,6);
                let newMinute = moment(
                                    moment().format('YYYY-MM-DDT') +
                                    formatedMinute +
                                    '.000Z'
                                ).utc().add(10, 'seconds');
                // console.log('update image', newMinute.utc().format('HHmmss'));
                store.setState({
                    minute: newMinute.utc().format('HHmmss')
                });
            }, 10 * 1000);
        }
        store.setState(newState);

    }
    secondScrollUpdate(){
        // console.log('secondScrollUpdate ---');
        // console.log('secondScrollUpdate', this.secondCoordX);
        let tableheaders = document.getElementById('table-headers') || {},
            tableContents = document.getElementById('table-contents') || {};
        tableheaders.scrollLeft = this.secondCoordX;
        tableContents.scrollLeft = this.secondCoordX;
        this.secondTicking = false;
    }
    scrollUpdate(){
        let tableheaders = document.getElementById('table-headers'),
            rowheaders = document.getElementById('row-headers'),
            tableContents = document.getElementById('table-contents'),
            secondTableContents = document.getElementById('secondTableContents') || {},
            tableImages = document.getElementById('table-images'),
            columnBars = document.getElementById('column-bars') || {};

        if (!tableContents){
            return null;
        }

        let maxYScroll = (tableContents.scrollHeight -
                            tableContents.offsetHeight -
                            INFINITE_SCROLL_THRESHOLD ),
            // sliderX = sliderElement.offsetWidth * (1 - this.coordY / maxYScroll),
            scrollEnded = this.coordY >= maxYScroll,
            store = this;
        this.updateMinute();


        tableheaders.scrollLeft = this.coordX;
        secondTableContents.scrollLeft = this.coordX;
        rowheaders.scrollTop = this.coordY;
        if (tableImages) {
            tableImages.scrollLeft = this.coordX;
        }
        if (columnBars) {
            columnBars.scrollLeft = this.coordX;
        }

        // if (this.rowsStore.state.type === 'detailed') {
        //     store.sliderTableScroll(this.coordY / maxYScroll);
        // }
        // sliderHandleElement.style.webkitTransform =
        // sliderHandleElement.style.transform =
        //   'translate(' + sliderX + 'px, ' + '0px)';
        // sliderHandleElement.setAttribute('data-x', sliderX);


        let loadedRowsCount = store.rowsStore.state.data.length;
        if (this.rowsStore.state.type === 'detailed'){
            // while we dont have the slider, the detailed table has extra
            // "separator" rows that are added in render time
            // so we add those to the loadedRowsCount count
            let varsCount = keys(this.variablesStore.state.combos).length;
            loadedRowsCount += loadedRowsCount / varsCount;
        }

        if (scrollEnded &&
            !this.nextPageLoadSent &&
            !this.state.isLoading &&
            !this.state.isFakeLoading
        ) {
            let isNextPageLoaded = (store.state.lastVisibleRow < loadedRowsCount);
            if (!isNextPageLoaded){
                this.nextPageLoadSent = true;
                this.userActions.tableScrollEnded();
            }
            store.raiseVisibleRowsCount(isNextPageLoaded);
        }
        this.stopTicking();
    }
    scrollMainTable(){
        let tableContents = document.getElementById('table-contents');
        if (!tableContents){
            return null;
        }
        tableContents.scrollTop = this.coordY;
        this.stopTicking();
    }
    changeTableScroll(coord){
        this.coordX = coord.left;
        this.coordY = coord.top;
        if (!this.ticking && !this.secondTicking) {
            this.ticking = true;
            window.requestAnimationFrame(this.scrollUpdate);
        }
    }
    changeSecondTableScroll(coord){
        // console.log('changeSecondTableScroll', coord, this.secondTicking, this.secondScrollUpdate);
        this.secondCoordX = coord.left;
        this.secondCoordY = coord.top;
        if (!this.ticking && !this.secondTicking) {
            this.secondTicking = true;
            window.requestAnimationFrame(this.secondScrollUpdate);
        }
    }
    sliderTableScroll(percent){

        let tableContents = document.getElementById('table-contents');
        if (!tableContents){
            return null;
        }
        let maxYScroll = (
                tableContents.scrollHeight -
                tableContents.offsetHeight -
                INFINITE_SCROLL_THRESHOLD
            ),
        //     // variablesCount = keys(this.variablesStore.state.combos).length,
            newY = maxYScroll * percent;
        // // if (this.rowsStore.state.type === 'detailed'){
        // //     let pages = this.rowsStore.state.headers.length / variablesCount,
        // //         page = Math.ceil((1 - percent) * pages),
        // //         pageHeight = tableContents.offsetHeight - 1;
        // //     newY = Math.min(page * pageHeight, maxYScroll);
        // // }
        // tableContents.scrollTop = newY;
        if (!this.ticking) {
            this.coordY = newY;
            this.ticking = true;
            window.requestAnimationFrame(this.scrollMainTable.bind(this));
        }
        return false;
    }

    splitScreenMenuToggle(){
        this.setState({
            splitScreenMenuClosed: !this.state.splitScreenMenuClosed
        })
    }

    displaySecondTable(){
        this.setState({
            chartVisible: false,
            secondTableVisible: true,
            splitScreenMenuClosed: true
        });
    }

    rowTypeSwitched(){
        this.setState({
            splitScreenMenuClosed: true
        });
    }
}

export default UIStore;
