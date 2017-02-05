import { addDecorator } from '@kadira/storybook';
import { decorator, addonManager } from '../src';
import api from './api';
import config from './config';
import defaultData from './defaultData';

addonManager.setDefaultData(defaultData);
addonManager.setAddonApi(api);
addonManager.setConfig(config);

export function addonDecorator(initData) {
    return decorator(initData);
}

export function globalDecorator(initData) {
    addDecorator(decorator(initData, 'gl'));
}

