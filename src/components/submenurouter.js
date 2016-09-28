import {createElement} from 'react';
import ColumnsSubmenu from '../components/submenucolumns';
import PrintSubmenu from '../components/submenuprint';

class SubmenuRouter {
    render() {
        const component = (this.props.ui.submenu === 'columns')
            ? createElement(ColumnsSubmenu, this.props)
            : (this.props.ui.submenu === 'print')
                ? createElement(PrintSubmenu, this.props)
                : null;
        return component;
    }
}

export default SubmenuRouter;
