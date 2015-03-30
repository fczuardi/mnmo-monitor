import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Switch from 'mnmo-components/lib/themes/mnmo/switch';

export default (p, a) =>
<div style={{height: '100%'}}>
    <Drawer>
        <List>
            <LI>
                <Switch 
                    id="autoUpdateToggle" 
                    onChange={a.autoUpdateChange}
                    styles={{outerDiv: {float: 'right'}}}
                >
                    Auto update
                </Switch>
            </LI>
        </List>
        <List>
            <LI>
                Menu item
            </LI>
            <LI>
                <button onClick={a.logoutClick}>
                    Logout
                </button>
            </LI>
        </List>
    </Drawer>
</div>;
