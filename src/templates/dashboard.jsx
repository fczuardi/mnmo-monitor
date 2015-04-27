import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';
import DataTable from '../components/datatable';

export default (p) => {
    let marginLeft = 0,
        toggleButtonSpace = 50,
        borderWidth = 2,
        minWidth = window.innerWidth > 320 ? 300 : 270,
        maxWidth = window.innerWidth - toggleButtonSpace,
        panelsOpened = (p.ui.submenu !== null) ? 2 : 1,
        drawerWidth = panelsOpened * minWidth;
    if (! p.ui.menuClosed) {
        //if open menu don't fit the screen width, 
        //open just enough to display the last pannel
        if (drawerWidth > maxWidth) {
            marginLeft = maxWidth;
        } else {
            marginLeft = drawerWidth;
        }
    }
    return (
<div style={{
    height: '100%',
    marginLeft: marginLeft,
    transitionProperty: 'margin-left',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'ease',
    transitionDelay: '0s'
}}>
    <Menu {...p} />
    <div style={{float: 'left', paddingTop: 53, width: '100%'}}>
        <Header {...p} />
        <PanelRouter {...p} />
        <DataTable {...p} />
    </div>
</div>
    );
}
