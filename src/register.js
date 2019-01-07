import React from 'react';
import addons from '@storybook/addons';
import {
  ADDON_ID,
  PANEL_ID,
  PANEL_Title,
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
} from './config';
import withChannel from './withChannel';

class PanelHOC extends React.Component {
  constructor(props) {
    super(props);
    const urlState = props.api.getUrlState();
    console.log('​PanelHOC -> constructor -> urlState', urlState);
    this.state = {
      ...urlState,
    };
    props.api.onStory((kind, story) => this.setState({ kind, story }));
  }
  render() {
    const Panel = this.props.component;
    const { api, active, data, setData } = this.props;
    const { kind, story } = this.state;

    if (!active) return null;

    return (
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
      />
    );
  }
}

const WithChannel = withChannel({
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  initData: { foo: 'foo' },
  panel: true,
})(PanelHOC);

export const register = Panel =>
  addons.register(ADDON_ID, api => {
    addons.addPanel(PANEL_ID, {
      title: PANEL_Title,
      render: ({ active } = {}) => (
        <WithChannel
          api={api}
          active={active}
          ADDON_ID={ADDON_ID}
          PANEL_ID={PANEL_ID}
          PANEL_Title={PANEL_Title}
          component={Panel}
        />
      ),
    });
  });
