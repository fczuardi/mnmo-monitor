import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Switch from 'mnmo-components/lib/themes/mnmo/switch';
import Radio from 'mnmo-components/lib/themes/mnmo/radio';
import A from 'mnmo-components/lib/themes/mnmo/a';
import extraLinks from '../../config/menulinks';
import SubmenuRouter from '../components/submenurouter';

export default (p, a) => {
    extraLinks[0][0].link = p.user.tosURL;
    return (
<div style={{
    display: p.ui.menuClosed ? 'none' : 'block',
    position: 'absolute',
    zIndex: 2
}}>
<Drawer 
    container={true} 
    panelsOpened={p.panelsOpened}>
    <div style={{display: (p.ui.submenu !== null) ? 'none' : 'block'}}>
    <Drawer>
        <List bottomSpace={true}>
            <LI>
                <Switch 
                    id="autoUpdateToggle" 
                    onChange={a.autoUpdateChange}
                    isItem={true}
                    checked={p.user.autoUpdate}
                >
                    {p.language.messages.settings.autoUpdate}
                </Switch>
            </LI>
        </List>
        <List bottomSpace={true}>
        {p.language.list.map( (language, key) => (
            <LI key={key}>
                <Radio 
                    name="settings-language"
                    id={'settings-language-' + key}
                    value={language.id}
                    checked={(language.id == p.user.languageID)}
                    isItem={true}
                    onChange={a.languageSettingChange}
                >
                    {language.label}
                </Radio>
            </LI>
        ))}
        </List>
        <List bottomSpace={true}>
            <LI>
                <A type="panel" href="#" onClick={a.openColumnsSelection}>
                    {p.language.messages.settings.columns}
                </A>
            </LI>
        </List>
    {extraLinks.map( (group, key) =>
        <List key={key} bottomSpace={true}>
        {group.map( (item, key) =>
            <LI key={key}>
                <A href={item.link}>
                    {item.label}
                </A>
            </LI>
        )}
        </List>
    )}
        <List>
            <LI>
                <A href='http://example.com'>
                    {p.language.messages.settings.changePassword}
                </A>
            </LI>
            <LI>
                <A href='#' onClick={a.logoutClick}>
                    {p.language.messages.settings.logout}
                </A>
            </LI>
        </List>
    </Drawer>
    </div>
    <SubmenuRouter {...p} />
</Drawer>
</div>
    );
};
