import React from 'react';
import Immutable from 'immutable';
import addons from '@kadira/storybook-addons'; // eslint-disable-line
import { setDefaults } from 'react-komposer';
import Podda from 'podda';

import apiLib from './api';
import { EVENT_ID_INIT, EVENT_ID_DATA } from '../';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const loggerC = loggerOff; // note: debug
const loggerS = loggerOff; // note: debug

const defaults = {
    uiTheme: { canvas: 'white', text: 'black' },
    label: 'init',
    index: 0,
};

export default function initStore() {
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

    addonStore.registerAPI('reset', (store) => {
        store.data = Immutable.Map(defaults);
        store.fireSubscriptions();
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
    function channelInit(id) {
        const CHANNEL_MASTER = 'MASTER';
        const CHANNEL_SLAVE = 'SLAVE';
        const CHANNEL_STOP = 'STOP';
        let channel;
        let channelRole;
        const channelId = id;
        let peerId = null;
        let initCallback = null;

        const onStoreChange = (dataStore) => {
            loggerC.info(`Store Changed by ${channelRole}`);
            channel.emit(EVENT_ID_DATA, {
                dataStore,
                role: channelRole,
                id: channelId,
                to: peerId,
            });
        };

        const onDataChannel = (dataChannel) => {
            loggerC.log(`onDataChannel (I'm ${channelRole} id:${channelId}):`, `from: ${dataChannel.id} to: ${dataChannel.to}`);
            if (dataChannel.to === channelId) {
                addonStore.bypass(dataChannel.dataStore, [onStoreChange]);
            }
        };

        const startChannel = () => {
            channel.emit(EVENT_ID_INIT, {
                info: 'wonna be a master',
                role: CHANNEL_MASTER,
                id: channelId,
            });
        }

        const stopChannel = () => {
            channel.emit(EVENT_ID_INIT, {
                info: 'stop channel connection',
                role: CHANNEL_STOP,
                id: channelId,
            });
            channel.emit(EVENT_ID_DATA, {
                dataStore: {},
                role: channelRole,
                id: channelId,
                to: peerId,
            });
        }

        const setChannelMaster = (id) => {
            peerId = id;
            channelRole = CHANNEL_MASTER;
            loggerC.log(`onInitChannel: I'm a ${channelRole} now, id=${channelId} peerId=${peerId}`);
            if (initCallback) {
                initCallback();
                initCallback = null;
            }
        };

        const setChannelSlave = (id) => {
            peerId = id;
            channelRole = CHANNEL_SLAVE;
            channel.emit(EVENT_ID_INIT, {
                    info: 'so I\'m a slave',
                    role: channelRole,
                    id: channelId,
                });
            loggerC.log(`onInitChannel: I'm a ${channelRole} now, id=${channelId} peerId=${peerId}`);
        };

        const onInitChannel = (initData) => {
            if (initData.role === CHANNEL_MASTER) {
                setChannelSlave(initData.id);

            }

            if (initData.role === CHANNEL_SLAVE) {
                setChannelMaster(initData.id);
            }

            if (initData.role === CHANNEL_STOP) {
                loggerC.log(`Stop Channel: I was a ${channelRole}, id=${channelId}`);
                addonStore.reset();
            }

        };

    /**
      * note: this callback should be invoked
      * in componentDidMount() to init channel connection
      * and the returned callback could be invoked
      * in componentWillUnmount().
      * initCb() - will be invoked after getting connected
      *
      */
        return function setupChannel(initCb) {
            initCallback = initCb;
            channel = addons.getChannel();
            let stopStorySubscription;

            try {
                channel.on(EVENT_ID_INIT, onInitChannel);
                startChannel();

                stopStorySubscription = addonStore.subscribe(onStoreChange);

                channel.on(EVENT_ID_DATA, onDataChannel);
            }
            catch (err) {
                loggerC.warn(err);
            }

            return () => {
                loggerC.info('Channel STOPS');
                stopChannel();
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
            channelInit,
        },
    });

    loggerS.log('Store created:', addonStore);
    return addonStoreCompose;
}
