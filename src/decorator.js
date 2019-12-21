import React from 'react';
import withChannel from './withChannel';

import { getConfig } from './config';

const createHOC = paramSelectors => {
  const DecoratorWrapper = ({
    actions,
    selectors,
    Component,
    parameters,
    resetParameters,
    ...props
  }) => {
    let params = {};
    if (paramSelectors) {
      try {
        const entries = Object.entries(paramSelectors);
        const paramResults = entries
          .map(([name, fn]) => {
            try {
              return { [name]: fn(parameters, selectors) };
            } catch (err) {
              console.error(err);
              return null;
            }
          })
          .filter(Boolean);
        params = paramResults.reduce((obj, item) => ({ ...obj, ...item }), {});
      } catch (err) {
        console.error(err);
      }
    }
    return <Component {...actions} {...selectors} {...params} {...props} />;
  };
  return DecoratorWrapper;
};

export const createDecorator = (
  storeSelectors,
  createActions,
  paramSelectors
) => (Component, { isGlobal = true } = {}) => initData => (
  getStory,
  context
) => {
  const {
    ADDON_ID,
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    PARAM_Key,
  } = getConfig();

  const parameters = context.parameters && context.parameters[PARAM_Key];
  const storyId = isGlobal ? null : context.id;

  const WithChannel = withChannel({
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    ADDON_ID,
    initData,
    panel: false,
    parameters,
    storyId,
    storeSelectors,
    createActions,
  })(createHOC(paramSelectors));

  return (
    <WithChannel getStory={getStory} context={context} Component={Component} />
  );
};

export const setParameters = () => {
  const { PARAM_Key } = getConfig();
  return params => ({
    [PARAM_Key]: params,
  });
};
