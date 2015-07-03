import React from 'react';
import Toolbar from 'mnmo-components/lib/themes/mnmo/toolbar';
import ToolbarButton from 'mnmo-components/lib/themes/mnmo/toolbarbutton';

export default (p, a) => {
    let formatTime = (text) => (text.substring(0, 2) + ':' + text.substring(2, 4));
    let left = (
        <div style={{float: 'left'}}>
            <ToolbarButton
                type="menuToggle"
                onClick={a.menuToggleClicked}
            />
            <ToolbarButton
                type={p.ui.isMobile ? null : 'dialogToggle'}
                onClick={a.groupsButtonClicked}
                closed={(p.ui.panel !== 'groups')}
            >
                {p.user.groupShortLabel || '…'}
            </ToolbarButton>
        </div>
    );
    let center = (
        <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '40%',
            marginLeft: '-20%',
            textAlign: 'center',
            lineHeight: '35px',
            height: 35,
            paddingTop: 8
        }}>
            <ToolbarButton
                type={p.ui.isMobile ? null : 'dialogToggle'}
                onClick={a.rowsButtonClicked}
                disabled={(p.user.autoUpdate && p.rows.type === 'list') || (p.rows.type === 'detailed')}
                closed={(p.ui.panel !== 'rows')}
            >
                {p.rows.type !== 'detailed' ? p.rows.menuLabel : formatTime(p.ui.minute)}
            </ToolbarButton>
        </div>
    );
    let right = (
        <div style={{float: 'right'}}>
            <ToolbarButton
                type={p.ui.isMobile ? null : 'dialogToggle'}
                disabled={(p.groups.selected && p.groups.selected.classes.length < 2 )}
                onClick={a.classButtonClicked}
                closed={(p.ui.panel !== 'classes')}
                className={(p.user.classID !== null) ? 
                                ('header-icon-' + p.user.classID) : ''}
            />
            <ToolbarButton
                type={p.ui.isMobile ? null : 'dialogToggle'}
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
    );
    let backButton = (
        <div style={{float: 'left'}}>
            <ToolbarButton
                onClick={a.backButtonClicked}
            >
                <span
                    data-icon="f"
                    style={{
                        display: 'block',
                        float: 'left',
                        color: '##767677',
                        marginRight: 5
                    }}
                ></span>
                {p.language.messages.settings.back}
            </ToolbarButton>
        </div>
    );
    if (p.rows.type === 'detailed') {
        left = backButton;
        right = null;
    }
    return (
<Toolbar>
    {left}
    {center}
    {right}
</Toolbar>
    );
}
