import { addDecorator } from '@kadira/storybook';
import { buidDecorator, addonManager } from '../src';
import decorComposer from './containers/addonDecorator';
import api from './api';
import config from './config';
import defaultData from './defaultData';

addonManager.setDefaultData(defaultData);
addonManager.setAddonApi(api);
addonManager.setConfig(config);

export function addonDecorator(initData) {
    return buidDecorator(initData, decorComposer, 'lc');
}

export function globalDecorator(initData) {
    addDecorator(buidDecorator(initData, decorComposer, 'gl'));
}

