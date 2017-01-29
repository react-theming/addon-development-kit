import Component from './component';
import addonStoreCompose from '../store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug

function dataLoader(props, onData, { addonStore, apiMap, setupChannel }) {
    logger.log('dataLoader:', props);
    const sendData = (storeData) => {
        logger.log('--> sendData:', props);
        const theme = storeData.uiTheme;
        const propsToChild = {
            label: storeData.label,
            index: storeData.index,
            theme,
            data: storeData.data,

            onVote: apiMap.incIndex,
            onLabel: apiMap.setLabel,
            setData: apiMap.setData,
            initData: props.initData,

            onReady: setupChannel,
        };
        onData(null, propsToChild);
    };
    const stopSubscription = addonStore.subscribe(sendData);

    sendData(addonStore.getAll());

    return stopSubscription;
}

export default addonStoreCompose(dataLoader)(Component);

