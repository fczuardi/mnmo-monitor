import React from 'react';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';

export default (p, a) =>
<div>
    <ol className="list-group">
        <List>
            <LI type="checkbox" id="onOffSomething">
                Menu item
            </LI>
        </List>
        <List>
            <LI type="radio" id="option1" name="someRadioGroup">Option 1</LI>
            <LI type="radio" id="option2" name="someRadioGroup">Option 2</LI>
            <LI type="radio" id="option3" name="someRadioGroup">Option 3</LI>
        </List>
        <List>
            <LI type="link" href="#">Menu item</LI>
            <LI type="link" href="#">Menu item</LI>
        </List>
        <List>
            <LI type="link" href="#">Menu item</LI>
            <LI type="link" href="#">Menu item</LI>
        </List>
        <List>
            <LI type="link" href="#">Menu item</LI>
            <LI type="link" onClick={a.logoutClick}>Logout</LI>
        </List>
    </ol>
</div>;
