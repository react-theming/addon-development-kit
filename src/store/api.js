import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug

export default {
//    incIndex(poddaStore, delta) {
//        poddaStore.update(state => ({ index: state.index + delta }));
//    },
//    setLabel(poddaStore, name, ind) {
//        poddaStore.update(() => ({ index: ind, label: name }));
//    },

    dataInit(poddaStore, data) {
        logger.log('dataInit:', data);
        poddaStore.set('initData', data);
    },

    setData(poddaStore, data) {
        poddaStore.update(() => ({ data }));
        logger.log('Set Data:', poddaStore.getAll());
    },
    debugData(poddaStore) {
        logger.log('Addon Store:', poddaStore.getAll());
    },
    $queryFetch(poddaStore, queryInitData) {
        return {
            queryData: queryInitData,
        };
    },
};
