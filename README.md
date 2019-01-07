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

`yarn prepare` - compiles `src` to the `dist` folder by babel

`yarn dev` - watches for changes in `src`

`yarn prepare-dev` - compiles `dev` to the `dev-dist` folder by babel

`yarn start` - starts Storybook

folders:

`src` - source of the addon

`dev` - addon usage example
