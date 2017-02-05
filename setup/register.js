import register from '../src/register';
import api from './api';
import config from './config';
import defaultData from './defaultData';

const panelSettings = {
    initData: 'ADK Panel',
    defaultData,
    api,
    render: null,
    ...config,
};

register(panelSettings);
