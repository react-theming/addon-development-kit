import React from 'react';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOff; // note: debug

export default class PanelComponent extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        logger.info(`* constructor: ${props.initData}`);
    }
    componentDidMount() {
        logger.info(`* componentDidMount: ${this.props.initData}`);
        this.unSubscribe = this.props.onReady();
    }
    componentWillUnmount() {
        logger.info(`* componentWillUnmount: ${this.props.initData}`);
        this.unSubscribe();
    }
    render() {
        const { label, index, theme, data, onVote, onLabel, onReady, initData, setData } = this.props;
        return (
            <div>
                <p>initData: <i>{initData}</i>, Data: <i>{data}</i></p>
                <p>Label: <i>{label}</i>, Index: <i>{index}</i></p>
                <button onClick={onVote(3)}>Vote</button>
                <button onClick={onLabel('Alpha', 28)}>Alpha</button>
                <button onClick={onLabel('Betta', 133)}>Betta</button>
                <button onClick={setData(initData)}>
                    setData
                </button>
            </div>
        );
    }
}

