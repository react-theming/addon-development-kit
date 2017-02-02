import React from 'react';

import { CHANNEL_STOP } from '../store/store';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug


const propTypes = {
    addonControl: React.PropTypes.shape(),
    setupChannel: React.PropTypes.func,
}

export default class RootContainer extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        logger.warn(`* constructor: ${props.initData}`);

        this.stopChannel = null;
        this.stopControl = null;
        this.state = {
            containerEnabled: true, /* this.props.addonControl.default.enabled, */
        }

        this.setMode = this.setMode.bind(this);
    }
    componentDidMount() {
        /*const { addonControl, setupChannel, setData } = this.props;
        const { enabled, initData } = addonControl.default; */

        logger.warn(`* componentDidMount: ${this.props.initData}`);
        this.setMode(true);
        /* this.stopControl = addonControl.getControl(this.setMode);*/
    }
    componentWillUnmount() {
        logger.warn(`* componentWillUnmount: ${this.props.initData}`);
        this.setMode(false);
        /* if (this.stopControl) this.stopControl();*/
    }

    setMode(enabled) {
        const { /*addonControl,*/ setupChannel, setData } = this.props;
        const { initData } = this.props;
        logger.log('setMode:', initData , enabled);

        const onChannelSetup = (info) => {
            const enableByChan = (CHANNEL_STOP !== info.channelRole);
            this.setState({containerEnabled: enableByChan});
            logger.log('onChannelSetup:', info);
        }

        if (enabled) {
            this.stopChannel = setupChannel(onChannelSetup); // check: actual data?
        } else {
            if (this.stopChannel) this.stopChannel();
            this.stopChannel = null;
        }
        this.setState({containerEnabled: enabled});
    }

    render() {
        const { /*addonControl,*/ setData, debugData } = this.props;
        /* const { initData, ID} = addonControl.default;*/
        const initData = this.props.initData;
        const enabled = this.state.containerEnabled;
        logger.info('Render:', initData , enabled);
        return (
            <div>
              <p style={{ backgroundColor: enabled ? '#41537b' : '#525252', color: 'white' }}>
                {enabled ? 'Enabled!' : 'Disabled*'}, <b>{/*ID*/}</b> initData: <i>{initData}</i>
              </p>


              <button onClick={setData(initData)}>
                  setData
              </button>
              <button onClick={debugData()}>
                  debugData
              </button>
              <Dummy {...this.props} />
            </div>
        );
    }
}

RootContainer.propTypes = propTypes;

const Dummy = ({ label, index, theme, data, onVote, onLabel}) => {
    return (
      <div>
        <p>Label: <i>{label}</i>, Index: <i>{index}</i>, Data: <i>{data}</i> </p>
        <button onClick={onVote(3)}>Vote</button>
        <button onClick={onLabel('Alpha', 28)}>Alpha</button>
        <button onClick={onLabel('Betta', 133)}>Betta</button>
      </div>
    );
};
