import React from 'react';
import initComposer from '../store/composer'; // todo: revert
// import initStore from '../store/store';
import initStore, { ENQ_ASK, ENQ_SEND } from '../store/store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug
const loggerHot = loggerOn; // note: debug

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
        this.newStore = this.newStore.bind(this);
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
        const key = `${keyPref}::${context.kind}`;
        const currentStore = this.storesMap[key] || initStore(
            this.defaultData,
            this.addonApi,
            this.setConfig,
        );
        this.fireSubscriptions(currentStore);
        return currentStore;
    }

    newStore() {
        return initStore(
            this.defaultData,
            this.addonApi,
            this.setConfig,
        );
    }

}

const addonManager = new AddonManager();

export { addonManager };

const decorStoresMap = {};
let isGlobalReload = false;

function getDecor(initData, keyPref, decorComposer) {
    let key;
    let addonStoreCompose;
    let Decorator;
    let AddonDecorator;

    let isReload = true;

    return (storyFn, context) => {
//        const addonStoreCompose = addonManager.storeCheckout(context, keyPref);
//        addonManager.storeSave(context, addonStoreCompose, keyPref);

        if (isReload) {
            if (isGlobalReload) {
//                loggerHot.warn('Hot reloading');
            }
            key = `${keyPref}::${context.kind}`;
            decorStoresMap[key] = decorStoresMap[key] || addonManager.newStore();
            addonStoreCompose = decorStoresMap[key];
            Decorator = initComposer(addonStoreCompose);
            AddonDecorator = decorComposer(addonStoreCompose);
            isReload = false;
        }
        isGlobalReload = true;

        // передавать функцию routes которая будет в качестве аргумента принимать хранилище.
        // в этой функции разработчик сам прописывает все нужные подписки на хранилище и создает структуру декораторов
        return (
          <div>
            <Decorator
              initData={initData}
              rootProps={{
                  enquiry: ENQ_SEND,
                  ID: getID(keyPref),
                  context,
              }}
              story={storyFn()}
              addonDecorator={() => <AddonDecorator story={storyFn()}/>}
            />
            {/*<AddonDecorator />*/}
          </div>);
    };
}


export function decorator(initData, pref) {
    const keyPref = pref || 'lc';
    logger.log('addDecorator', keyPref);
     // todo remove inside!!!
    const deco = getDecor(initData, keyPref, null);
    return deco;
}

export function buidDecorator(initData, decorComposer, keyPref) {
    const deco = getDecor(initData, keyPref, decorComposer);
    return deco;
}
