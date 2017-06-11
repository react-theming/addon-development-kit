const ADDON_ID = 'querry';
const config = {
    ADDON_ID,
    ADDON_TITLE: 'Q',
    PANEL_ID: `${ADDON_ID}/no_panels_here`,
    EVENT_ID_INIT: `${ADDON_ID}/q/init`,
    EVENT_ID_DATA: `${ADDON_ID}/q/data`,
    CSS_CLASS: 'addon-querry',
};
export default {
    initData: 'QQQ - this is init data',
    config,
    queryParams: {
        chapter: 'no',
    },
};
