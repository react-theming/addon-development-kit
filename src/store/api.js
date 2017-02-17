import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug

export default {
    incIndex(poddaStore, delta) {
        poddaStore.update(state => ({ index: state.index + delta }));
    },
    setLabel(poddaStore, name, ind) {
        poddaStore.update(() => ({ index: ind, label: name }));
    },
    setData(poddaStore, data) {
        poddaStore.update(() => ({ data }));
        logger.log('Set Data:', poddaStore.getAll());
    },
    debugData(poddaStore) {
        logger.log('Addon Store:', poddaStore.getAll());
    },
};
