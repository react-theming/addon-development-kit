import React from 'react';
import initComposer from '../store/composer'; // todo: revert
// import initStore from '../store/store';
import initStore, { ENQ_ASK, ENQ_SEND } from '../store/store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug

const getID = keyPref => `${keyPref}${Math.round(Math.random() * 100)}`;

class AddonManager {
    constructor() {
        logger.warn('##### AddonManager ######');
        this.defaultData = {};
        this.addonApi = {};
        this.addonConfig = {};
        this.storesMap = {};
        this.subscribers = [];

        this.setDefaultData = this.setDefaultData.bind(this);
        this.setAddonApi = this.setAddonApi.bind(this);
        this.setConfig = this.setConfig.bind(this);
    }

    setDefaultData(data) {
        this.defaultData = data;
    }

    setAddonApi(api) {
        this.addonApi = { ...this.addonApi, ...api };
    }

    setConfig(conf) {
        this.addonConfig = conf;
    }

    subscribe(fn) {
        this.subscribers.push(fn);
        let stopped = false;

        const stop = () => {
            if (stopped) return;
            const index = this.subscribers.indexOf(fn);
            this.subscribers.splice(index, 1);
            stopped = true;
        };

        return stop;
    }

    fireSubscriptions(currentStore) {
        this.subscribers.forEach((fn) => {
            fn(currentStore);
        });
    }

    storeSave(context, store, keyPref) {
        const key = `${keyPref}::${context.kind}`;
        this.storesMap[key] = store;
    }

    storeCheckout(context, keyPref) {
        logger.log(this.addonApi);
        const key = `${keyPref}::${context.kind}`;
        const currentStore = this.storesMap[key] || initStore(
            this.defaultData,
            this.addonApi,
            this.setConfig,
        );
        this.fireSubscriptions(currentStore);
        return currentStore;
    }

}

const addonManager = new AddonManager();

export { addonManager };

function getDecor(initData, keyPref) {
    let Decorator = null;

    return (storyFn, context) => {
        const addonStoreCompose = addonManager.storeCheckout(context, keyPref);
        if (!Decorator) {
            Decorator = initComposer(addonStoreCompose);
        }
        addonManager.storeSave(context, addonStoreCompose, keyPref);
        return (
          <div>
            <Decorator
              initData={initData}
              rootProps={{
                  enquiry: ENQ_SEND,
                  ID: getID(keyPref),
              }}
              story={storyFn()}
            />
          </div>);
    };
}


export function decorator(initData, pref) {
    const keyPref = pref || 'lc';
    logger.log('addDecorator', keyPref);
     // todo remove inside!!!
    const deco = getDecor(initData, keyPref);
    return deco;
}

