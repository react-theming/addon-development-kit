# Storybook Addon Development Kit

Keeps in sync addon's data through the channel

## API

### Addons Panel (Manager)

**register(PanelComponent)**

HOC that adds your PanelComponent to the addons panel. It will register it and provides follow props:

- **kind**, a selected story kind name
- **story**, a selected story name
- **api**, manager API
- **data**, current channel data (associated with selected story)
- **setData**, callback to set data
- **rect**, geometric dimensions of the addon area,
- **Layout**, Helper Component with `display: flex` to make addon's markup to fit in portrait or landscape mode by switching `flex-direction`. Could be used alone or together with Blocks.
- **Block**, Helper Block to use inside Layout and provides flex items behavior in portrait and landscape mode

>see how works Layout and Blocks in the Live Demo

example:

```js
// your addon register.js

import React from 'react';
import { register } from '../dist/register';

const AddonPanel = ({ api, data, setData, kind, story }) => (
  <div>
    <p>kind: {kind}</p>
    <p>story: {story}</p>
    <p>data ({JSON.stringify(data)})</p>
    <button onClick={() => setData({ foo: 'bar' })}>setData</button>
  </div>
);

register(AddonPanel);
```

Then users can add your addon to Storybook like this:

```js
// user's .storybook/addons.js

import 'your-addon/register';
```

## Develop

scripts:

`yarn start` - compiles everything, starts Storybook and watches for changes

`yarn prepare` - compiles `src` to the `dist` folder by babel

`yarn prepare-dev` - compiles `dev` to the `dev-dist` folder by babel


folders:

`src` - source of the addon

`dev` - addon usage


how to develop:

`yarn start` and edit files in `src` folder. To test API see `dev` folder.
