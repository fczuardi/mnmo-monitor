import {Store} from 'flummox';
import keys from 'lodash/object/keys';
import moment from 'moment';

const INFINITE_SCROLL_THRESHOLD = 0;
const ROWS_PAGE_SIZE = 32;

const mobileBreakpointWidth = 599;
const landscapeBreakpointHeight = 320;
const detailShortHeight = 560;
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
        this.register(sessionActions.refreshDataLoaded, this.overrideDefaults);
        this.register(sessionActions.tokenGranted, this.showSplash);
        this.register(userActions.preferencesFetched, this.hideSplash);
        this.register(rowsActions.rowsFetchCompleted, this.rowsFetchCompleted);
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
        this.register(userActions.monthUpdated, this.updateSelectedMonth);
        this.register(sessionActions.tokenGranted, this.resetError);
        this.register(columnsActions.columnHeaderSelected, this.resetMenuState);
        this.register(columnsActions.colorSwitchToggle, this.toggleColorSwitch);
        this.userActions = userActions;
        this.state = {
            // first digit is cosmetic, don't mean nothing,
            // the next 3 follows semver (major.minor.patch) http://semver.org/
            // browserify transform browserify-versionify replaces the placeholder with proper version from package.json
            version: 'v3.__VERSION__',
            menuClosed: true,
            submenu: null,
            openColorSwitch: null,
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
            hasShortHeight: false,
            hasShortHeightDetail: false,
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
            canDragSlide: true,
            selectedMonth: null,
            secondarySelectedMonth: null
        };
        this.ticking = false;
        this.secondTicking = false;
        this.nextPageLoadSent = true;
        this.coordX = 0;
        this.coordY = 0;
        this.secondCoordX = 0;
        this.secondCoordY = 0;
        this.scrollEndInterval = 0;
        this.imageUpdateInterval = undefined;

        if (window.addEventListener) {
            window.addEventListener('resize', this.widthChange.bind(this));
            // window.addEventListener('error', this.unhandledJavascriptError.bind(this));
        }else{
            window.attachEvent('onresize', this.widthChange.bind(this));
            // window.attachEvent('onerror', this.unhandledJavascriptError.bind(this));
        }
        this.scrollUpdate = this.scrollUpdate.bind(this);
        this.secondScrollUpdate = this.secondScrollUpdate.bind(this);
        this.addListener('change', this.stopTicking);
        this.rowStateChanged = this.rowStateChanged.bind(this);
        this.sliderTableScroll = this.sliderTableScroll.bind(this);
        this.rowsStore.addListener('change', this.rowStateChanged);
        this.previousLoadingState = this.rowsStore.state.loading;
        this.previousNewestMinute = '';
        window.setTimeout(this.widthChange.bind(this), 1);
    }

    overrideDefaults(refreshData){
        // console.log('overrideDefaults ui', refreshData);
        if (!refreshData){
            return null
        }
        this.setState({
            chartVisible: refreshData.ui.chartVisible === undefined ? true :
                                                    refreshData.ui.chartVisible,
            secondTableVisible: refreshData.ui.secondTableVisible === undefined ?
                                        false : refreshData.ui.secondTableVisible
        });
        // console.log('overrideDefaults ui new state:', this.state);
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

    rowsFetchCompleted(){
        // console.log('__ this.rowsStore.state.headers.length', this.rowsStore.state.headers.length);
        // console.log('rowsFetchCompleted', this.state.newestMinute, this.previousNewestMinute, this.state.newestMinute > this.previousNewestMinute);
        let rowHeight = (this.state.screenHeight < 640) ?
                                        smallerRowHeight : smallColumnWidth;
        let secondRowMinute = this.rowsStore.state.headers.length > 1 ?
                    this.minuteFromHeader(this.rowsStore.state.headers[1][0]) :
                    this.state.newestMinute;
        let currentMinute = this.rowsStore.state.type !== 'merged' ?
                                    this.state.newestMinute : secondRowMinute;
        let rowsHaveShifted = currentMinute > this.previousNewestMinute;
        let positionPastFirstRow = this.coordY > rowHeight * 0.6;
        if (
            (rowsHaveShifted) && // "first" row changed
            (positionPastFirstRow) // and user have scrolled past half of first row
        ){
            // then auto scroll one row down so the user don't lose the place of
            // the row she was interested in at the current scroll position
            // see bug #128
            this.coordY += rowHeight;
            this.scrollUpdate();
            this.scrollMainTable();
        }
        // console.log('__ __ this.state.newestMinute', this.state.newestMinute, secondRowMinute, currentMinute);
        this.previousNewestMinute = currentMinute;
        this.hideSplash();
    }
    unhandledJavascriptError(e){
        console.log('unhandledJavascriptError',
            e.message,
            e.filename,
            e.lineno);
        this.displayError({
            error: [e.message, e.filename, e.lineno].join(', '),
            tryAgainAction: null,
            warning: null
        })
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
    changePanel(params) {
        let name = (
                        (params === null) ||
                        (this.state.panel === params.name && !params.isVisible)
                    ) ? null : params.name;
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
    toggleColorSwitch(index) {
        const nextValue = this.state.openColorSwitch === index
            ? null
            : index;
        this.setState({ openColorSwitch: nextValue });
    }
    resetMenuState() {
        this.setState({
            menuClosed: true,
            submenu: null,
            panel: null
        });
    }
    widthChange() {
        //on the login screen, opening a virtual keyboard on chrome on iOS
        //triggers a window resize that might change the layout and
        //make the virtual keyboard close again
        //see bug #166
        if (
            document.activeElement &&
            document.activeElement.nodeName &&
            document.activeElement.nodeName.toUpperCase() === 'INPUT' &&
            this.state.screen === null //only on the login screen
        ){
            return null
        }
        this.setState({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            hasShortHeight: (window.innerHeight <= landscapeBreakpointHeight),
            hasShortHeightDetail: (window.innerHeight < detailShortHeight),
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
        // reset the artificial pagination limit for performance reasons
        // this.setState({
        //     lastVisibleRow: ROWS_PAGE_SIZE
        // });
    }
    minuteFromHeader(text){
        return text.substring(5,0).replace(':', '') + '00';
    }
    updateMinute(){
        let store = this;
        let rowHeight = this.state.screenHeight < 640 ? smallerRowHeight : smallColumnWidth;
        rowHeight += 1;
        // let displaySeparators = (!this.state.chartVisible || !this.state.isMobile);
        let displaySeparators = true;
        let separatorHeight = displaySeparators ? 40 : 0;
        separatorHeight += 1;
        // let currentRow = Math.floor(this.coordY / (rowHeight + separatorHeight));
        let currentMinuteIndex = Math.floor(this.coordY / rowHeight);
        // console.log('currentMinuteIndex',
        //     currentMinuteIndex,
        //     this.state.chartVisible,
        //     displaySeparators,
        //     separatorHeight,
        //     rowHeight
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
        if (
            minute.substring(0,4) === store.state.minute.substring(0,4) &&
            this.imageUpdateInterval !== undefined
        ){
            // console.log('same minute. exit', this.imageUpdateInterval);
            return null;
        }
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
            let intervalSize = 10; //10 seconds
            this.imageUpdateInterval = window.setInterval(function(){
                let formatedMinute = store.state.minute.substring(0,2) + ':' +
                                store.state.minute.substring(2,4) + ':' +
                                store.state.minute.substring(4,6);
                let newMinute = moment(
                                    moment().format('YYYY-MM-DDT') +
                                    formatedMinute +
                                    '.000Z'
                                ).utc().add(intervalSize, 'seconds');
                // console.log('update image', newMinute.utc().format('HHmmss'));
                store.setState({
                    minute: newMinute.utc().format('HHmmss')
                });
            }, (intervalSize - 1) * 1000);
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

        let loadedRowsCount = store.rowsStore.state.data.length;

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
        let maxYScroll = tableContents.scrollHeight,
            newY = maxYScroll * percent;
        if (!this.ticking) {
            this.coordY = newY;
            this.ticking = true;
            window.requestAnimationFrame(this.scrollMainTable.bind(this));
            window.requestAnimationFrame(this.scrollUpdate);
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

    updateSelectedMonth(dayString){
        this.setState({
            selectedMonth: dayString
        });
    }
}

export default UIStore;
