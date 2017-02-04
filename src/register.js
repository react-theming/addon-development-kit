import React from 'react';
import addons from '@kadira/storybook-addons';
import initStore, { ENQ_ASK } from './store/store';
import initComposer from './store/composer';
import { ADDON_ID, PANEL_ID, ADDON_TITLE } from './';

export default function (initData = 'Panel') {
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
    //        render: initComposer(addonStoreCompose, {
    //            api,
    //            addonControl,
    //            rootProps: { enquiry: ENQ_ASK, ID: getID() },
    //            initData: "Panel",
    //        }),
            render: () => (
              <PanelContainer
                api={api}
                addonControl={addonControl}
                initData={initData}
                rootProps={{ enquiry: ENQ_ASK, ID: getID() }}
              />),
        });
    });
}
