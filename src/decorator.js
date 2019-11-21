import React from 'react';
import withChannel from './withChannel';

import { getConfig } from './config';

const DecoratorHOC = ({ actions, selectors, Component, parameters, resetParameters, ...props }) => {
  React.useEffect(() => {
    console.log('Effect:\n', parameters);
    resetParameters(parameters);
  }, [parameters, resetParameters]);
  return <Component {...actions} {...selectors} {...props} />
};

export const createDecorator = (storeSelectors, createActions) => (
  Component,
  { isGlobal = true } = {}
) => initData => (getStory, context) => {
  const {
    ADDON_ID,
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    PARAM_Key,
  } = getConfig();

  const parameters = context.parameters && context.parameters[PARAM_Key];
  const storyId = isGlobal ? null : context.id;

  // const [prms, setParams] =

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
  })(DecoratorHOC);

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
