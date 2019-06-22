const channel = {
  on: (event, cb) => console.log('on', event),
};

console.log('TCL: channel', channel);

const addons = {
  getChannel: () => channel,
};

export default addons;
