import React from 'react';
import { createDecorator, setParameters } from '../src/decorator';
import './config';

const DecoratorUI = ({ context, getStory, theme, info }) => (
  <div>
    Theme: {theme} <br />
    Data: {info} <br />
    {getStory(context)}
  </div>
);

export const withAdk = createDecorator({
  theme: store => store.themes[store.currentTheme],
  info: store => JSON.stringify(store, null, 2)
})(DecoratorUI, { isGlobal: true, priorityOfparams: false });
export const adkParams = setParameters();
