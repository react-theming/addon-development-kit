import React from 'react';

import { CHANNEL_STOP } from '../store/store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line

const loggerM = loggerOff; // note: debug
const loggerR = loggerOff; // note: debug


const propTypes = {
    story: React.PropTypes.func,
    setupChannel: React.PropTypes.func,
    addonRender: React.PropTypes.element,
    addonRenderDisabled: React.PropTypes.element,

    setData: React.PropTypes.func,
    debugData: React.PropTypes.func,
    initData: React.PropTypes.any,

    className: React.PropTypes.string,
    style: React.PropTypes.shape(),
};

const defaultProps = {
    addonRenderDisabled: <p>Disabled</p>,
};

export default class RootContainer extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        loggerM.log(`* constructor: ${props.initData}`);

        this.stopChannel = null;
        this.stopControl = null;
        this.state = {
            containerEnabled: false, /* this.props.addonControl.default.enabled, */
        };

        this.setMode = this.setMode.bind(this);

        this.isMount = false; // fixme:
    }
    componentWillMount() {
        loggerM.log(`* componentWillMount: ${this.props.initData}`);
        this.setMode(true);
    }

    componentDidMount() {
        this.isMount = true;
        loggerM.log(`* componentDidMount: ${this.props.initData}`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.containerEnabled === false) && (nextState.containerEnabled === false)) {
            return false;
        }
        if (this.props.initData === 'ADK Panel') return true;
        loggerM.info(`* shouldComponentUpdate: ${this.props.initData}`, nextProps, nextState);
        return true;
    }

    componentWillUnmount() {
        this.isMount = false;
        loggerM.log(`* componentWillUnmount: ${this.props.initData}`);
        this.setMode(false);
    }

    setMode(enabled) {
        const { setupChannel } = this.props;

        const onChannelSetup = (info) => {
            const enableByChan = (info.channelRole !== CHANNEL_STOP);

            // todo: get rid of setState here
            if (this.isMount) {
                if (enableByChan !== this.state.containerEnabled) {
                    loggerM.log('onChannelSetup:', this.isMount, info);
                    this.setState({ containerEnabled: enableByChan });
                }
            }
        };

        if (enabled) {
            this.stopChannel = setupChannel(onChannelSetup); // check: actual data?
        } else {
            if (this.stopChannel) this.stopChannel();
            this.stopChannel = null;
        }
    }


    render() {
        if (this.props.initData !== 'ADK Panel') {
            loggerM.warn(`* render: ${this.props.initData}`, this.props, this.state);
        }
        const { style, className, setData, debugData, story, addonRender, addonRenderDisabled } = this.props;
        /* const { initData, ID} = addonControl.default;*/
        const initData = this.props.initData;
        const enabled = this.state.containerEnabled;

        const debugInfo = loggerR.on ? (
          <div>
            <p style={{ backgroundColor: enabled ? '#41537b' : '#525252', color: 'white' }}>
              {enabled ? 'Enabled!' : 'Disabled*'}, <b>{/* ID*/}</b> initData: <i>{initData.toString()}</i>
            </p>
            <button onClick={setData(initData)}>
                    setData
                </button>
            <button onClick={debugData()}>
                    debugData
                </button>
          </div>
        ) : null;

        const enabledAddon = (is) => {
            if (!is) {
                return (
                  <div>
                    {addonRenderDisabled || null}
                    {story ? story() : null}
                  </div>
                );
            }
            return (
              <div> {addonRender || null} </div>
            );
        };

        return (
          <div style={style} className={`${className}-${enabled ? 'enabled' : 'disabled'}`}>
            {debugInfo}
            {enabledAddon(enabled)}
          </div>
        );
    }
}

RootContainer.propTypes = propTypes;
RootContainer.defaultProps = defaultProps;
