import React from 'react';
import addons from '@kadira/storybook-addons'; // eslint-disable-line
import { setDefaults } from 'react-komposer';
import Podda from 'podda';

import apiLib from './api';
import { EVENT_ID_INIT, EVENT_ID_DATA } from '../';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug

const defaults = {
    uiTheme: { canvas: 'white', text: 'black' },
    label: 'init',
    index: 0,
};

const addonStore = new Podda(defaults);


addonStore.registerAPI('bypass', (store, data, bypassList) => {
    const fullCallbackList = store.callbacks;
    store.callbacks = store.callbacks.filter(val =>
        !(bypassList || []).includes(val),
    );
    store.update(() => (
      { ...data }
    ));
    store.callbacks = fullCallbackList;
});


function createApi(apilist, poddaStore) {
    const keys = Object.keys(apilist);

    const apiMap = {};
    keys.forEach((val) => {
        apiMap[val] = function (...props) {
            return () => apilist[val](poddaStore, ...props);
        };
    });
    return apiMap;
}

// setup channel
function channelInit() {
    const CHANNEL_MASTER = 'MASTER';
    const CHANNEL_SLAVE = 'SLAVE';
    let channel;
    let channelRole;

    const onStoreChange = (dataStore) => {
        logger.info(`Store Changed by ${channelRole}`);
        channel.emit(EVENT_ID_DATA, {
            dataStore,
            role: channelRole,
        });
    };

    const onDataChannel = (dataChannel) => {
        logger.log(`onDataChannel (I'm ${channelRole}):`, dataChannel.dataStore);
        addonStore.bypass(dataChannel.dataStore, [onStoreChange]);
    };

    const setChannelMaster = () => {
        channelRole = CHANNEL_MASTER;
//        addonStore.bypass({ label: 'Master' }, [onStoreChange]); // todo: remove it
    };

    const setChannelSlave = () => {
        channelRole = CHANNEL_SLAVE;
//        addonStore.bypass({ label: 'Slave' }, [onStoreChange]); // todo: remove it
    };

    const onInitChannel = (initData) => {
        if (initData.role === CHANNEL_MASTER) {
            setChannelSlave();
            channel.emit(EVENT_ID_INIT, {
                info: 'so I\'m a slave',
                role: channelRole,
            });
        }

        if (initData.role === CHANNEL_SLAVE) {
            setChannelMaster();
        }

        logger.log(`onInitChannel (I'm ${channelRole}):`, initData);
    };

/**
  * note: this callback should be invoked
  * in componentDidMount() to init channel connection
  * and the returned callback could be invoked
  * in componentWillUnmount()
  *
  */
    return function setupChannel() {
        channel = addons.getChannel();
        let stopStorySubscription;

        try {
            channel.on(EVENT_ID_INIT, onInitChannel);
            channel.emit(EVENT_ID_INIT, {
                info: 'wonna be a master',
                role: CHANNEL_MASTER,
            });

            stopStorySubscription = addonStore.subscribe(onStoreChange);

            channel.on(EVENT_ID_DATA, onDataChannel);
        }
        catch (err) {
            logger.warn(err);
        }

        return () => {
            channel.removeListener(EVENT_ID_INIT, onInitChannel);
            channel.removeListener(EVENT_ID_DATA, onDataChannel);
            stopStorySubscription();
        };
    };
}

const addonStoreCompose = setDefaults({
//    pure: true,
    propsToWatch: [],
    loadingHandler: () => (<p>Loading...</p>),
    env: {
        addonStore,
        apiMap: createApi(apiLib, addonStore),
        setupChannel: channelInit(),
    },
});

export default addonStoreCompose;

// logger.log(addonStore);
