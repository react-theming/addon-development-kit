/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { storiesOf, action, addDecorator } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';
import { muiTheme } from 'storybook-addon-material-ui';
import { WithNotes } from '@kadira/storybook-addon-notes';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

import decorator from '../../src/decorator';

import App from '../App';
import Header from '../Header';
import Intro from '../Intro';
import '../App.css';

const reqThemes = require.context('../.themes/', true, /.json/);
const themesList = [];
reqThemes.keys().forEach((filename) => {
    themesList.push(reqThemes(filename));
});

/** note: decorators
 *  You can add decorator globally:
 *  addDecorator(muiTheme(greyTheme));
 *  You can pass a single object or an array of themes
 */

// addDecorator(decorator('Global decorator'));

storiesOf('No decorator', module)
    .add('Example1', () => (
        <div className="example-component">
            <p>
               No local decorator here ss ss ss
            </p>
        </div>
    ))
    .add('Example2', () => (
        <div className="example-component">
            <p>
               No local decorator here
            </p>
        </div>
    ))

storiesOf('Podda App1', module)
    .addDecorator(decorator('Decor111'))
    .add('Example1', () => (
        <div className="example-component">
            <p>
               It's an example component inside decorator (111)
            </p>
        </div>
    ))
    .add('Example2', () => (
        <div className="example-component">
            <p>
               VVV It's an example component inside decorator (333 dsd sd s s sss)
            </p>
        </div>
    ));

storiesOf('Podda App2', module)
    .addDecorator(decorator('Decor222'))
    .add('Example3', () => (
        <div className="example-component">
            <p>
                It's an example component inside decorator kkk jjj
            </p>
        </div>
    ))

    .add('Example4', () => (
        <div className="example-component">
            <p>
                It's an example component inside decorator (111 sd)
            </p>
        </div>
    ));

storiesOf('Knobs1', module)
    .addDecorator(withKnobs)
    .add('Knob1', () => (
        <header>
            <p>{text('Title1', 'Knob1.Title')}!!!</p>
            <p>{text('Subtitle1', 'Knob1.SubTitle')}</p>
        </header>
    ))
    .add('Knob2', () => (
        <header>
            <p>{text('Title2', 'Knob2.Title')}</p>
            <p>{text('Subtitle2', 'Knob2.SubTitle')}</p>
        </header>
    ));


storiesOf('Knobs2', module)
    .addDecorator(withKnobs)
    .add('Knob3', () => (
        <header>
            <p>{text('Title3', 'Knob1.Title')}</p>
            <p>{text('Subtitle3', 'Knob1.SubTitle')}</p>
        </header>
    ))
    .add('Knob4', () => (
        <header>
            <p>{text('Title4', 'Knob2.Title')}</p>
            <p>{text('Subtitle4', 'Knob2.SubTitle')}</p>
        </header>
    ));



function withNote(note, child) {
    return (
      <WithNotes notes={note}>{child || null}</WithNotes>
    );
}
