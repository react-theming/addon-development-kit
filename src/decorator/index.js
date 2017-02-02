import React from 'react';
import initComposer from '../store/composer'; // todo: revert
import initStore from '../store';
import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug
const loggerRoot = loggerOff; // note: debug



class AddonManager {
    constructor() {
        this.contextMap = {};
        logger.warn('##### AddonManager ######');
        this.getDecor = this.getDecor.bind(this);
    }

    regDecor(context, initData, ID) {
        const key = `${context.kind}::${context.story}`; // todo: why here story?

        if (!this.contextMap[key]) {
            this.contextMap[key] = {};
        }
        if (!this.contextMap[key][ID]) {
            const ind = Object.keys(this.contextMap[key]).length;
            const addonStoreCompose = initStore();
            this.contextMap[key] = {
                ...this.contextMap[key],
                [ID]: {
                    ind,
                    initData,
//                    Decorator: initComposer(addonStoreCompose),
//                    addonStoreCompose: initStore(),
                },
            };
        }

        const decorData = this.contextMap[key][ID];

        logger.info(`key_upd (${ID}):`, this.contextMap[key]);

        const getControl = (setModeFn) => {
            const maxInd = Object.keys(this.contextMap[key]).length - 1;
            const ind = this.contextMap[key][ID].ind;
            if (ind === maxInd) {
                logger.log(`Got Control (${key}::${ID}) ind-${ind}:`, this.contextMap[key][ID]);
                setModeFn(true);
            }


            const stopControl = () => {
                delete (this.contextMap[key][ID]);
            };
            return stopControl;
        };

        return {getControl, decorData};
    }

    getDecor(initData, ID, addonStoreCompose) { // todo: remove
        logger.log('getDecor');
        const Decorator = initComposer(addonStoreCompose); // todo: remove
        return (storyFn, context) => {
            const {getControl, decorData} = this.regDecor(context, initData, ID);
//            const Decorator = initComposer(addonStoreCompose);
//            const Decorator = decorData.Decorator;
            const addonControl = {
                getControl,
                default: {
                    enabled: false,
                    initData,
                    ID,
                },
            };
            return (
              <div style={{ backgroundColor: 'grey', color: 'white' }}>
                  <Decorator
                    addonControl={addonControl}
                    ID={ID}
                    rootProps={{enabled: true}}
                    initData={initData}
                    remote={getControl}
                  />
                  {storyFn()}
                </div>
            );
        };
    }
}

const addonManager = new AddonManager();

const getID = () => `id${Math.round(Math.random() * 100)}`;

export default function decorator(initData) {
    logger.log('addDecorator');
    const addonStoreCompose = initStore(); // todo remove inside!!!
    const deco = addonManager.getDecor(initData, getID(), addonStoreCompose);
    return deco;
}

