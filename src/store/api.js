export default {
    setIndto100(poddaStore, is) {
        poddaStore.update((state) => {
            if (is) return { index: 100 };
            return { };
        });
    },
    setIndto0(poddaStore, is) {
        poddaStore.update((state) => {
            if (is) return { index: 0 };
            return { };
        });
    },
    incIndex(poddaStore, delta) {
        poddaStore.update(state => ({ index: state.index + delta }));
    },
    setLabel(poddaStore, name, ind) {
        poddaStore.update(state => ({ index: ind, label: name }));
    },
};
