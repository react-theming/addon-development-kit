import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';

import DataInfo from '../dev-dist/index';

storiesOf('Storybook Addon Development Kit', module)
  .add('Stories', () => (
    <div>
      <DataInfo initData={{ preview: 'story1' }} />
    </div>
  ))
  .add('Details', () => (
    <div>
      <DataInfo initData={{ preview: 'story2' }} />
    </div>
  ));

storiesOf('Test/Info', module)
  .add('Stories', () => (
    <div>
      <DataInfo initData={{ preview: 'aaaaaa' }} />
    </div>
  ))
  .add('Details', () => (
    <div>
      <DataInfo initData={{ preview: 'bbbb' }} />
    </div>
  ));
