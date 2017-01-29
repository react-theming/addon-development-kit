import React from 'react';
import addons from '@kadira/storybook-addons';
import PanelContainer from './panel/container';
import { ADDON_ID, PANEL_ID, ADDON_TITLE } from './';


addons.register(ADDON_ID, (api) => {
//    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
        title: ADDON_TITLE,
        render: () => <PanelContainer panel={api} initData="Panel"/>,
    });
});

function DummyPanel() {
    return (
        <div>
            <p>This is Dummy Panel</p>
            <code>{'<PanelContainer channel={channel} api={api} />'}</code>
        </div>
    )
}
