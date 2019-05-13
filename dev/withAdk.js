import React from 'react';
import { createDecorator, setParameters } from '../src/decorator';
import './config';

const DecoratorUI = ({ context, getStory, theme }) => (
  <div>
    Theme: {theme} <br />
    {getStory(context)}
  </div>
);

export const withAdk = createDecorator({
  theme: store => store.themes[store.currentTheme],
})(DecoratorUI, { isGlobal: true });
export const adkParams = setParameters();
