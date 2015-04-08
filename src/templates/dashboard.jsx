import React from 'react';
import Menu from '../components/menu';
import Header from '../components/header';

export default (p) =>
<div style={{height: '100%'}}>
    <Menu {...p} />
    <div style={{float: 'left'}}>
        <Header {...p} />
    </div>
</div>;
