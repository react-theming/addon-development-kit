import { getStoreCompose } from './store';

export function addonComposer(storeHandler, Component) {
/** note: addonComposer
 *  storeHandler(storeData, props, addonApi)
 *  Component - ReactJS <Component />
 *  currentStoreCompose - will be attached in decorator
 */

    return function composeLinker(envr) {
        const currentStoreCompose = getStoreCompose(envr);

        const dataLoader = (props, onData, env) => {
            const addonStore = env.addonStore;
            const addonApi = env.apiMap;
            const storybookApi = env.storybookApi;
            const sendData = (storeData) => {
                const handledData = storeHandler(
                    storeData,
                    props,
                    addonApi,
                    storybookApi,
                );
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
