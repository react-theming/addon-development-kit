import React from 'react';
import withChannel from '../withChannel';
import {
  ADDON_ID,
  PANEL_ID,
  PANEL_Title,
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
} from '../config';

const DataInfo = ({ data, setData }) => {
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

const RenderInfo = withChannel({
  EVENT_ID_INIT,
  EVENT_ID_DATA,
  EVENT_ID_BACK,
  // initData: { info: 'data1' },
  panel: false,
})(DataInfo);

export const keepInfo = initData => {
  const data = {
    current: initData,
  };
  const onData = val => {
    // console.log('onData (story)', data);
    data.current = val;
  };
  return <RenderInfo initData={data.current} onData={onData} />;
};
