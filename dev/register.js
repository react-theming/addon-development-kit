import React from 'react';
import { register } from '../src/register';

const blockStyle = {
  margin: 2,
  padding: 4,
  border: '2px solid gray',
};

const AddonPanel = ({
  api,
  data,
  setData,
  kind,
  story,
  rect,
  Layout,
  Block,
}) => {
  return (
    <Layout style={{ padding: 0 }}>
      <Block style={{ ...blockStyle, minWidth: 200 }}>kind: {kind}</Block>
      <Block style={blockStyle}><small>{JSON.stringify(api.getCurrentStoryData())}</small></Block>
      <Block style={blockStyle} size={200}>
        channel store data: <br/> ({JSON.stringify(data)})
      </Block>
      <Block style={blockStyle}>
        <button onClick={() => setData({ panel: 'bar' })}>setData</button>
      </Block>
      <Block style={blockStyle}>data ({JSON.stringify(rect, null, 2)})</Block>
    </Layout>
  );
};

register(AddonPanel);
