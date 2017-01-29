import React from 'react';
// import DecorElement from './decorator/container'; todo: revert
import DecorElement from './panel/container';

import { loggerOn, loggerOff } from './utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug


class RootDecorator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: true,
        };

        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
    }

    componentDidMount() {
        this.stop = this.props.remote(this.enable, this.disable); // todo: revert?
    }

    componentWillUnmount() {
        logger.info('componentWillUnmount');
        this.stop();
    }

    enable() {
        this.setState({ enabled: true });
    }

    disable() {
        this.setState({ enabled: false });
    }
    render() {
        return (
          <div>
            {this.state.enabled ?
              <p style={{ backgroundColor: '#41537b', color: 'white' }}>
                Enabled: {this.state.enabled.toString()}
              </p> : null
            }
            {this.props.children}
          </div>
        );
    }
}

class AddonManager {
    constructor() {
        this.contextMap = {};

//        this.getControl = this.getControl.bind(this);
        this.getDecor = this.getDecor.bind(this);
    }

    regDecor(context, initData, ID) {
        const key = `${context.kind}::${context.story}`;

        if (!this.contextMap[key]) {
            this.contextMap[key] = {};
        }
        if (!this.contextMap[key][ID]) {
            const ind = Object.keys(this.contextMap[key]).length;
            this.contextMap[key] = {
                ...this.contextMap[key],
                [ID]: {
                    ind,
                    initData,
                },
            };
        }

        logger.info(`key_upd (${ID}):`, this.contextMap[key]);

        const getControl = (enableFn, disableFn) => {
            const maxInd = Object.keys(this.contextMap[key]).length - 1;
            const ind = this.contextMap[key][ID].ind;
            if (ind < maxInd) disableFn();

            logger.log(`Got Control (${key}::${ID}) ind-${ind}:`, this.contextMap[key][ID]);

            const stopControl = () => {
                delete (this.contextMap[key][ID]);
            };
            return stopControl;
        };

        return getControl;
    }

    getDecor(initData, ID) {
        return (storyFn, context) => {
            const getControl = this.regDecor(context, initData, ID);
            return (
              <RootDecorator remote={getControl}>
                <div style={{ backgroundColor: 'grey', color: 'white' }}>
                  <DecorElement initData={initData} />
                  {storyFn()}
                </div>
              </RootDecorator>
            );
        };
    }
}

const addonManager = new AddonManager();

const getID = () => `id${Math.round(Math.random() * 100)}`;

export default function decorator(initData) {
    const deco = addonManager.getDecor(initData, getID());
    logger.info('addDecorator');
    return deco;
}

