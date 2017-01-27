import React from 'react';
import { setDefaults } from 'react-komposer';
import Podda from 'podda';

import apiLib from './api';
import { EVENT_ID_INIT, EVENT_ID_DATA } from '../';

const defaults = { uiTheme: { canvas: 'white', text: 'black' } };
const store = new Podda(defaults);
store.set('label', 'override');
store.set('index', 130);

function createApi(apiLib, poddaStore) {
    const keys = Object.keys(apiLib);

    const apiMap = {};
    keys.forEach((val) => {
        apiMap[val] = function (...props) {
            return () => apiLib[val](poddaStore, ...props);
        };
    });
    return apiMap;
}


const addonStoreCompose = setDefaults({
//    pure: true,
    propsToWatch: [],
    loadingHandler: () => (<p>Loading...</p>),
    env: {
        poddaStore: store,
        apiMap: createApi(apiLib, store),
    },
});

export default addonStoreCompose;

console.log(store);
