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
        <select>
            <option>A</option>
            <option>B</option>
            <option>C</option>
        </select>
    </div>
    <div>
        <label>{p.language.messages.vars.input2}</label>
        <select>
            <option>A</option>
            <option>B</option>
            <option>C</option>
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
