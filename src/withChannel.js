import React from 'react';

import { getSingleStore, getNewStore } from './ChannelStore';

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const tryToSelect = fn => store => {
  try {
    return fn(store);
  } catch (err) {
    console.warn(err);
    return undefined;
  }
};

const withChannel = ({
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  ADDON_ID,
  initData,
  panel,
  parameters,
  storyId,
  storeSelectors = {},
  createActions = {},
}) => WrappedComponent =>
  class extends React.Component {
    static displayName = `WithChannel(${getDisplayName(WrappedComponent)})`;

    constructor(props, ...args) {
      super(props, ...args);
      const initStateData = {
        ...initData,
        ...props.initData,
        ...parameters,
      };

      const isReceived = false;

      this.state = {
        data: initStateData,
        selectors: isReceived ? this.prepareSelectors(initStateData) : {},
          isReceived,
        };

        this.store = (panel ? getSingleStore : getNewStore)({
          EVENT_ID_INIT,
          EVENT_ID_DATA,
          EVENT_ID_BACK,
        name: props.pointName,
        initData: this.state.data,
        isPanel: this.isPanel,
        storyId,
      });

      this.actions = this.prepareActions();
    }

    isPanel = this.props.panel || panel;

    prepareSelectors = store => {
      return Object.entries(storeSelectors)
        .map(([name, selector]) => ({
          [name]: tryToSelect(selector)(store),
        }))
        .reduce((akk, cur) => ({ ...akk, ...cur }), {});
    };

    prepareActions = () => {
      const {
        createGlobalAction: global,
        createLocalAction: local,
      } = this.store;
      const isFn = typeof createActions === 'function';
      const actions = isFn
        ? createActions({ global, local })
        : Object.entries(createActions)
            .map(([name, reducer]) => ({ [name]: global(reducer) }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), {});
      return actions;
    };

    componentDidMount() {
      this.debugLog('componentDidMount');
      this.store.onData(this.onData);
      if (this.state.data && !this.isPanel) {
        this.store.onConnected(() => this.store.sendInit(this.state.data));
      }
      this.store.connect();
    }

    componentWillUnmount() {
      this.debugLog('componentWillUnmount');
      this.store.disconnect();
    }

    // debug = true;
    debug = false;

    debugLog = message => {
      if (!this.debug) {
        return;
      }
      console.log(
        this.store.isPanel ? 'Panel:\n' : 'Preview:\n',
        message,
        this.store.store
      );
    };

    onData = data => {
      this.setState({
        data,
        isReceived: true,
        selectors: this.prepareSelectors(data),
      });
    };

    render() {
      const { pointName, initData, active, onData, ...props } = this.props;
      const { data, isReceived, selectors } = this.state;

      if (active === false) return null;

      return (
        <WrappedComponent
          data={data}
          setData={this.store.send}
          store={this.store}
          active={active}
          parameters={parameters}
          selectors={selectors}
          actions={this.actions}
          isFirstDataReceived={isReceived}
          {...props}
        />
      );
    }
  };

export default withChannel;
