import React from 'react';

import ChannelStore from './ChannelStore';

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withChannel = ({
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  ADDON_ID,
  initData,
  panel,
  parameters,
  storyId,
  createActions = {},
}) => WrappedComponent =>
  class extends React.Component {
    static displayName = `WithChannel(${getDisplayName(WrappedComponent)})`;

    state = {
      data: {
        ...initData,
        ...this.props.initData,
        ...parameters,
      },
      isReceived: false,
    };

    isPanel = this.props.panel || panel;
    store = new ChannelStore({
      EVENT_ID_INIT,
      EVENT_ID_DATA,
      EVENT_ID_BACK,
      name: this.props.pointName,
      initData: this.state.data,
      isPanel: this.isPanel,
      storyId,
    });

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
    actions = this.prepareActions();

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
      this.setState({ data, isReceived: true });
    };

    render() {
      const { pointName, initData, active, onData, ...props } = this.props;
      const { data, isReceived } = this.state;

      if (active === false) return null;
      if (!isReceived) return null;

      return (
        <WrappedComponent
          data={data}
          setData={this.store.send}
          store={this.store}
          active={active}
          parameters={parameters}
          actions={this.actions}
          {...props}
        />
      );
    }
  };

export default withChannel;
