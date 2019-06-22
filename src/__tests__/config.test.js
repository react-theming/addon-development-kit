import { setConfig, getConfig } from "../config";

describe("config", () => {
  it("should get default config", () => {
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
});
