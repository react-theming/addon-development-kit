export function addonComposer(storeHandler, Component) {
/** note: addonComposer
 *  storeHandler(storeData, props, addonApi)
 *  Component - ReactJS <Component />
 *  currentStoreCompose - will be attached in decorator
 */

    return function composeLinker(currentStoreCompose) {
        const dataLoader = (props, onData, env) => {
            const addonStore = env.addonStore;
            const addonApi = env.apiMap;
            const sendData = (storeData) => {
                const handledData = storeHandler(storeData, props, addonApi);
                onData(null, handledData);
            };

            const stopSubscription = addonStore.subscribe(sendData);
            sendData(addonStore.getAll());
            return stopSubscription;
        };

        return currentStoreCompose(dataLoader)(Component);
    };
}

export function userComposer() {
    return null;
}
