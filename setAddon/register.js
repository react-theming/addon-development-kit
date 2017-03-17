import { register } from '../src';
//import addonApi from './api';
import config from './config';
//import defaultData from './defaultData';
//import panelRoutes from './panelRoutes';

const panelSettings = {
    initData: 'QQQ - this is init data',
    config,
    queryParams: {
        chapters: 'no',
    },
};

register(panelSettings);
