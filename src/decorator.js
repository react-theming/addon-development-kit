import React from 'react';
import withChannel from './withChannel';

import {
  ADDON_ID,
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  PARAM_Key,
} from './config';

export const createDecorator = Component => initData => (getStory, context) => {
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

export const setParameters = params => ({
  [PARAM_Key]: params,
});
