import interact from 'interact.js';
import {findDOMNode} from 'react';
import template from '../templates/slider.jsx';
import keys from 'lodash/object/keys';
import moment from 'moment';

const rowHeight = 60;

class Slider {
    constructor() {
        this.interactable = {};
    }

    render() {
        return template(this.props);
    }

    percentFromMinute(date, begin, end, total, current, linesPerMinute){
        begin = begin + ':00.000';
        end = end + ':00.000';
        current = current + ':00.000';

        let beginDate = moment(date + 'T' + begin + 'Z').utc();
        let endDate = moment(date + 'T' + end + 'Z').utc();
        let currentDate = moment(date + 'T' + current + 'Z').utc();
        if (currentDate.valueOf() < beginDate.valueOf()){
            currentDate.add(1, 'days');
        }
        if (endDate.valueOf() < beginDate.valueOf()){
            endDate.add(1, 'days');
        }
        let lastRowMinute = endDate.subtract(total/linesPerMinute, 'minutes');
        console.log(
            'diff (percentFromMinute)', 
            currentDate.diff(lastRowMinute, 'minutes'), 
            linesPerMinute, total
        );
        return currentDate.diff(lastRowMinute, 'minutes') * linesPerMinute / total;
    }

    formatTime(text){
        return (text.substring(0, 2) + ':' + text.substring(2, 4));
    }

    componentDidUpdate() {
        // console.log('componentDidUpdate slider');
        if (this.interactable.isDragging === true){
            return;
        }
        // let userActions = this.props.flux.getActions('user');
        let tableContentElement = document.getElementById('table-contents');

        //the current minute is located at what percentage of the full table?
        //we use the scroll position to figure it out
        let tablePositionPercent = (
            tableContentElement.scrollTop / 
            (tableContentElement.scrollHeight - tableContentElement.clientHeight)
        );
        
        //the slider handle is located at what percentage of the full slider?
        //based on the table scroll position we calculate where the handler
        //should be considering that the slider follows a sin curve scale
        //which means that a change in the handler position at the right-hand side
        //of the slider has more precision, minutes than at the far
        //left side where the same distance means hours
        let sliderPositionPercent = Math.sin(tablePositionPercent * Math.PI/2);
        
        let percent = 1 - sliderPositionPercent;
        
        // console.log(tablePositionPercent, 'vs', sliderPositionPercent);
        
        let sliderElement = findDOMNode(this);
        let sliderHandleElement = document.getElementById('table-slider-handle');
        let sliderEnabledRegion = document.getElementById('slider-enabled-region');
        // let rowsPerPage = Math.ceil(tableContentElement.offsetHeight / rowHeight);


        // let percent = Math.min(1, this.percentFromMinute(
        //     this.props.rows.date,
        //     this.formatTime(this.props.ui.oldestMinute),
        //     this.formatTime(this.props.ui.newestMinute),
        //     this.props.ui.lastVisibleRow - rowsPerPage,
        //     this.formatTime(this.props.ui.minute),
        //     keys(this.props.vars.combos).length
        // ));

        sliderEnabledRegion.style.width = '100%';
        let x0 = percent * sliderElement.offsetWidth;
        sliderHandleElement.style.webkitTransform =
        sliderHandleElement.style.transform =
          'translate(' + x0 + 'px, ' + '0px)';
        sliderHandleElement.setAttribute('data-x', x0);
        interact('.handle', {context: sliderElement}).unset();
        return false;
        // this.interactable = interact('.handle', {
        //     context: sliderElement,
        // })
        // .draggable({
        //     max: Infinity,
        //     inertia: false,
        //     autoScroll: true,
        //     restrict: {
        //         restriction: "parent",
        //         endOnly: true
        //     },
        //     axis: 'x',
        //     onmove: function(event){
        //         var target = event.target,
        //             parent = target.parentNode,
        //             // keep the dragged position in the data-x/data-y attributes
        //             x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        //             limitedX = Math.max(0, Math.min(parent.offsetWidth, x));
        //         // translate the element
        //         target.style.webkitTransform =
        //         target.style.transform =
        //           'translate(' + limitedX + 'px, ' + '0px)';
        //         userActions.sliderScroll(limitedX / parent.offsetWidth);
        //         // update the posiion attributes
        //         target.setAttribute('data-x', limitedX);
        //         this.isDragging = true;
        //     },
        //     onend: function(){
        //         this.isDragging = false;
        //     }
        // });
    }
}

export default Slider;