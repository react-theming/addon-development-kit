"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _react = _interopRequireDefault(require("react"));

var _addons = _interopRequireWildcard(require("@storybook/addons"));

var _coreEvents = require("@storybook/core-events");

var _rect = _interopRequireDefault(require("@reach/rect"));

var _config = require("./dist/config");

var _withChannel = _interopRequireDefault(require("./dist/withChannel"));

var _Layout = require("./dist/Layout");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// todo: remove
const panelDimesions = rect => rect ? {
  width: rect.width,
  height: rect.height,
  isLandscape: rect.width >= rect.height
} : {};

const addonLayout = isLandscape => {
  const Layout = ({
    style,
    children,
    ...props
  }) => _react.default.createElement("div", _extends({
    name: "addon-layout",
    style: {
      display: 'flex',
      flexDirection: isLandscape ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      height: '100%',
      ...style
    }
  }, props), children);

  return Layout;
};

const addonBlock = isLandscape => {
  const Block = ({
    style,
    children,
    size,
    ...props
  }) => _react.default.createElement("div", _extends({
    name: "addon-block",
    style: {
      flexGrow: 1,
      ...(size ? { ...(isLandscape ? {
          width: size
        } : {
          height: size
        }),
        flexGrow: undefined
      } : { ...(isLandscape ? {
          width: 2
        } : {
          height: 2
        })
      }),
      ...style
    }
  }, props), children);

  return Block;
};

class PanelHOC extends _react.default.Component {
  constructor(props) {
    super(props);
    const urlState = props.api.getUrlState();
    this.state = { ...urlState
    };
    props.api.on(_coreEvents.STORY_CHANGED, (kind, story) => this.setState({
      kind,
      story
    }));
  }

  render() {
    const Panel = this.props.component;
    const {
      api,
      active,
      data,
      setData,
      config,
      isFirstDataReceived
    } = this.props;
    const {
      ADDON_ID,
      PANEL_ID,
      PANEL_Title
    } = config;
    const {
      kind,
      story
    } = this.state;
    if (!active) return null;
    return _react.default.createElement(_rect.default, null, ({
      rect,
      ref
    }) => {
      const dim = panelDimesions(rect);
      const Layout = addonLayout(dim.isLandscape);
      const Block = addonBlock(dim.isLandscape);
      return _react.default.createElement("div", {
        ref: ref,
        name: "addon-holder",
        style: {
          height: '100%'
        }
      }, _react.default.createElement(_Layout.LayoutProvider, null, _react.default.createElement(Panel, _extends({}, this.props.actions, this.props.selectors, {
        api: api,
        active: active,
        store: data,
        setData: setData,
        kind: kind,
        story: story,
        ADDON_ID: ADDON_ID,
        PANEL_ID: PANEL_ID,
        PANEL_Title: PANEL_Title,
        rect: dim,
        Layout: Layout,
        Block: Block,
        isFirstDataReceived: isFirstDataReceived
      }))));
    });
  }

}

const register = (storeSelectors, createActions) => (Panel, {
  type = _addons.types.PANEL,
  initData
} = {}) => {
  const config = (0, _config.getConfig)();
  const {
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    ADDON_ID,
    PANEL_Title,
    PANEL_ID
  } = config;
  const WithChannel = (0, _withChannel.default)({
    EVENT_ID_INIT,
    EVENT_ID_DATA,
    EVENT_ID_BACK,
    ADDON_ID,
    initData,
    panel: true,
    storeSelectors,
    createActions
  })(PanelHOC);

  _addons.default.register(ADDON_ID, api => {
    _addons.default.add(PANEL_ID, {
      title: PANEL_Title,
      type,
      id: PANEL_ID,
      render: ({
        active,
        key
      } = {}) => _react.default.createElement(WithChannel, {
        key: key,
        api: api,
        active: active,
        component: Panel,
        config: config
      })
    });
  });
};

exports.register = register;