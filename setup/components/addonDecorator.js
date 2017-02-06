import React from 'react';

export default function ({ label, index, story, onClick }) {
    return (
    <div>
       <h4>Addon decorator:</h4>
        Label: {label}, index: {index} <button onClick={onClick('addon', 777)}>set</button>
        {story}
    </div>);
}
