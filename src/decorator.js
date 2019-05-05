import React from 'react';
import withChannel from './withChannel';

import {
  getConfig,
} from './config';

export const createDecorator = Component => initData => (getStory, context) => {
  const {
    ADDON_ID,
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    PARAM_Key,
  } = getConfig();
  const WithChannel = withChannel({
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    ADDON_ID,
    initData,
    panel: false,
  })(Component);

  const parameters = context.parameters[PARAM_Key];

  return (
    <WithChannel
      getStory={getStory}
      context={context}
      parameters={parameters}
    />
  );
};

export const setParameters = () => {
  const { PARAM_Key } = getConfig();
  return params => ({
    [PARAM_Key]: params,
  });
};
