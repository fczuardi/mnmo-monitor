import React from 'react';
import Toolbar from 'mnmo-components/lib/themes/mnmo/toolbar';
import ToolbarButton from 'mnmo-components/lib/themes/mnmo/toolbarbutton';

export default (p, a) =>
<Toolbar>
    <ToolbarButton
        type="menuToggle"
        onClick={a.menuToggleClicked}
    />
</Toolbar>;
