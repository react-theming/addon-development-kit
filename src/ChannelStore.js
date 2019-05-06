import addons from '@storybook/addons';

const GLOBAL = 'global';

export default class ChannelStore {
  constructor({
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,

    name = 'store',
    initData = {},
    isPanel = false,
    storyId,
  }) {
    this.EVENT_ID_INIT = EVENT_ID_INIT;
    this.EVENT_ID_DATA = EVENT_ID_DATA;
    this.EVENT_ID_BACK = EVENT_ID_BACK;
    this.name = name;
    this.initData = initData;
    this.isPanel = isPanel;
    this.id = storyId;
  }

  store = {
    [GLOBAL]: { init: this.initData || {}, over: {} },
  };
  selectorId = null;

  subscriber = () => {};
  onConnectedFn = () => {};

  channel = addons.getChannel();

  connect = () => {
    if (this.isPanel) {
      this.channel.on(this.EVENT_ID_INIT, this.onInitChannel);
      this.channel.on(this.EVENT_ID_DATA, this.onDataChannel);
    } else {
      this.channel.on(this.EVENT_ID_BACK, this.onDataChannel);
    }
    this.onConnectedFn();
  };

  emit = data =>
    this.channel.emit(this.isPanel ? this.EVENT_ID_BACK : this.EVENT_ID_DATA, {
      data,
      id: this.id,
    });

  init = data => this.channel.emit(this.EVENT_ID_INIT, { data, id: this.id });

  removeInit = () =>
    this.channel.removeListener(this.EVENT_ID_INIT, this.onInitChannel);

  removeData = () =>
    this.channel.removeListener(
      this.isPanel ? this.EVENT_ID_DATA : this.EVENT_ID_BACK,
      this.onDataChannel
    );

  onInitChannel = initData => {
    const { data, id } = initData;
    const selectorId = id || GLOBAL;
    console.log('TCL: ChannelStore -> onConnectedFn -> selectorId', selectorId);
    const selectedData = { ...(this.store[selectorId] || {}) };
    selectedData.init = data;
    selectedData.over = selectedData.over || {};
    this.store[selectorId] = selectedData;
    this.selectorId = selectorId;
    this.subscriber();
    this.send();
  };

  onDataChannel = updData => {
    const { data, id } = updData;
    if (this.isPanel) {
      const selectorId = id || GLOBAL;
      const selectedData = this.store[selectorId];
      selectedData.over = data;
      this.selectorId = selectorId;
    } else {
      this.store = data;
    }

    this.subscriber();
  };

  selectData = () => {
    const id = this.isPanel ? this.selectorId : this.id;

    const { global = {} } = this.store;
    const local = this.store[id] || {};

    const finalData = {
      ...global.init,
      ...local.init,
      ...global.over,
      ...local.over,
    };

    return finalData;
  };

  onData = subscriberFn => {
    this.subscriber = () => {
      const data = this.selectData();
      subscriberFn(data);
    };
  };

  onConnected = onConnectedFn => {
    this.onConnectedFn = onConnectedFn;
  };

  send = () => {
    this.emit(this.store);
  };

  defaultReducer = (store, payload) => ({
    ...store,
    ...payload,
  });

  _createAction = (reducer, getSubId) => {
    return payload => {
      const subId = getSubId();
      const subData = this.store[subId];
      console.log('TCL: ChannelStore -> _createAction -> subId', subId);
      console.log('TCL: ChannelStore -> _createAction -> subData', subData);
      const current = {
        ...subData.init,
        ...subData.over,
      };
      const over = (reducer || this.defaultReducer)(current, payload);
      subData.over = over;

      this.send();
      this.subscriber();
    };
  };

  createGlobalAction = reducer => this._createAction(reducer, () => GLOBAL);
  createLocalAction = reducer =>
    this._createAction(reducer, () => this.selectorId || this.id);

  sendInit = data => {
    console.log('TCL: ChannelStore -> onConnectedFn -> id', this.id);

    this.init(data);
  };

  disconnect = () => {
    this.removeInit();
    this.removeData();
  };
}
