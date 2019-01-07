import React from 'react';
import { register } from '../dist/register';

const AddonPanel = ({ api, active, data, setData, kind, story }) => {
  console.log(api);
  return (
    <div>
      <p>Panel UI (active: {JSON.stringify(active)})</p>

      <p>kind: {kind}</p>
      <p>story: {story}</p>
      <p>data ({JSON.stringify(data)})</p>
      <button onClick={() => setData({ foo: 'bar' })}>setData</button>
    </div>
  );
};

register(AddonPanel);
