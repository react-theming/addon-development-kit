import React from 'react';

export default function DecoratorComponent({ label, index, theme, onVote }) {
    return (
        <div>
            <p>This is Decorator</p>
            <p>Label: {label}</p>
            <p>Index: {index}</p>
            <button onClick={onVote(-6)}>Vote</button>
        </div>
    )
}
