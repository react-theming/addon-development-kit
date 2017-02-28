import { register } from '../src';
import addonApi from './api';
import config from './config';
import defaultData from './defaultData';
import panelRoutes from './panelRoutes';

const panelSettings = {
    initData: 'ADK Panel',
    defaultData,
    addonApi,
    render: panelRoutes,
    config,
//    queryParams: {
//        votes: 'init',
//        index: 0,
//    },
};

register(panelSettings);
