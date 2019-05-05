import addons from '@storybook/addons';

export default class ChannelStore {
  constructor({
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    name = 'store',
    initData = {},
    isPanel = false,
  }) {
    this.EVENT_ID_INIT = EVENT_ID_INIT;
    this.EVENT_ID_DATA = EVENT_ID_DATA;
    this.EVENT_ID_BACK = EVENT_ID_BACK;
    this.name = name;
    this.initData = initData;
    this.isPanel = isPanel;

    // console.log(`New Store Created for ${isPanel ? 'Panel' : 'Preview'}`);
  }

  store = this.initData;

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
    this.channel.emit(
      this.isPanel ? this.EVENT_ID_BACK : this.EVENT_ID_DATA,
      data
    );

  init = data => this.channel.emit(this.EVENT_ID_INIT, data);

  removeInit = () =>
    this.channel.removeListener(this.EVENT_ID_INIT, this.onInitChannel);

  removeData = () =>
    this.channel.removeListener(
      this.isPanel ? this.EVENT_ID_DATA : this.EVENT_ID_BACK,
      this.onDataChannel
    );

  onInitChannel = initData => {
    console.log(
      `Channel Store (${
        this.isPanel ? 'Panel' : 'Decorator'
      }) Received Init Data`,
      initData
    );
    this.store = initData;
    this.subscriber(this.store);
  };

  onDataChannel = updData => {
    this.store = {
      ...this.store,
      ...updData,
    };
    this.subscriber(this.store);
  };

  onData = subscriberFn => {
    this.subscriber = subscriberFn;
  };

  onConnected = onConnectedFn => {
    this.onConnectedFn = onConnectedFn;
  };

  send = data => {
    this.store = {
      ...this.store,
      ...data,
    };
    this.emit(this.store);
    this.subscriber(this.store);
  };

  sendInit = data => {
    this.init(data);
  };

  disconnect = () => {
    this.removeInit();
    this.removeData();
  };
}
