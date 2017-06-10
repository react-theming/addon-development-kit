import React from 'react';
import { initStore } from '../src';
import { ENQ_ASK } from '../src/store/store';

import config from './config';

const storeEnv = initStore(config);
const setupChannel = storeEnv.channelInit(ENQ_ASK, 'ad02');
const stopChannel = setupChannel();
// console.log(storeEnv);
const store = storeEnv.addonStore.getAll();
// console.log('store:', store);
let querry = {
    chapter: 'undef',
};
const stopQuerySubscription = storeEnv.addonStore.watch('queryData', (data) => {
//    console.info('queryData in addon:', data)
    querry = data;
});

const querryManager = {
    qIndex: 0,
    getInd() {
        return querryManager.qIndex++;
    },
}

const addons = {
   querry() {
    //    console.log('store querry:', storeEnv.addonStore.getAll());
       this.add('querry addon', () => {
        //  console.log('store select:', storeEnv.addonStore.getAll());
//         storeEnv.addonStore.set('queryData', {chapter: 'lalala'});
         return (<div>
           It is a test querry addon: {`#${querry.chapter}`}
         </div>)
       })
   }
}

export default addons;
