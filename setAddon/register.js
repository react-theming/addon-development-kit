import { register } from '../src';
import { ENQ_SEND } from '../src/store/store';
//import addonApi from './api';
import config from './config';
//import defaultData from './defaultData';
//import panelRoutes from './panelRoutes';


register(config, (env) => {
    const setupChannel = env.channelInit(ENQ_SEND, 'qq01');
    const stopChannel = setupChannel();
});
