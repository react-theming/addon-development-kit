import React from 'react';
import addons from '@kadira/storybook-addons';
import initStore, { ENQ_ASK } from './store/store';
import initComposer from './store/composer';
import { ADDON_ID, PANEL_ID, ADDON_TITLE, CSS_CLASS } from './';

//const defaults = {
//    initData: 'Panel',
//    defaultData: {},
//    api: {},
//    render: null,
//    ADDON_ID,
//    PANEL_ID,
//    ADDON_TITLE,
//    CSS_CLASS,
//};

export default function (addonSettings) {
    const settings = addonSettings.config;
//    const { defaultData, addonApi, config } = addonSettings;
    addons.register(settings.ADDON_ID, (api) => {
        const addonStoreCompose = initStore(
          addonSettings,
          api,
        );
        const PanelContainer = initComposer(addonStoreCompose);
        const getID = () => `pd${Math.round(Math.random() * 100)}`;
        const addonPanel = addonSettings.render ? addonSettings.render(addonStoreCompose) : null;
        const addonDisabled = addonSettings.renderDisabled ? addonSettings.renderDisabled(addonStoreCompose) : null;
        const addonRender = addonPanel || addonDisabled || null;
        
        if (addonRender) {
            addons.addPanel(settings.PANEL_ID, {
                title: settings.ADDON_TITLE,
                render: () => (
                  <PanelContainer
                    api={api}
                    addonControl={null}
                    initData={addonSettings.initData}
                    rootProps={{ enquiry: ENQ_ASK, ID: getID() }}
                    addonRender={addonPanel()}
                    addonRenderDisabled={addonDisabled ? addonDisabled() : () => {}}
                    style={{ width: '100%' }}
                    className={`${settings.CSS_CLASS}-panel`}
                    onChannelInit={addonSettings.onChannelInit || null}
                  />),
            });
        }
    });
}
