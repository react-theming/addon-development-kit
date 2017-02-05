import React from 'react';
import { addonManager } from './decorator';


/**
 * Args:
 * Component - React Component
 * dataLoader(props, onData, { addonStore, apiMap })
 *
 * Return ? addonStoreCompose(dataLoader)(Component);
 *
 * Subcribe:
 * to switch between of set of addonStore's
 *
 */

// todo: Обновлять текущее STORE из тех что хранятся в addonManager


function initComposer(addonStoreCompose) {

    function dataLoader(props, onData, { addonStore, apiMap }) {

        const sendData = (storeData) => {
            const propsToChild = {
            };
            onData(null, propsToChild);
        };

        const stopSubscription = addonStore.subscribe(sendData);

        sendData(addonStore.getAll());

        return stopSubscription;
    }

    return addonStoreCompose(dataLoader)(Component);
}

export default addonComposer(dataLoader, Component) {
    let currentStoreCompose;
    addonManager.subscribe((currentSC) => {
        currentStoreCompose = currentSC;
    })


    return currentStoreCompose(dataLoader)(Component);
}
