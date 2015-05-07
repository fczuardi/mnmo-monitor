import React from 'react';
import Toolbar from 'mnmo-components/lib/themes/mnmo/toolbar';
import ToolbarButton from 'mnmo-components/lib/themes/mnmo/toolbarbutton';

export default (p, a) =>
<Toolbar>
    <ToolbarButton
        type="menuToggle"
        onClick={a.menuToggleClicked}
    />
    <ToolbarButton
        type="dialogToggle"
        onClick={a.groupsButtonClicked}
        closed={(p.ui.panel !== 'groups')}
    >
        {p.user.groupShortLabel || '…'}
    </ToolbarButton>
    <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '40%',
        marginLeft: '-20%',
        textAlign: 'center',
        lineHeight: '35px',
        paddingTop: 8
    }}>
        <ToolbarButton
            type="dialogToggle"
            onClick={a.rowsButtonClicked}
            disabled={(p.user.autoUpdate && p.rows.type === 'list' )}
            closed={(p.ui.panel !== 'rows')}
        >
            {p.rows.menuLabel}
        </ToolbarButton>
    </div>
    <div style={{float: 'right'}}>
        <ToolbarButton
            type="dialogToggle"
            disabled={(p.groups.selected && p.groups.selected.classes.length < 2 )}
            onClick={a.classButtonClicked}
            closed={(p.ui.panel !== 'classes')}
            className={(p.user.classID !== null) ? 
                            ('header-icon-' + p.user.classID) : ''}
        />
        <ToolbarButton
            type="dialogToggle"
            onClick={a.varsButtonClicked}
            closed={(p.ui.panel !== 'vars')}
        >
            {p.user.primaryVarLabel}
            <span style={{
                opacity: 0.5
            }}>
                {(p.user.secondaryVarLabel !== '-') ? ' | ' : null}
            </span>
            {((p.user.secondaryVarLabel !== '-') ? p.user.secondaryVarLabel : null)}
        </ToolbarButton>
    </div>
</Toolbar>;
