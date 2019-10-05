const channel = {
  on: (event, cb) => console.log('on', event),
};

const addons = {
  getChannel: () => channel,
};

export default addons;
