import ChannelStore, { getSingleStore } from '../ChannelStore';
import { getConfig } from '../config';

jest.mock('@storybook/addons', () => {
  const initMockinfo = {
    onEvent: jest.fn(),
    reset() {
      this.onEvent.mockReset();
    },
  };
  const channel = {
    on: (event, cb) => initMockinfo.onEvent([event, cb]),
    mock: () => initMockinfo,
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
  }
);
