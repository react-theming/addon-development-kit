import { addDecorator } from '@kadira/storybook';
import { addonManager } from '../src';
import decorComposer from './containers/addonDecorator';
import routes from './decoratorRoutes';

import addonApi from './api';
import config from './config';
import defaultData from './defaultData';

//addonManager.setDefaultData(defaultData);
//addonManager.setAddonApi(api);
//addonManager.setConfig(config);
addonManager.setStoreSettings({
    defaultData,
    addonApi,
    config,
//    queryParams: {
//        label: 'init',
//        index: 0,
//    },
});

export function addonDecorator(initData) {
//    const keyGen = (keyPref, context) => `${keyPref}::${context.kind}`;
    return addonManager.buidDecorator(initData, routes, 'lc');
}

export function globalDecorator(initData) {
//    const keyGen = (keyPref, context) => `${keyPref}`;
//    const keyGen = (keyPref, context) => `${keyPref}::${context.kind}`;
    addDecorator(addonManager.buidDecorator(initData, routes, 'gl'));
}

