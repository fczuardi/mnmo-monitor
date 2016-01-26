import {Component} from 'react';
import template from '../templates/imagerow.jsx';
import tryRender from '../lib/trycomponent';

class ImageRow extends Component {
    render() {
        const actions = {
            subgroupPickerClicked: () => this.props.flux.getActions('user').openPanel('subgroups')
        };
        return tryRender('imagerow', template, this.props, actions);
    }
}

export default ImageRow;
