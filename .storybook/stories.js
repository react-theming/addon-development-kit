import React from 'react';

import { storiesOf, addDecorator, addParameters } from '@storybook/react';
import addons, { makeDecorator } from '@storybook/addons';

import { withAdk, adkParams } from '../dev/withAdk';

/**
 * todo:
 * 1. Add themes via one global method from `config.js` with global decorator inside
 * 2. Set additional theme via addParameters (global/local)
 * 3. Select current theme via parameters (to override)
 * 4. Keep current theme in url
 *
 */

addParameters(adkParams({ themes: ['theme1', 'theme2'], currentTheme: 0 }));

storiesOf('Storybook Addon Development Kit', module)
  .addDecorator(withAdk({ mainColor: 'green' }))
  .add(
    'Stories',
    () => {
      return (
        <div>
          <button>Button 1</button>
        </div>
      );
    },
    adkParams({ currentTheme: 33 })
  )
  .add(
    'Stories2',
    () => {
      console.log('Render Button 2');
      return (
        <div>
          <button>Button 2</button>
        </div>
      );
    },
    adkParams({ currentTheme: 0 })
  );
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
