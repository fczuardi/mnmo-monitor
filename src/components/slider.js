import interact from 'interact.js';
import {findDOMNode} from 'react';
import template from '../templates/slider.jsx';

class Slider {
    constructor() {
        this.interactable = {};
    }

    render() {
        return template(this.props);
    }
    componentDidMount() {
        let sliderElement = findDOMNode(this);
        let sliderHandleElement = document.getElementById('table-slider-handle');
        let x0 = sliderElement.offsetWidth;
        sliderHandleElement.style.webkitTransform =
        sliderHandleElement.style.transform =
          'translate(' + x0 + 'px, ' + '0px)';
        sliderHandleElement.setAttribute('data-x', x0);
    }
    componentDidUpdate() {
        let userActions = this.props.flux.getActions('user');
        let sliderElement = findDOMNode(this);
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
                target.setAttribute('data-x', x);
            }
        });
    }
}

export default Slider;