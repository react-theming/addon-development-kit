export let ADDON_ID = 'adk';
export let PANEL_ID = `${ADDON_ID}/panel`;
export let PANEL_Title = `${ADDON_ID}/addon`;
export let PARAM_Key = `${ADDON_ID}/parameters`;
export let EVENT_ID_INIT = `${ADDON_ID}/event/init`;
export let EVENT_ID_DATA = `${ADDON_ID}/event/data`;
export let EVENT_ID_BACK = `${ADDON_ID}/event/back`;

export const setConfig = ({
  addId,
  panelId,
  panelTitle,
  paramKey,
  eventInit,
  eventData,
  eventBack,
}) => {
  ADDON_ID = addId || ADDON_ID;
  PANEL_ID = `${ADDON_ID}/panel`;
  PANEL_Title = `${ADDON_ID}/addon`;
  PARAM_Key = `${ADDON_ID}/parameters`;
  EVENT_ID_INIT = `${ADDON_ID}/event/init`;
  EVENT_ID_DATA = `${ADDON_ID}/event/data`;
  EVENT_ID_BACK = `${ADDON_ID}/event/back`;

  PANEL_ID = panelId || PANEL_ID;
  PANEL_Title = panelTitle || PANEL_Title;
  PARAM_Key = paramKey || PARAM_Key;
  EVENT_ID_INIT = eventInit || EVENT_ID_INIT;
  EVENT_ID_DATA = eventData || EVENT_ID_DATA;
  EVENT_ID_BACK = eventBack || EVENT_ID_BACK;
};

export const getConfig = () => ({
  ADDON_ID,
  PANEL_ID,
  PANEL_Title,
  PARAM_Key,
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
})