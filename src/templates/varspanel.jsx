import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import Switch from 'mnmo-components/lib/themes/mnmo/switch';

export default (p, a) =>
<div style={{
    position: 'absolute',
    paddingTop: 53,
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
    right: 0
}}>
<Drawer
    title={p.language.messages.vars.title}
    closeLabel={p.language.messages.settings.close}
    onCloseClick={a.closePanel}
>
<div>
    <div>
        <label>{p.language.messages.vars.input1}</label>
        <select 
            onChange={a.firstVarChange}
            value={p.user.primaryVarLabel}
        >
        {p.vars.primary.map( (variable, key) => (
            <option 
                key={key} 
                value={variable}
            >{variable}</option>
        ))}
        </select>
    </div>
    <div>
        <label>{p.language.messages.vars.input2}</label>
        <select
            onChange={a.secondVarChange}
            value={p.user.secondaryVarLabel}
        >
        {p.vars.secondary.map( (variable, key) => (
            <option 
                key={key} 
                value={variable}
            >{variable}</option>
        ))}
        </select>
    </div>
</div>
<div>
    <Switch 
        id="displaySecondaryVarToggle" 
        onChange={a.displaySecondaryVarChange}
        isItem={true}
        checked={p.user.compareVariables}
    >
        {p.language.messages.vars.displaySecondary}
    </Switch>
</div>
</Drawer>
</div>;
