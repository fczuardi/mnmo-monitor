import {findDOMNode} from 'react';
import template from '../templates/enabledcolumns.jsx';
import interact from 'interact.js';
import pluck from 'lodash/collection/pluck';


class EnabledColumns {
    constructor() {
        this.interactable = {};
    }
    
    render() {
        return template(this.props, this.props.actions);
    }
    
    componentDidMount() {
        this.componentDidUpdate();
    }
    shouldComponentUpdate(nextProps) {
        return ( pluck(nextProps.items, 'id').join(',') !== 
                            pluck(this.props.items, 'id').join(','));
    }
    componentDidUpdate() {
        let listElement = findDOMNode(this);
        let component = this;
        // console.log('enabled columns did update');
        interact('li', {context: listElement}).unset();
        
        if (!this.props.editing){
            return false;
        }
    
        this.interactable = interact('.handle', {
            context: listElement,
        })
        .draggable({
            max: Infinity,
            inertia: true,
            autoScroll: true,
            restrict: {
                restriction: "parent",
                endOnly: true
            },
            axis: 'y',
            onstart: function(event){
                var target = event.target.parentNode;
                target.setAttribute('data-topBorder', target.style.borderTop);
            },
            onmove: function(event){
                var target = event.target.parentNode,
                    // keep the dragged position in the data-x/data-y attributes
                    x = 0,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                  'translate(' + x + 'px, ' + y + 'px)';
                target.style.backgroundColor = '#fff';
                target.style.opacity = '0.5';
                target.style.zIndex = '2';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            onend: function(event){
                var target = event.target.parentNode;
                target.style.zIndex = '0';
                target.style.opacity = '1';
                target.style.backgroundColor = 'transparent';
            }
            
        })
        .dropzone({
            accept: '.handle',
            overlap: 0.1,
            ondragenter: function (event) {
                var draggableElement = event.relatedTarget.parentNode,
                    dropzoneElement = event.target.parentNode,
                    draggableIndex = draggableElement.getAttribute('data-index'),
                    dropzoneIndex = dropzoneElement.getAttribute('data-index');
                if(draggableIndex < dropzoneIndex){
                    dropzoneElement.style.borderBottom = '2px solid #0D99DB';
                    dropzoneElement.style.borderTop = draggableElement.getAttribute('data-topBorder');
                } else {
                    dropzoneElement.style.borderTop = '2px solid #0D99DB';
                    dropzoneElement.style.borderBottom = '0px';
                }
            },
            ondragleave: function(event) {
                var draggableElement = event.relatedTarget.parentNode,
                    dropzoneElement = event.target.parentNode;
                dropzoneElement.style.borderBottom = '0px';
                dropzoneElement.style.borderTop = draggableElement.getAttribute('data-topBorder');
            },
            ondropdeactivate: function(event) {
                var draggableElement = event.relatedTarget.parentNode,
                    dropzoneElement = event.target.parentNode;
                dropzoneElement.style.borderBottom = '0px';
                dropzoneElement.style.borderTop = draggableElement.getAttribute('data-topBorder');
            },
            ondrop: function (event) {
                var draggableElement = event.relatedTarget.parentNode,
                    dropzoneElement = event.target.parentNode,
                    draggableIndex = draggableElement.getAttribute('data-index'),
                    dropzoneIndex = dropzoneElement.getAttribute('data-index');
                component.props.actions.columnMove(draggableIndex, dropzoneIndex);
                draggableElement.style.webkitTransform =
                draggableElement.style.transform =
                  'translate(0px, 0px)';
                draggableElement.setAttribute('data-x', 0);
                draggableElement.setAttribute('data-y', 0);                
            }
    });
    }
}

export default EnabledColumns;
