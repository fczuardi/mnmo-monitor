import {Component} from 'react';
import template from '../templates/imagerow.jsx';

class ImageRow extends Component {
    render() {
        return template(this.props);
    }
}

export default ImageRow;