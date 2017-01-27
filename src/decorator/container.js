//import React from 'react';
import Component from './component';
import addonStoreCompose from '../store';

function dataLoader(props, onData, { poddaStore, apiMap }) {
    const sendData = (storeData) => {
        const theme = storeData.uiTheme;
        const propsToChild = {
            label: storeData.label,
            index: storeData.index,
            theme,
            onVote: apiMap.incIndex,
//            on100: apiMap.setIndto100,
        };
        onData(null, propsToChild);
    }
    const stopSubscription = poddaStore.subscribe(sendData);

    sendData(poddaStore.getAll());

    return stopSubscription;
}

export default addonStoreCompose(dataLoader)(Component);

//console.log(store.getAll());
//console.log(store);
