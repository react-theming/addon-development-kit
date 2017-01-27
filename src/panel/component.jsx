import React from 'react';

export default function PanelComponent({ label, index, theme, onVote, onLabel }) {
//    console.log(theme);
    return (
        <div>
            <p>This is Dummy Panel</p>
            <p>Label: {label}</p>
            <p>Index: {index}</p>
            <button onClick={onVote(3)}>Vote</button>
            <button onClick={onLabel('Alpha', 28)}>Alpha</button>
            <button onClick={onLabel('Betta', 133)}>Betta</button>
        </div>
    )
}
