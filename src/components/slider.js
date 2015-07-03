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
        let beginDate = moment(date + ' ' + begin).utc();
        let endDate = moment(date + ' ' + end).utc();
        let currentDate = moment(date + ' ' + current).utc();
        if (currentDate.valueOf() < beginDate.valueOf()){
            currentDate.add(1, 'days');
        }
        if (endDate.valueOf() < beginDate.valueOf()){
            endDate.add(1, 'days');
        }
        let lastRowMinute = endDate.subtract(total/linesPerMinute, 'minutes');
        console.log(
            'percentFromMinute', 
            currentDate.diff(lastRowMinute, 'minutes'), 
            linesPerMinute, total
        );
        return currentDate.diff(lastRowMinute, 'minutes') * linesPerMinute / total;
    }

    formatTime(text){
        return (text.substring(0, 2) + ':' + text.substring(2, 4));
    }

    componentDidUpdate() {
        if (this.interactable.isDragging === true){
            return;
        }
        let userActions = this.props.flux.getActions('user');
        let sliderElement = findDOMNode(this);
        let tableContentElement = document.getElementById('table-contents');
        let sliderHandleElement = document.getElementById('table-slider-handle');
        let sliderEnabledRegion = document.getElementById('slider-enabled-region');
        let rowsPerPage = Math.ceil(tableContentElement.offsetHeight / rowHeight);
        let percent = Math.min(1, this.percentFromMinute(
            this.props.rows.date,
            this.formatTime(this.props.ui.oldestMinute),
            this.formatTime(this.props.ui.newestMinute),
            this.props.ui.lastVisibleRow - rowsPerPage,
            this.formatTime(this.props.ui.minute),
            keys(this.props.vars.combos).length
        ));
        sliderEnabledRegion.style.width = '100%';
        let x0 = percent * sliderElement.offsetWidth;
        sliderHandleElement.style.webkitTransform =
        sliderHandleElement.style.transform =
          'translate(' + x0 + 'px, ' + '0px)';
        sliderHandleElement.setAttribute('data-x', x0);
        interact('.handle', {context: sliderElement}).unset();
        this.interactable = interact('.handle', {
            context: sliderElement,
        })
        .draggable({
            max: Infinity,
            inertia: false,
            autoScroll: true,
            restrict: {
                restriction: "parent",
                endOnly: true
            },
            axis: 'x',
            onmove: function(event){
                var target = event.target,
                    parent = target.parentNode,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    limitedX = Math.max(0, Math.min(parent.offsetWidth, x));
                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                  'translate(' + limitedX + 'px, ' + '0px)';
                userActions.sliderScroll(limitedX / parent.offsetWidth);
                // update the posiion attributes
                target.setAttribute('data-x', limitedX);
                this.isDragging = true;
            },
            onend: function(){
                this.isDragging = false;
            }
        });
    }
}

export default Slider;