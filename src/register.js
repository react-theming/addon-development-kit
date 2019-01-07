import React from 'react';
import addons from '@storybook/addons';
import { ADDON_ID, PANEL_ID } from './config';

const AddonPanel = ({api, active}) => (<div>Panel (active: {JSON.stringify(active)})</div>)

addons.register(ADDON_ID, api => {
  addons.addPanel(PANEL_ID, {
    title: 'Material-UI',
    render: ({ active } = {}) => (
      <AddonPanel api={api} active={active} panel pointName="addon panel" />
    )
  });
});
