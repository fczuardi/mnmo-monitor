import interact from 'interact.js';
import {findDOMNode} from 'react';
import template from '../templates/slider.jsx';
import tryRender from '../lib/trycomponent';
import keys from 'lodash/object/keys';
import moment from 'moment';

const rowHeight = 60;

class Slider {
    constructor() {
        this.interactable = {};
    }

    render() {
        return tryRender('slider', template, this.props);
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
        let userActions = this.props.flux.getActions('user');
        let tableContentElement = document.getElementById('table-contents');

        //the current minute is located at what percentage of the full (visible) table?
        //we use the scroll position to figure it out
        let tablePositionPercent = (
            (tableContentElement.scrollTop) /
            (tableContentElement.scrollHeight)
        );

        //the slider handle is located at what percentage of the full slider?
        //based on the table scroll position we calculate where the handler
        //should be considering that the slider follows a quadratic curve scale
        //which means that a change in the handler position at the right-hand side
        //of the slider has more precision, minutes than at the far
        //left side where the same distance means hours

        let sliderPositionPercent = Math.sqrt(tablePositionPercent);//exponential
        // let sliderPositionPercent = tablePositionPercent;//linear

        let percent = 1 - sliderPositionPercent;

        // console.log(tablePositionPercent, 'vs', sliderPositionPercent);

        let sliderElement = findDOMNode(this);
        let sliderHandleElement = document.getElementById('table-slider-handle');
        let sliderEnabledRegion = document.getElementById('slider-enabled-region');

        let sliderWidth = sliderEnabledRegion.offsetWidth;
        let tablePercentLimit = (tableContentElement.scrollHeight - tableContentElement.clientHeight) /  tableContentElement.scrollHeight;
        let sliderPercentLimit = Math.sqrt(tablePercentLimit);

        let unreachableSliderRegionWidth = sliderWidth * (1 - sliderPercentLimit);
        let xMin = 30 + unreachableSliderRegionWidth;
        let xMax = 30 + sliderWidth;
        let x0 = 30 + percent * (sliderWidth);
        sliderHandleElement.style.webkitTransform =
        sliderHandleElement.style.transform =
          'translate(' + x0 + 'px, ' + '0px)';
        sliderHandleElement.setAttribute('data-x', x0);
        sliderHandleElement.style.opacity = 1;

        interact('.handle', {context: sliderElement}).unset();
        this.interactable = interact('.handle', {
            context: sliderElement,
        })
        .draggable({
            max: Infinity,
            inertia: false,
            axis: 'x',
            onmove: function(event){
                var target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    limitedX = Math.max(xMin, Math.min(xMax, x)),
                    scrollPercent = 1 - ((limitedX - 30) / sliderWidth);

                // console.log('percent', scrollPercent, sliderPercentLimit,
                //                 limitedX, unreachableSliderRegionWidth, xMin
                // );

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                  'translate(' + limitedX + 'px, ' + '0px)';

                userActions.sliderScroll(Math.pow(scrollPercent, 2));//exponential
                // userActions.sliderScroll(scrollPercent);//linear

                // update the posiion attributes
                target.setAttribute('data-x', limitedX);
                this.isDragging = true;
            },
            onend: function(){
                this.isDragging = false;
            }
        });
        return false;
    }
}

export default Slider;
