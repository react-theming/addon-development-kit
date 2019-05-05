import React from 'react';
import addons, { types as addonTypes } from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import Rect from '@reach/rect';

import {
  getConfig,
} from './config';
import withChannel from './withChannel';

const panelDimesions = rect =>
  rect
    ? {
        width: rect.width,
        height: rect.height,
        isLandscape: rect.width >= rect.height,
      }
    : {};

const addonLayout = isLandscape => {
  const Layout = ({ style, children, ...props }) => (
    <div
      name="addon-layout"
      style={{
        display: 'flex',
        flexDirection: isLandscape ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        height: '100%',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
  return Layout;
};

const addonBlock = isLandscape => {
  const Block = ({ style, children, size, ...props }) => (
    <div
      name="addon-block"
      style={{
        flexGrow: 1,
        ...(size
          ? {
              ...(isLandscape ? { width: size } : { height: size }),
              flexGrow: undefined,
            }
          : {
              ...(isLandscape ? { width: 2 } : { height: 2 }),
            }),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
  return Block;
};

class PanelHOC extends React.Component {
  constructor(props) {
    super(props);
    const urlState = props.api.getUrlState();
    this.state = {
      ...urlState,
    };
    props.api.on(STORY_CHANGED, (kind, story) =>
      this.setState({ kind, story })
    );
  }
  render() {
    const Panel = this.props.component;
    const { api, active, data, setData, config } = this.props;
    const {ADDON_ID, PANEL_ID, PANEL_Title} = config;
    const { kind, story } = this.state;

    if (!active) return null;

    return (
      <Rect>
        {({ rect, ref }) => {
          const dim = panelDimesions(rect);
          const Layout = addonLayout(dim.isLandscape);
          const Block = addonBlock(dim.isLandscape);
          return (
            <div ref={ref} name="addon-holder" style={{ height: '100%' }}>
              <Panel
                api={api}
                active={active}
                data={data}
                setData={setData}
                kind={kind}
                story={story}
                ADDON_ID={ADDON_ID}
                PANEL_ID={PANEL_ID}
                PANEL_Title={PANEL_Title}
                rect={dim}
                Layout={Layout}
                Block={Block}
              />
            </div>
          );
        }}
      </Rect>
    );
  }
}

export const register = (Panel, { type = addonTypes.PANEL, initData } = {}) => {
  const config = getConfig();
  const {
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    ADDON_ID,
    PANEL_Title,
    PANEL_ID,
  } = config;

  const WithChannel = withChannel({
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    ADDON_ID,
    initData,
    panel: true,
  })(PanelHOC);

  addons.register(ADDON_ID, api => {
    addons.add(PANEL_ID, {
      title: PANEL_Title,
      type,
      id: PANEL_ID,
      render: ({ active, key } = {}) => (
        <WithChannel
          key={key}
          api={api}
          active={active}
          component={Panel}
          config={config}
        />
      ),
    });
  });
};
