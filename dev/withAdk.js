import React from 'react';
import { createDecorator, setParameters } from '../src/decorator';
import './config';

const DecoratorUI = ({ context, getStory, theme, info }) => (
  <div>
    Theme: {theme} <br />
    Data: {info} <br />
    {getStory({ customAddonArgs: { result: 'foo' } })}
  </div>
);

export const withAdk = createDecorator(
  {
    theme: store => store.themes[store.currentTheme],
    info: store => JSON.stringify(store, null, 2),
  },
  {},
  {
    themeWithFn: (params, { theme }) => ({ fn: () => theme }),
  }
)(DecoratorUI, { isGlobal: true });
export const adkParams = setParameters();
