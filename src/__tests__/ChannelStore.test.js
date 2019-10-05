import ChannelStore, { getSingleStore } from '../ChannelStore';
import { getConfig } from '../config';

jest.mock('@storybook/addons', () => {
  const mockInfo = {
    onEvent: jest.fn(),
    removeEvent: jest.fn(),
    emit: jest.fn(console.log),
    reset() {
      this.onEvent.mockReset();
      this.removeEvent.mockReset();
      this.emit.mockReset();
    },
  };
  const channel = {
    on: (event, cb) => mockInfo.onEvent([event, cb]),
    removeListener: (event, cb) => mockInfo.removeEvent([event, cb]),
    emit: (event, data) => mockInfo.emit([event, data]),
    mock: () => mockInfo,
  };
  return {
    getChannel: () => channel,
  };
});

const config = getConfig();
const configWith = props => ({ ...config, ...props });
const whatSide = isPanel => (isPanel ? 'Panel-Side' : 'Decorator-Side');

describe.each([{ isPanel: false }, { isPanel: true }])(
  'ChannelStore %o',
  ({ isPanel }) => {
    it(`should init ${whatSide(isPanel)} Store by default`, () => {
      const store = new ChannelStore(configWith({ isPanel }));
      store.channel = null; // exclude mocked channel from snapshot
      expect(store).toMatchInlineSnapshot(
        `
      ChannelStore {
        "EVENT_ID_BACK": "adk/event/back",
        "EVENT_ID_DATA": "adk/event/data",
        "EVENT_ID_INIT": "adk/event/init",
        "_createAction": [Function],
        "channel": null,
        "connect": [Function],
        "createGlobalAction": [Function],
        "createLocalAction": [Function],
        "defaultReducer": [Function],
        "disconnect": [Function],
        "emit": [Function],
        "id": undefined,
        "init": [Function],
        "initData": Object {},
        "isPanel": ${isPanel},
        "name": "store",
        "onConnected": [Function],
        "onConnectedFn": [Function],
        "onData": [Function],
        "onDataChannel": [Function],
        "onInitChannel": [Function],
        "removeData": [Function],
        "removeInit": [Function],
        "selectData": [Function],
        "selectorId": null,
        "send": [Function],
        "sendInit": [Function],
        "store": Object {
          "global": Object {
            "init": Object {},
            "over": Object {},
          },
        },
        "subscriber": [Function],
      }
    `
      );
    });

    it(`should init ${whatSide(isPanel)} Store`, () => {
      const store = new ChannelStore(configWith({ isPanel }));
      expect(store).toHaveProperty('isPanel', isPanel);
    });

    it(`should connect to channel from ${whatSide(isPanel)}`, () => {
      const store = new ChannelStore(configWith({ isPanel }));
      store.channel.mock().reset();
      const onConnected = jest.fn();
      store.onConnected(onConnected);
      store.connect();
      expect(onConnected).toHaveBeenCalledTimes(1);
      expect(store.channel.mock().onEvent).toHaveBeenNthCalledWith(
        1,
        isPanel
          ? [store.EVENT_ID_INIT, store.onInitChannel]
          : [store.EVENT_ID_BACK, store.onDataChannel]
      );
      if (isPanel) {
        expect(store.channel.mock().onEvent).toHaveBeenNthCalledWith(2, [
          store.EVENT_ID_DATA,
          store.onDataChannel,
        ]);
      }
    });

    it(`should disconnect from channel on ${whatSide(isPanel)}`, () => {
      const store = new ChannelStore(configWith({ isPanel }));
      store.channel.mock().reset();
      store.connect();
      store.disconnect();

      expect(store.channel.mock().removeEvent).toHaveBeenCalledTimes(2);

      expect(store.channel.mock().removeEvent).toHaveBeenNthCalledWith(1, [
        store.EVENT_ID_INIT,
        store.onInitChannel,
      ]);

      expect(store.channel.mock().removeEvent).toHaveBeenNthCalledWith(2, [
        isPanel ? store.EVENT_ID_DATA : store.EVENT_ID_BACK,
        store.onDataChannel,
      ]);
    });

    describe.each([false, true])(
      'should receive and send data to channel (isGlobal: %s)',
      isGlobal => {
        const storyId = isGlobal
          ? null
          : 'storybook-addon-development-kit--stories';
        let store;
        beforeEach(() => {
          store = new ChannelStore(configWith({ isPanel, storyId }));
          store.channel.mock().reset();
          store.connect();
        });

        it('should trigger on init channel message', () => {
          const onData = jest.fn();
          store.onData(onData);
          const initData = {
            id: storyId,
            data: ['theme1', 'theme2', 'theme3'],
          };
          store.onInitChannel(initData);

          expect(onData).toHaveBeenCalledTimes(1);

          expect(store.channel.mock().emit).toHaveBeenCalledTimes(1);

          expect(store.channel.mock().emit).toHaveBeenNthCalledWith(1, [
            isPanel ? store.EVENT_ID_BACK : store.EVENT_ID_DATA,
            {
              data: {
                global: { init: storyId ? {} : initData.data, over: {} },
                ...(storyId && {
                  [storyId]: {
                    init: initData.data,
                    over: {},
                  },
                }),
              },
              id: storyId,
            },
          ]);
        });

        it('should trigger on data channel message', () => {
          const onData = jest.fn();
          store.onData(onData);

          const initData = {
            id: storyId,
            data: ['theme1', 'theme2', 'theme3'],
          };
          store.onInitChannel(initData);

          const newData = {
            id: storyId,
            data: ['T1', 'T2', 'T3'],
          };
          store.onDataChannel(newData);
          if (isPanel) {
            const storeData = {
              init: initData.data,
              over: newData.data,
            };
            expect(store.store).toEqual({
              global: isGlobal
                ? storeData
                : {
                    init: {},
                    over: {},
                  },
              ...(!isGlobal && {
                [storyId]: storeData,
              }),
            });
          } else {
            expect(store.store).toEqual(newData.data);
          }
        });
      }
    );
  }
);

describe('ChannelStore Actions', () => {
  let store;
  const initData = {
    index: 0,
    items: [
      'apple',
      'banana',
      'orange',
      'pear',
      'cherry',
      'tomato',
      'cucumber',
    ],
  };
  const initWith = props => ({ ...initData, ...props });
  const onData = jest.fn();

  beforeEach(() => {
    store = new ChannelStore(configWith({ isPanel: true, initData }));
    store.channel.mock().reset();
    onData.mockReset();
    store.onData(onData);
    store.connect();
  });

  const reducer = (store, step) => ({
    ...store,
    index: store.index + step,
  });

  it('should create global action / call subscriber / send event', async () => {
    const incAction = store.createGlobalAction(reducer);
    await incAction(2);
    const newData = initWith({ index: 2 });
    const newStore = {
      global: {
        init: initData,
        over: newData,
      },
    };

    expect(store.store).toEqual(newStore);

    expect(onData).toHaveBeenCalledTimes(1);

    expect(onData).toHaveBeenNthCalledWith(1, newData);

    expect(store.channel.mock().emit).toHaveBeenCalledTimes(1);

    expect(store.channel.mock().emit).toHaveBeenNthCalledWith(1, [
      store.EVENT_ID_BACK,
      {
        data: newStore,
        id: undefined,
      },
    ]);
  });

  test.todo('create action with default reducer');
  test.todo('create local action');
});

describe('getSingleStore', () => {
  it('should create and refer to single store', () => {
    const panelStore = getSingleStore({ isPanel: true });
    const iconStore = getSingleStore();

    expect(panelStore).toBe(iconStore);
  });
});
