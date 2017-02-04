import React from 'react';
import { addDecorator } from '@kadira/storybook';
import initComposer from '../store/composer'; // todo: revert
import initStore from '../store/store';
import { ENQ_ASK, ENQ_SEND } from '../store/store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug

const getID = keyPref => `${keyPref}${Math.round(Math.random() * 100)}`;

class AddonManager {
    constructor() {
        logger.warn('##### AddonManager ######');
        this.storesMap = {};
    }

    storeSave(context, store, keyPref) {
        const key = `${keyPref}::${context.kind}`;
        this.storesMap[key] = store;
    }

    storeCheckout(context, keyPref) {
        const key = `${keyPref}::${context.kind}`;
        return this.storesMap[key] || initStore();
    }

}

const addonManager = new AddonManager();

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

export default function addonDecorator(initData, pref = 'lc') {
    return decorator(initData, pref);
}

export function globalDecorator(initData, pref = 'gl') {
    addDecorator(decorator(initData, pref));
}
