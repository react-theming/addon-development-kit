import { addDecorator } from '@kadira/storybook';
import { buidDecorator, addonManager } from 'storybook-adk';
import decorComposer from './containers/addonDecorator';
import routes from './decoratorRoutes';

import api from './api';
import config from './config';
import defaultData from './defaultData';

addonManager.setDefaultData(defaultData);
addonManager.setAddonApi(api);
addonManager.setConfig(config);

export function addonDecorator(initData) {
//    const keyGen = (keyPref, context) => `${keyPref}::${context.kind}`;
    return buidDecorator(initData, routes, 'lc');
}

export function globalDecorator(initData) {
//    const keyGen = (keyPref, context) => `${keyPref}`;
//    const keyGen = (keyPref, context) => `${keyPref}::${context.kind}`;
    addDecorator(buidDecorator(initData, routes, 'gl'));
}

