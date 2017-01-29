import Component from '../panel/component'; // fixme: revert to use the own component
import addonStoreCompose from '../store';

function dataLoader(props, onData, { addonStore, apiMap, setupChannel }) {
    const sendData = (storeData) => {
        const theme = storeData.uiTheme;
        const propsToChild = {
            label: storeData.label,
            index: storeData.index,
            theme,
            onVote: apiMap.incIndex,
            onLabel: apiMap.setLabel,
            onReady: setupChannel,
        };
        onData(null, propsToChild);
    };
    const stopSubscription = addonStore.subscribe(sendData);

    sendData(addonStore.getAll());

    return stopSubscription;
}

export default addonStoreCompose(dataLoader)(Component);

