import React from 'react';
import Toolbar from 'mnmo-components/lib/themes/mnmo/toolbar';
import ToolbarButton from 'mnmo-components/lib/themes/mnmo/toolbarbutton';

export default (p, a) =>
<Toolbar>
    <ToolbarButton
        type="menuToggle"
        onClick={a.menuToggleClicked}
    />
    <button 
        style={{background: 'none', border: 0}}
        onClick={a.groupsButtonClicked}
    >
        {p.user.groupShortLabel}
    </button>
    <button 
        style={{background: 'none', border: 0, float: 'right'}}
        onClick={a.varsButtonClicked}
    >
        {p.user.primaryVarLabel}
        <span style={{
            opacity: 0.5
        }}>
            {(p.user.secondaryVarLabel !== '-') ? ' | ' : null}
        </span>
        {((p.user.secondaryVarLabel !== '-') ? p.user.secondaryVarLabel : null)}
    </button>
</Toolbar>;
