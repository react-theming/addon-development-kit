[![npm version](https://badge.fury.io/js/%40storybook%2Faddon-devkit.svg)](https://badge.fury.io/js/%40storybook%2Faddon-devkit)
![npm](https://img.shields.io/npm/dt/@storybook/addon-devkit)

# Storybook ADK

> Some of features originally introduced in this package are already available via Storybook API. Please consider https://github.com/storybookjs/addon-kit first, which is a simple Github repo template that uses the latest addon APIs.

This kit provides additional middleware for Storybook API and can be used for creating addons based on this.

Simplifies the addons creation. Keeps in sync addon's data through the channel. Provides intelligent blocks for creating addon UI. Offer simple API for registering addons and creating decorators. It's a base to quickly build your custom brand new awesome addon

## Features

- Hides under the hood all the complex issues of communication through the channel and data synchronization while switching stories.
- Connects your addon components to your addon store via HOCs and updates it only when data changes
- Divides addon store data to global and local. Tracks story surfing in order to switch appropriate local data both on manager and preview sides simultaneously
- Keeps immutable init data and overridable data which you mutate via actions
- Provides redux like approach to deal with your addon store via selectors and actions (but don't worry, the default action just simply override your data)
- Allows to connect any amount of pannels, buttons and any other addon types to the single addon store
- Offers UI container which automatically reflects the aspect ratio of addon panel. Extremely useful to create addon UI responsive for vertical and horizontal panel positions
- Includes Typescript definitions

## Usage

```shell
npm i --save @storybook/addon-devkit
```

```js
import {
  register,
  createDecorator,
  setParameters,
  setConfig,
  Layout,
  Block,
} from '@storybook/addon-devkit'

```

## API

### Register manager side Addon panel

HOC to register addon UI and connect it to the addon store.

```js
// in your addon `register.js`
import { register } from '@storybook/addon-devkit'

register(
  {
    ...selectors,
  },
  ({ global, local }) => ({
    ...globalActions,
    ...localActions,
  })
)(AddonPanelUI);


```

where `selectors` is an object with functions like:

```js
{
  deepData: store => store.path.to.deep.store.data,
}

```

and `actions` could be "global" and "local". Global actions affects on the global part of store, while local only on the data related to the current story.

```js

({ global, local }) => ({
    // action to manipulate with common data
    increase: global(store => ({
      ...store,
      index: store.index + 1,
    })),
    // action to manipulate with current story data
    // usage: setBackground('#ff66cc')
    setBackground: local((store, color) => ({
      ...store,
      backgroundColor: color,
    })),
    // action to override data
    // usage: update({...newData})
    update: global(),
  })

```

AddonPanelUI - is your component which appears on addon panel when you select appropriate tab
> Note: the HOC automatically track the `active` state of addon and shows it only when it's necessary

register HOC will pass the follow props to the `AddonPanelUI` component:

```js
<AddonPanelUI
  {...actions} // generated actions
  {...selectors} // selected pieces of store
  api={api} // storybook API object
  active={active} // you don't need to do anything with it
  store={store} // entire store. prefer to use selectors
  kind={kind} // current story kind
  story={story} // current story
  ADDON_ID={ADDON_ID}
  PANEL_ID={PANEL_ID}
  PANEL_Title={PANEL_Title} // Title on the addon panel
  rect={rect} // dimensions of panel area
/>

```

As soon as you change the store via actions both the `AddonPanelUI` and `storyDecorator` will be re-rendered with the new data.

Same if the data will come from the story - it will be updated

After initialization HOC will wait for init data from story and only after it will render UI


### Create stories side decorator

HOC to create decorator and connect it to the addon store.

```js
// in your addon `decorator.js`
import { createDecorator } from '@storybook/addon-devkit'

export const withMyAddon = createDecorator({
    ...selectors,
  },
  ({ global, local }) => ({
    ...globalActions,
    ...localActions,
  })
)(DecoratorUI, { isGlobal });

```

so then you can use your decorator this way:

```js
// stories.js

import React from 'react';
import { storiesOf, addDecorator, addParameters } from '@storybook/react';
import { withMyAddon, myAddonParams } from 'my-addon';

// add decorator globally
addDecorator(withMyAddon({ ...initData }))
addParameters(myAddonParams({ ...globalParams }))

storiesOf('My UI Kit', module)
  // ...or add decorator locally
  .addDecorator(withMyAddon({ ...initData }))
  .add(
    'Awesome',
    () => <Button>Make Awesome</Button>,
    myAddonParams({ ...localParams })
  )

```

`DecoratorUI` could look like this:

```js

const DecoratorUI = ({ context, getStory, selectedData }) => (
  <div>
    <h1>Title: {selectedData}</h1>
    {getStory(context)}
  </div>
);
```

When `isGlobal = true` decorator will consider all passing data as global

>Note: addon parameters will be merged with init data and available both for decorator and panel selectors


### Pass parameters to addon

Creates functions for passing parameters to your addon

See usage above

```js
import { setParameters } from '@storybook/addon-devkit'

export const myAddonParams = setParameters()

```

### Addon config

In order to create addon you need to specify some unique parameters like event name, addon title, parameters key and others. They should be same on manager and preview sides. If you don't specify them addon-devkit will use the default ones.
To specify your own use `setConfig`:

```js
import { setConfig } from '@storybook/addon-devkit';

setConfig({
  addId: 'dev_adk',
  panelTitle: 'ADK DEV'
});

```
You should run it **before** using `register`, `setParameters` and `createDecorator`

>Note: don't forget to use setConfig both in on manager and preview sides with the same parameters


### Addon panel UI components

Components to organize UI in a row when panel in bottom position and in column when it on the right side

```js
import { Layout, Block, register } from '@storybook/addon-devkit';
import { styled } from '@storybook/theming';
import './config'

const LayoutBlock = styled(Layout)`
  ...styles
`

const AddonBlock = styled(Block)`
  ...styles
`

const AddonPanel = () => (
  <LayoutBlock>
    <AddonBlock size={200}>
      {UI1}
    </AddonBlock>
    <AddonBlock>
      {UI2}
    </AddonBlock>
    <AddonBlock>
      {UI3}
    </AddonBlock>
  </LayoutBlock>
)

register()(AddonPanel)

```

`<Layout>` has `display: flex` with `flex-direction: row` when bottom and `flex-direction: column` in right side.

You can specify the size of `<Block>`. In case of horizontal layout it will be the width, in case of vertical - height of element.

Otherwise it will have `flex-grow: 1`

## Credits

<div align="left" style="height: 16px;">Created with ❤︎ to <b>React</b> and <b>Storybook</b> by <a href="https://twitter.com/UsulPro">Oleg Proskurin</a>  [<a href="https://github.com/react-theming">React Theming</a>]
</div>
