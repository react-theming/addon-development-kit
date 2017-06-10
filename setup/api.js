//import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
//const logger = loggerOff; // note: debug

export default {
    incIndex(poddaStore, delta) {
        poddaStore.update(state => ({
            index: state.index + delta,
            queryData: {
                votes: state.index + delta,
                bar: 'foo',
            },
        }));
    },
    setLabel(poddaStore, name, ind) {
        poddaStore.update(state => ({ index: ind, label: `now it's ${name}-${ind}` }));
    },
    $queryFetch(poddaStore, queryInitData) {
        const data = poddaStore.getAll();
        const isInit = data.index !== 100;
        return {
            index: isInit ? data.index : parseInt(queryInitData.votes, 10),
            queryData: queryInitData,
        };
    },
};
