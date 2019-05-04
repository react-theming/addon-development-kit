import React from 'react';

import ChannelStore from './ChannelStore';

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

/* It return nothing on init */
const getInitDataFromParameters = (api, addonId) => {
  const storyData = api.getCurrentStoryData()
	console.log("TCL: getInitDataFromParameters -> storyData", storyData)
  return api.getParameters();
};

const withChannel = ({
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  ADDON_ID,
  initData,
  panel,
}) => WrappedComponent =>
  class extends React.Component {
    static displayName = `WithChannel(${getDisplayName(WrappedComponent)})`;

    state = {
      data: {
        ...initData,
        ...this.props.initData,
        ...getInitDataFromParameters(this.props.api, ADDON_ID),
      },
    };

    store = new ChannelStore({
      EVENT_ID_INIT,
      EVENT_ID_DATA,
      EVENT_ID_BACK,
      name: this.props.pointName,
      initData: this.state.data,
      isPanel: this.props.panel || panel,
    });

    componentDidMount() {
      this.debugLog('componentDidMount');
      this.store.onData(this.onData);
      if (this.state.data && !this.state.isPanel) {
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
      // this.props.onData(data);
      this.setState({ data });
    };

    render() {
      const { pointName, initData, active, onData, ...props } = this.props;
      // console.log('​extends -> render -> this.state.data', this.state.data);
      if (active === false) return null;
      return (
        <WrappedComponent
          data={this.state.data}
          setData={this.store.send}
          store={this.store}
          active={active}
          {...props}
        />
      );
    }
  };

export default withChannel;
