import React from 'react';
import { register } from '../src/register';
import './config';

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
  indInc,
  indDec,
  update,
}) => {
  return (
    <Layout style={{ padding: 0 }}>
      <Block style={{ ...blockStyle, minWidth: 50 }} size={200}>
        kind: {kind}
        <br />
        <button onClick={() => indInc()}> + </button>
        <button onClick={() => indDec()}> - </button>
        <br />
        <button onClick={() => update({ themes: ['T1', 'T2', 'T3'] })}>
          Update
        </button>
      </Block>
      {/* <Block style={blockStyle}>
        <small>{JSON.stringify(api.getCurrentStoryData())}</small>
      </Block> */}
      <Block style={blockStyle}>
        channel store data: <br /> ({JSON.stringify(data)})
      </Block>
      {/* <Block style={blockStyle}>data ({JSON.stringify(rect, null, 2)})</Block> */}
    </Layout>
  );
};

register(
  {
    themeInd: store => store.currentTheme,
    themeList: store => store.themes,
    theme: store => store.themes[store.currentTheme]
  },
  ({ global, local }) => ({
    indInc: global(store => ({
      ...store,
      currentTheme: store.currentTheme + 1,
    })),
    indDec: global(store => ({
      ...store,
      currentTheme: store.currentTheme - 1,
    })),
    update: global(),
  })
)(AddonPanel);

/* Plain object example

register({
  nextInd: (store) => ({ ...store, currentTheme: store.currentTheme + 1 }),
  update: null,
})(AddonPanel);

*/
