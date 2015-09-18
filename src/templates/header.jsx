import React from 'react';
import Toolbar from 'mnmo-components/lib/themes/mnmo/toolbar';
import ToolbarButton from 'mnmo-components/lib/themes/mnmo/toolbarbutton';
import {groupTypeLabels} from '../../config/apiHelpers';

export default (p, a) => {
    let formatTime = (text) => (text.substring(0, 2) + ':' + text.substring(2, 4));
    let fontSize = p.ui.isMobile ? 14 : 'inherit';
    let left = (
        <div style={{float: 'left', fontSize: fontSize}}>
            <ToolbarButton
                type="menuToggle"
                onClick={a.menuToggleClicked}
            />
            <div
                style={{
                    display: 'inline',
                    position:'relative'
                }}
            >
            <ToolbarButton
                type={p.ui.isMobile ? null : 'dialogToggle'}
                onClick={a.groupsButtonClicked}
                closed={(p.ui.panel !== 'groups')}
            >
                {p.user.groupShortLabel || '…'}
            </ToolbarButton>
            <span
                style={{
                    color: '#c3980b',
                    fontSize: 8,
                    position: 'absolute',
                    right: 26,
                    bottom: -19,
                    fontWeight: 700,
                    letterSpacing: 1.5
                }}
            >
                {p.groups.selected ? groupTypeLabels[p.groups.selected.type] : ''}
            </span>
            </div>
        </div>
    );
    let center = (
        <div style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: '50%',
            width: '40%',
            marginLeft: '-20%',
            textAlign: 'center',
            lineHeight: '35px',
            height: 35,
            paddingTop: 8,
            fontSize: fontSize
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
    let chartButton = (
        <span style={{
            color: (p.ui.chartVisible) ? '#FFFFFF' : '#787878'
        }}>
            <ToolbarButton
                onClick={a.chartToggleClicked}
                className={(p.rows.type === 'detailed') ?
                                'header-icon-chart-line':
                                'header-icon-chart-bar'}

            />
        </span>
    );
    let autoUpdateStatus = (
        <span
            style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)',
                position: p.ui.isMobile ? 'absolute': 'relative',
                right: p.ui.isMobile ? 10: 'auto',
                top: p.ui.isMobile ? 60: 'auto',
            }}
        >
            {p.ui.isMobile ? '' : p.language.messages.settings.autoUpdateStatus}
            <span
                style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    backgroundColor: p.user.autoUpdate ? '#69df00' : 'rgba(255,255,255,0.5)',
                    display: 'inline-block',
                    marginLeft: 10
                }}
            >
            </span>
        </span>
    );
    let right = (
        <div style={{float: 'right', fontSize: fontSize}}>
            {chartButton}
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
            {autoUpdateStatus}
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
        right = (
            <div style={{float: 'right'}}>
                {chartButton}
            </div>
        );
    }
    return (
<Toolbar>
    {left}
    {center}
    {right}
</Toolbar>
    );
}
