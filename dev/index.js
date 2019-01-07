import React from 'react';
import withChannel from '../src/withChannel';
import {
  ADDON_ID,
  PANEL_ID,
  PANEL_Title,
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
} from '../src/config';

const DataInfo = ({ data, setData }) => {
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default withChannel({
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  initData: { info: 'data1' },
  panel: false,
})(DataInfo);
