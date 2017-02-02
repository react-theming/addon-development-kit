import React from 'react';
import addons from '@kadira/storybook-addons';
import initStore from './store/store';
import { ENQ_ASK, ENQ_SEND } from './store/store';
import initComposer from './store/composer';
import { ADDON_ID, PANEL_ID, ADDON_TITLE } from './';


addons.register(ADDON_ID, (api) => {
    const addonStoreCompose = initStore();
    const PanelContainer = initComposer(addonStoreCompose);
    const getID = () => `pd${Math.round(Math.random() * 100)}`;
    const addonControl = {
                getControl: () => {},
                default: {
                    enabled: true,
                    initData: 'Addon panel',
                },
            };
    addons.addPanel(PANEL_ID, {
        title: ADDON_TITLE,
        render: () => (
          <PanelContainer
            api={api}
            addonControl={addonControl}
            initData="Panel"
            rootProps={{enquiry: ENQ_ASK, ID: getID()}}
          />),
    });
});

