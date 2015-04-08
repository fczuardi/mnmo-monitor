import React from 'react';
import Toolbar from 'mnmo-components/lib/themes/mnmo/toolbar';

export default (p, a) =>
<Toolbar>
    <button
        data-icon="a"
        onClick={a.menuToggleClicked}
    >
        Menu
    </button>
</Toolbar>;
