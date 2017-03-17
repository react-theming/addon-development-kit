// note: addons, panels and events get unique names using a prefix
import register from './register';
import * as addonManager from './store/decorator';
import _initStore from './store/store';

export const ADDON_ID = 'sm/storybook-adk';
export const ADDON_TITLE = 'PODDA';
export const PANEL_ID = `${ADDON_ID}/adk-panel`;
export const EVENT_ID_INIT = `${ADDON_ID}/adk-event/init`;
export const EVENT_ID_DATA = `${ADDON_ID}/adk-event/data`;
export const CSS_CLASS = 'adk-ui';

export { addonComposer } from './store/addonComposer';
export { register };
export { addonManager };

export function initStore(...arg) {
    return _initStore(...arg);
}
