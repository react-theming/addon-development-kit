# React Storybook Addon Development Kit

Based on [React Komposer](https://github.com/arunoda/react-komposer) and [Podda](https://github.com/arunoda/podda) addon core which solves the problem of communication between addons panel side and decorators side. It provides an ability to create story decorators controlled from the addon panel.

> Since it's in the early stages some things could be changed

## Features 💫

1 Keeps synchronous **store** on both sides: addon panel and decorator

2 Easy to create own components subscribed to addon's **store**

3 Each decorator has own **store** instance and init settings, the panel reflects an active decorator

4 Decorators keep the **store** during `Hot Module Replacement`

5 Possible to set **api**, **default store data** and **React Components** to decorators and panel

6 Story decorators can **override** the global ones. So it's possible to use them together

## Install

if you building own Storybook addon:

`npm i storybook-adk --save`

if just using Storybook as a development tool:

`npm i storybook-adk --save-dev`

## Usage

_soon_

## Contribution guide:

```shell
git clone https://github.com/sm-react/storybook-adk.git
cd storybook-adk
yarn
yarn start
```

when it outputs like:


```shell
React Storybook started on => http://localhost:9001/

webpack built f2e66101efa945043d60 in 21615ms
```

open http://localhost:9001/


#### Store and channel

`src/store/store.js`

We using [Podda](https://github.com/arunoda/podda) as a simple data store. Panel and decorators need to use a channel for communication. Any changes of store are sent via channel, that's why both stores always synchronized. Root components (of panel or decorators) subscribe to store changes so they shows an actual data. Each side can initiate the connection at any time, but only one (the last) connection is enabled. That's why we can select another Story kind with own decorator which initiate a new connection when `componentWillMount` so panel will follow it. When a decorator `componentWillUnmount`, it stops the channel communication and panel reflects it. This principle works even when we use nested decorators: the innder decorator will override the global one.

#### Decorators

`src/store/decorator.js`

We pass `initData` to decorators when create them and keep decorator's store in module closure (own for each Story kind). So it's availible after HMR. The decorator root component solves all tasks about channel interaction and enabling/disabling nested decorators. It will render the addon decorator component as a child which you can pass in oder to customize your own decorator.

#### Composer

`src/store/composer.js`

Here we use [React Komposer](https://github.com/arunoda/react-komposer) to subscribe to store changes. It allows the root component `src/store/container.js` (Panel and decorator) to keep the actual state of current store. We pass some API to this component from store.

#### Container

`src/store/container.js`

It's a root component using both for panel and decorator. It takes props from composer `src/store/composer.js`. Wraps and reders custom addon component.

#### API

`src/store/api.js`

It's possible to add an API to interact with the addon store. API function takes a `poddaStore` as a first argument and any number custom arguments. E.g.

```js
setLabel(poddaStore, name, ind) {
    poddaStore.update(state => ({ index: ind, label: name }));
}
```

To use it in your component you need to pass it via composer:

```js
function dataLoader(props, onData, { addonStore, apiMap }) {

    const sendData = (storeData) => {
        const propsToChild = {
            label: storeData.label,
            index: storeData.index,
            onLabel: apiMap.setLabel, 
        };
        onData(null, propsToChild);
    };

    const stopSubscription = addonStore.subscribe(sendData);

    sendData(addonStore.getAll());

    return stopSubscription;
}
```

then you can use it this way:

```
const { label, index, onLabel } = props;
return (
<div>
    <p>Label: <i>{label}</i>, Index: <i>{index}</i></p>
    <button onClick={onLabel('Alpha', 28)}>Alpha</button>
</div>);
```

#### Addon Composer

`src/store/addonComposer.js`

Allows to create custom addon components subscribed to the store. _It's under development now_

---


🙋 any contributions will be appreciated! 🎆🎆🎆

### Credits

Created in [smARTLight](https://github.com/sm-react) by [UsulPro](https://twitter.com/UsulPro)

Scaffolded by [Storybook Boilerplate Project](https://github.com/sm-react/react-theming#storybook-boilerplate-project)
