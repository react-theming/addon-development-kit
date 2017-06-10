export default {
    incIndex(poddaStore, delta) {
        poddaStore.update(state => ({ index: state.index + delta }));
    },
    setLabel(poddaStore, name, ind) {
        poddaStore.update(state => ({ index: ind, label: `now it's ${name}-${ind}` }));
    },
};
