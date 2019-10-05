import React from 'react';
import { styled } from '@storybook/theming';
import { register } from '../src/register';
import { Layout, Block } from '../src/Layout';
import './config';


const LayoutBlock = styled(Layout)`
  padding: 0px;
  border: red 1px solid;
  label: layout-with-styles;
`

const AddonBlock = styled(Block)`
  margin: 2px;
  padding: 4px;
  border: 2px solid gray;
  font-size: 14px;
  background-color: pink;
  label: block-with-styles;
`

const AddonPanel = ({
  api,
  kind,
  indInc,
  indDec,
  update,
  theme,
  data,
  comment,
  request
}) => {
  return (
    <LayoutBlock style={{ padding: 0 }}>
      <AddonBlock size={200}>
        kind: {kind}
        <br />
        <button onClick={() => indInc()}> + </button>
        <button onClick={() => indDec()}> - </button>
        <br />
        <button onClick={() => update({ themes: ['T1', 'T2', 'T3'] })}>
          Update
        </button>
        <button onClick={() => comment()}> comment </button>
        <button onClick={() => request()}> request </button>
      </AddonBlock>
      {/* <Block style={blockStyle}>
        <small>{JSON.stringify(api.getCurrentStoryData())}</small>
      </Block> */}
      <AddonBlock>
        channel store data: <br /> ({JSON.stringify(data)})
      </AddonBlock>
      {/* <Block style={blockStyle}>data ({JSON.stringify(rect, null, 2)})</Block> */}
    </LayoutBlock>
  );
};

const AsyncRequest = () => new Promise(resolve => {
  setTimeout(() => resolve(), 3000);
})

register(
  {
    themeInd: store => store.currentTheme,
    themeList: store => store.themes,
    theme: store => store.themes[store.currentTheme],
    data: store => store
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
    comment: local(store => ({
      ...store,
      comment: 'comment',
    })),
    request: local(async store => {
      await AsyncRequest();
      return ({
        ...store,
        result: 'Request Success',
      })
    }),
  })
)(AddonPanel);

/* Plain object example

register({
  nextInd: (store) => ({ ...store, currentTheme: store.currentTheme + 1 }),
  update: null,
})(AddonPanel);

*/
