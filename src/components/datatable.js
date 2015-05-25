import {Component} from 'react';
import template from '../templates/datatable.jsx';
import {Scroller} from 'reapp-scroller';

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.state = {
            scroller: null,
            draggable: false,
            scrollTop: 0,
            scrollLeft: 0
        };
    }
    componentWillMount() {
        // const smallColumnWidth = 60;
        // const mediumColumnWidth = 106;
        // const mobileBreakpointWidth = 599;
        // let isMobile = (this.props.ui.screenWidth <= mobileBreakpointWidth);
        // let columnWidth = isMobile ? smallColumnWidth : mediumColumnWidth;
        // let headerHeight = smallColumnWidth;
        let scroller = new Scroller(this.scroll, {
                animating: false,
                bouncing: false,
                locking: false,
                // snapping: true,
                easing: 'linear'
            });
        this.setState({
            scroller: scroller
        });
        
    }
    handleTouchStart(e) {
        this.state.scroller.doTouchStart(e.touches, e.timeStamp);
        e.preventDefault();
    }
    handleTouchMove(e) {
        this.state.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
        e.preventDefault();
    }
    handleTouchEnd(e) {
        this.state.scroller.doTouchEnd(e.timeStamp);
        e.preventDefault();
    }
    scroll(left, top) {
        console.log(left, top);
        const smallColumnWidth = 60;
        const mediumColumnWidth = 106;
        const mobileBreakpointWidth = 599;
        let isMobile = (this.props.ui.screenWidth <= mobileBreakpointWidth);
        let columnWidth = isMobile ? smallColumnWidth : mediumColumnWidth;
        let headerHeight = smallColumnWidth;
        // let extraX = (left - this.state.scrollLeft) > 0 ? columnWidth/4 : -columnWidth/4;
        // let extraY = (top - this.state.scrollTop) > 0 ? headerHeight/4 : -headerHeight/4;
        // left += extraX;
        // top += extraY;
        left = Math.round((left) / columnWidth) * columnWidth;
        top = Math.round((top)/ headerHeight) * headerHeight;
        // this.state.scroller.scrollTo(left, top);
        if (left !== this.state.scrollLeft || top !== this.state.scrollTop){
            let newState = {
                scrollLeft: left,
                scrollTop: top
            };
            this.setState(newState);
        }
    }
    render() {
        const rowsActions = this.props.flux.getActions('rows');
        // const userActions = this.props.flux.getActions('user');
        const actions = {
            // draggableAreaScroll: (event) => this.scroll(
            //     event.target.scrollLeft, event.target.scrollTop
            // ),
            firstHeaderButtonClick: (event) => 
                rowsActions.rowsTypeSwitchClicked(
                    event.target.getAttribute('data-type')
                ),
            handleTouchStart: this.handleTouchStart,
            handleTouchMove: this.handleTouchMove,
            handleTouchEnd: this.handleTouchEnd
        };
        return template(this.props, actions, this.state, this.scrollState);
    }
}

export default DataTable;
