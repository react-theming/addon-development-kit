// note: addons, panels and events get unique names using a prefix
import register from './register';

export const ADDON_ID = 'sm/storybook-adk';
export const ADDON_TITLE = 'PODDA';
export const PANEL_ID = `${ADDON_ID}/adk-panel`;
export const EVENT_ID_INIT = `${ADDON_ID}/adk-event/init`;
export const EVENT_ID_DATA = `${ADDON_ID}/adk-event/data`;
export const CSS_CLASS = 'adk-ui';

export { decorator, buidDecorator, addonManager } from './store/decorator'; // fixme:
export { addonComposer } from './store/addonComposer';
export { register };
