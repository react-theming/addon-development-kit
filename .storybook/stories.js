import React from 'react';

import { storiesOf, addDecorator, addParameters } from '@storybook/react';
import addons, { makeDecorator } from '@storybook/addons';

import { keepInfo } from '../dev/index';

/**
 * todo:
 * 1. Add themes via one global method from `config.js` with global decorator inside
 * 2. Set additional theme via addParameters (global/local)
 * 3. Select current theme via parameters (to override)
 * 4. Keep current theme in url
 *
 */
const withAdk = initData => (getStory, context) => {
  return (
    <div>
      ADK: <br />
      <p>{JSON.stringify(context, null, 2)}</p>
      Params: <br />
      <p>{JSON.stringify(context.parameters.themes_id, null, 2)}</p>
      {getStory(context)}
    </div>
  );
};

addParameters({themes_id: ['theme1', 'theme2']})

storiesOf('Storybook Addon Development Kit', module)
  .addDecorator(withAdk({ mainColor: 'green' }))
  .add('Stories', () => (
    <div>
      <button>Button 1</button>
    </div>
  ))
  .add('Stories2', () => (
    <div>
      <button>Button 2</button>
    </div>
  ));
//   .add('Details', () => (
//     <div>
//       <DataInfo initData={{ preview: 'story2' }} />
//     </div>
//   ));

// storiesOf('Test/Info', module)
//   .add('Stories', () => (
//     <div>
//       <DataInfo initData={{ preview: 'aaaaaa' }} />
//     </div>
//   ))
//   .add('Details', () => (
//     <div>
//       <DataInfo initData={{ preview: 'bbbb' }} />
//     </div>
//   ));
