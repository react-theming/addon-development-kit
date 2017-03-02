import React from 'react';
import Immutable from 'immutable';
import addons from '@kadira/storybook-addons'; // eslint-disable-line
import { setDefaults } from 'react-komposer';
import Podda from 'podda';

import apiLib from './api';
import { EVENT_ID_INIT, EVENT_ID_DATA } from '../';
import { queryFetch, querySet } from '../utils/query';

import logger, { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const loggerC = loggerOff; // note: debug
const loggerS = loggerOff; // note: debug
const loggerQ = loggerOff; // note: debug

export const CHANNEL_MASTER = 'MASTER';
export const CHANNEL_SLAVE = 'SLAVE';
export const CHANNEL_STOP = 'STOP';
export const ENQ_ASK = 'ASK';
export const ENQ_SEND = 'SEND';

const defaults = {
    uiTheme: { canvas: 'white', text: 'black' },
    label: 'init',
    index: 0,
//    queryParams: {
//
//    }
};

const storeDefaultSettings = {
    defaultData: defaults,
    addonApi: {},
    config: {
        EVENT_ID_INIT,
        EVENT_ID_DATA,
    },
    queryParams: {
//        label: 'init',
//        index: 0,
    },
};

export default function initStore(storeSettings, storybookApi) {
    const config = {
        ...storeDefaultSettings.config,
        ...storeSettings.config,
    };

    const addonApi = {
        ...storeDefaultSettings.addonApi,
        ...storeSettings.addonApi,
    };

    const defaultData = storeSettings.defaultData || storeDefaultSettings.defaultData;
    const queryParams = storeSettings.queryParams || storeDefaultSettings.queryParams;

    let queryInitData = null;
    const addonStore = new Podda(defaultData);
    loggerS.warn('*** new Store init ***');
//    loggerS.log('storeSettings', storeSettings);
//    loggerS.log('storeDefaultSettings', storeDefaultSettings);

    addonStore.registerAPI('bypass', (store, data, bypassList) => {
        const fullCallbackList = store.callbacks;
        // eslint-disable-next-line
        store.callbacks = store.callbacks.filter(val =>
            !(bypassList || []).includes(val),
        );
        store.update(() => (
          { ...data }
        ));
        // eslint-disable-next-line
        store.callbacks = fullCallbackList;
    });

    addonStore.registerAPI('reset', (store) => {
        loggerS.info('Store reset');
        // eslint-disable-next-line
        store.data = Immutable.Map(defaultData);
        store.fireSubscriptions();
    });


    function createApi(poddaStore, apilist) {
        const keys = Object.keys(apilist);

        const apiMap = {};
        keys.forEach((val) => {
            apiMap[val] = function (...props) {
                return () => {
                    try {
                        return apilist[val](poddaStore, ...props);
                    } catch (err) {
                        logger.groupCollapsed(`${err.name} in ${val} API: ${err.message}`);
                        logger.log('store settings:', storeSettings);
                        logger.log('store data:', addonStore.getAll());
                        logger.log(err);
                        logger.groupEnd(`${err.name} in ${val} API: ${err.message}`);
                        return null;
                    }
                };
            };  
        });
        return apiMap;
    }

    /** note: setup channel
     *
     *  Need to init channel connection between panel side and stories side
     *
     *  setupChannel(initCb) = channelInit(storeEnquiry, id)
     *  , where:
     *  id - channel identifier
     *  storeEnquiry = ENQ_ASK to ask data after init
     *  storeEnquiry = ENQ_SEND to send data after init
     *  setupChannel - need to invoke in componentWillMount (see below)
     *
     */
    function channelInit(storeEnquiry, id) {
        loggerC.info('channelInit storeEnquiry:', storeEnquiry, id);
        let channel;
        let channelRole = CHANNEL_STOP;
        const channelId = id;
        let peerId = null;
        let initCallback = null;

        const watchQuery = (queryData) => {
            loggerQ.log(`queryData (id:${channelId}):`, queryData);
            // todo: here add api for query manage (queryData => addonStore)
            querySet(queryData, storybookApi);
            queryInitData = queryData;
        };

        const onStoreChange = (dataStore) => {
            loggerS.log(`Store Changed in ${channelRole}`, dataStore);
            if (channelRole === CHANNEL_STOP) return;
            channel.emit(config.EVENT_ID_DATA, {
                dataStore,
                role: channelRole,
                id: channelId,
                to: peerId,
            });
        };

        const onDataChannel = (dataChannel) => {
            loggerC.log(
                `onDataChannel (I'm ${channelRole} id:${channelId}):`,
                `from: ${dataChannel.id} to: ${dataChannel.to} myPeer: ${peerId}`,
            );
            if (channelRole === CHANNEL_STOP) return;
            if (dataChannel.to === channelId && dataChannel.id === peerId) {
                if (dataChannel.dataStore.queryData) {
                    watchQuery(dataChannel.dataStore.queryData);
                }
                addonStore.bypass(dataChannel.dataStore, [onStoreChange]);
            }
        };

        const startChannel = () => {
            channel.emit(config.EVENT_ID_INIT, {
                info: 'wonna be a master',
                role: CHANNEL_MASTER,
                id: channelId,
                to: 'any',
                query: queryInitData,
            });
        };

        const stopChannel = () => {
            channelRole = CHANNEL_STOP;
            channel.emit(config.EVENT_ID_INIT, {
                info: 'stop channel connection',
                role: channelRole,
                id: channelId,
            });
            if (storeEnquiry === ENQ_ASK) {
                addonStore.reset();
            }
            /* channel.emit(config.EVENT_ID_DATA, { // fixme:
                dataStore: {},
                role: channelRole,
                id: channelId,
                to: peerId,
            });*/
        };


        const setChannelMaster = (initData) => {
            if (initData.to !== channelId) {
                channelRole = CHANNEL_STOP;
                peerId = null;
                loggerC.log(
                    `onInitChannel: I'm a ${channelRole} now, id=${channelId} peerId=${peerId}`,
                );
                return;
            }
            peerId = initData.id;
            channelRole = CHANNEL_MASTER;
            loggerC.log(
                    `onInitChannel: I'm a ${channelRole} now, id=${channelId} peerId=${peerId}`,
            );
        };

        const setChannelSlave = (initData) => {
            peerId = initData.id;
            channelRole = CHANNEL_SLAVE;
            channel.emit(config.EVENT_ID_INIT, {
                info: 'so I\'m a slave',
                role: channelRole,
                id: channelId,
                to: peerId,
                query: queryInitData,
            });
            loggerC.log(
                `onInitChannel: I'm a ${channelRole} now, id=${channelId} peerId=${peerId}`,
            );
        };

        const storeQueryData = (queryData) => {
            let data = { queryData };
            if (addonApi.$queryFetch) {
                data = addonApi.$queryFetch(addonStore, queryData);
            }
            watchQuery(queryData);
            addonStore.bypass(data, [onStoreChange]);
        };

        const onInitChannel = (initData) => {
            loggerC.log('onInitChannel', initData);

            if (initData.role === CHANNEL_MASTER) {
                setChannelSlave(initData);
            }

            if (initData.role === CHANNEL_SLAVE) {
                setChannelMaster(initData);
            }

//            if (initData.queryInit) {
//                queryInitData;
//            }

            if (initData.role === CHANNEL_STOP) {
                loggerC.log(`Stop Channel: I was a ${channelRole}, id=${channelId}`);
                channelRole = CHANNEL_STOP;
                if (storeEnquiry === ENQ_ASK) {
                    // addonStore.reset();
                }
            } else {
                loggerC.log('storeEnquiry:', storeEnquiry);
                if (initData.query && !queryInitData) storeQueryData(initData.query);
                if (storeEnquiry === ENQ_SEND) {
                    onStoreChange(addonStore.getAll());
                }
            }

            if (initCallback) {
                initCallback({ channelRole, storeEnquiry, channelId, peerId });
            }
        };

    /**
      * note: this callback should be invoked
      * in componentWillMount() to init channel connection
      * and the returned callback could be invoked
      * in componentWillUnmount().
      * initCb() - will be invoked after getting connected
      *
      */
        return function setupChannel(initCb) {
            initCallback = initCb;
            channel = addons.getChannel();
            let stopStorySubscription;

            const stopQuerySubscription = addonStore.watch(
                'queryData', watchQuery);

            try {
                queryInitData = queryFetch(queryParams, storybookApi) || queryInitData;
                if (queryInitData) {
                    loggerQ.log('queryFetch:', queryInitData);
                    storeQueryData(queryInitData);
                }

                channel.on(config.EVENT_ID_INIT, onInitChannel);
                startChannel(queryInitData);

                stopStorySubscription = addonStore.subscribe(onStoreChange);

                channel.on(config.EVENT_ID_DATA, onDataChannel);
            } catch (err) {
                loggerC.warn(err);
            }

            return () => {
                loggerC.info('Channel STOPS');
                stopChannel();
                channel.removeListener(config.EVENT_ID_INIT, onInitChannel);
                channel.removeListener(config.EVENT_ID_DATA, onDataChannel);
                stopQuerySubscription();
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
            apiMap: createApi(addonStore, { ...apiLib, ...addonApi }),
            channelInit,
            storybookApi,
        },
    });

    loggerS.log('Store created:', addonStore.getAll());
    return addonStoreCompose;
}
