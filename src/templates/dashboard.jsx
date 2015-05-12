import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';
import DataTable from '../components/datatable';

export default (p, a) => {
    let marginLeft = 0,
        toggleButtonSpace = 50,
        borderWidth = 2,
        minWidth = p.ui.screenWidth > 320 ? 300 : 270,
        maxWidth = p.ui.screenWidth - toggleButtonSpace,
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
    // let subgroupsButton = (p.groups.selected &&
    //                         p.groups.selected.subgroupsCount > 0) ? (
    //     <button
    //         style={{
    //             background: 'none',
    //         }}
    //         onClick={a.subgroupsButtonClicked}
    //     >
    //         Subgroups
    //     </button>
    //                         ) : null;
    let dashboardStyle = {
        height: '100%',
        marginLeft: marginLeft
    };
    return (
<div style={dashboardStyle}>
    <Menu {...p} />
    <div style={{float: 'left', paddingTop: 53, width: '100%'}}>
        <Header {...p} />
        <PanelRouter {...p} />
        <DataTable {...p} />
    </div>
</div>
    );
}
