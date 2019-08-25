import { setConfig, getConfig } from '../config';

describe('config', () => {
  it('should get default config', () => {
    const config = getConfig();
    expect(config).toMatchInlineSnapshot(`
            Object {
              "ADDON_ID": "adk",
              "EVENT_ID_BACK": "adk/event/back",
              "EVENT_ID_DATA": "adk/event/data",
              "EVENT_ID_INIT": "adk/event/init",
              "PANEL_ID": "adk/panel",
              "PANEL_Title": "adk/addon",
              "PARAM_Key": "adk/parameters",
            }
        `);
  });

  it('should set config', () => {
    setConfig({ addonId: 'test' });
    expect(getConfig()).toMatchInlineSnapshot(`
      Object {
        "ADDON_ID": "test",
        "EVENT_ID_BACK": "test/event/back",
        "EVENT_ID_DATA": "test/event/data",
        "EVENT_ID_INIT": "test/event/init",
        "PANEL_ID": "test/panel",
        "PANEL_Title": "test/addon",
        "PARAM_Key": "test/parameters",
      }
    `);

    setConfig({ panelTitle: 'ADK-TEST' });
    expect(getConfig()).toMatchInlineSnapshot(`
      Object {
        "ADDON_ID": "test",
        "EVENT_ID_BACK": "test/event/back",
        "EVENT_ID_DATA": "test/event/data",
        "EVENT_ID_INIT": "test/event/init",
        "PANEL_ID": "test/panel",
        "PANEL_Title": "ADK-TEST",
        "PARAM_Key": "test/parameters",
      }
    `);
  });
});
