import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';
import PanelRouter from '../components/panelrouter';

export default (p) =>
<div style={{height: '100%'}}>
    <Menu {...p} />
    <div style={{float: 'left'}}>
        <Header {...p} />
        <PanelRouter {...p} />
    </div>
</div>;
