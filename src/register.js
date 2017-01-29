import React from 'react';
import addons from '@kadira/storybook-addons';
import initComposer from './panel/composer';
import { ADDON_ID, PANEL_ID, ADDON_TITLE } from './';


addons.register(ADDON_ID, (api) => {
    const PanelContainer = initComposer();
    const getID = () => `pd${Math.round(Math.random() * 100)}`;
    addons.addPanel(PANEL_ID, {
        title: ADDON_TITLE,
        render: () => <PanelContainer api={api} initData="Panel" ID={getID()} />,
    });
});

