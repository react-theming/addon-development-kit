import React from 'react';

export default class PanelComponent extends React.Component {
    componentDidMount() {
        this.unSubscribe = this.props.onReady();
    }
    componentWillUnmount() {
        this.unSubscribe();
    }
    render() {
        const { label, index, theme, onVote, onLabel, onReady } = this.props;
        return (
            <div>
                <p>This is Dummy Panel</p>
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

