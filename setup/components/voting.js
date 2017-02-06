import React from 'react';

export default function ({ index, onVote }) {
    return (
    <div>
        {`Votes [${index}] `}
        <button onClick={onVote(+1)}>+</button>
        <button onClick={onVote(-1)}>-</button>
    </div>);
}
