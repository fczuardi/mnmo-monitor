import React from 'react';

export default (p, a) =>
<div>
    <p>Logado!</p>
    <button 
        style={({color: '#000'})}
        onClick={a.logoutClick}
    >
        Logout
    </button>
</div>;
