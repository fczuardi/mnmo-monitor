import {Component} from 'react';
import template from '../templates/imagerow.jsx';

class ImageRow extends Component {
    render() {
        const actions = {
            subgroupPickerClicked: () => this.props.flux.getActions('user').openPanel('subgroups')
        };
        return template(this.props, actions);
    }
}

export default ImageRow;