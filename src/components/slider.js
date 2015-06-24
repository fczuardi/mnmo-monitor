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
    componentDidUpdate() {
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
                    y = 0,
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    limitedX = Math.max(0, Math.min(parent.offsetWidth, x));
                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                  'translate(' + limitedX + 'px, ' + y + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        });
    }
}

export default Slider;