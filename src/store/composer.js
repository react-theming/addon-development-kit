import Component from './container';
import initStore from './store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug

export default function initComposer(addonStoreCompose) {


    function dataLoader(props, onData, { addonStore, apiMap, channelInit }) {
        logger.log('Composer init:', props.initData, addonStore.getAll());
        const setupChannel = channelInit(props.rootProps.enquiry, props.rootProps.ID);

        const sendData = (storeData) => {
            logger.log('Composer ivoked:', props.rootProps, addonStore.getAll());
            const theme = storeData.uiTheme;
            const propsToChild = {
                label: storeData.label, // remove
                index: storeData.index, // remove
                theme, // remove
                data: storeData.data,

                onVote: apiMap.incIndex, // remove
                onLabel: apiMap.setLabel, // remove
                setData: apiMap.setData,
                debugData: apiMap.debugData,

                initData: props.initData, // remove
//                rootProps: props.rootProps, // remove
                addonControl: props.addonControl,

                setupChannel,
            };
            onData(null, propsToChild);
        };

        const stopSubscription = addonStore.subscribe(sendData);

        sendData(addonStore.getAll());

        return stopSubscription;
    }

    return addonStoreCompose(dataLoader)(Component);
}
