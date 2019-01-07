import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';

import DataInfo from '../dev-dist/index';

storiesOf('Storybook Addon Development Kit', module)
  .add('Stories', () => (
    <div>
      <DataInfo initData={{ info: 'story1' }} />
    </div>
  ))
  .add('Details', () => (
    <div>
      <DataInfo initData={{ info: 'story2' }} />
    </div>
  ));

storiesOf('Test/Info', module)
  .add('Stories', () => (
    <div>
      <DataInfo initData={{ info: 'aaaaaa' }} />
    </div>
  ))
  .add('Details', () => (
    <div>
      <DataInfo initData={{ info: 'bbbb' }} />
    </div>
  ));
