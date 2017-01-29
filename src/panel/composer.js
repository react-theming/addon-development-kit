import Component from './component';
import initStore from '../store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug

export default function initComposer() {
  const addonStoreCompose = initStore();

  function dataLoader(props, onData, { addonStore, apiMap, channelInit }) {
      logger.log('dataLoader:', props);
      const sendData = (storeData) => {
          logger.log('--> sendData:', props);
          const theme = storeData.uiTheme;
          const propsToChild = {
              label: storeData.label,
              index: storeData.index,
              theme,
              data: storeData.data,

              onVote: apiMap.incIndex,
              onLabel: apiMap.setLabel,
              setData: apiMap.setData,
              debugData: apiMap.debugData,

              initData: props.initData,

              setupChannel: channelInit(props.ID),
          };
          onData(null, propsToChild);
      };
      const stopSubscription = addonStore.subscribe(sendData);

      sendData(addonStore.getAll());

      return stopSubscription;
  }

  return addonStoreCompose(dataLoader)(Component);
}
