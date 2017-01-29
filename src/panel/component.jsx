import React from 'react';

import { loggerOn, loggerOff } from '../utils/logger'; // eslint-disable-line
const logger = loggerOn; // note: debug

export default class PanelComponent extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        logger.info(`* constructor: ${Object.keys(props.src)}`);
    }
    componentDidMount() {
        logger.info(`* componentDidMount: ${Object.keys(this.props.src)}`);
        this.unSubscribe = this.props.onReady();
    }
    componentWillUnmount() {
        logger.info(`* componentWillUnmount: ${Object.keys(this.props.src)}`);
        this.unSubscribe();
    }
    render() {
        const { label, index, theme, onVote, onLabel, onReady, src } = this.props;
        return (
            <div>
                <p>{Object.keys(src)}</p>
                <p>Label: {label}</p>
                <p>Index: {index}</p>
                <button onClick={onVote(3)}>Vote</button>
                <button onClick={onLabel('Alpha', 28)}>Alpha</button>
                <button onClick={onLabel('Betta', 133)}>Betta</button>
                <button onClick={() => {
                    this.unSubscribe();
                    this.unSubscribe = this.props.onReady();
                }}>
                    Master
                </button>
            </div>
        );
    }
}

