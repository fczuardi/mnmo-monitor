import {createElement} from 'react';
import ColumnsSubmenu from '../components/submenucolumns';

class SubmenuRouter {
    render() {
        const component = (this.props.ui.submenu === 'columns') ?
            createElement(ColumnsSubmenu, this.props) : null;
        return component;
    }
}

export default SubmenuRouter;
