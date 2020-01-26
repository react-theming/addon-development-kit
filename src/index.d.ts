import { types as addonTypes } from '@storybook/addons'
import { API } from '@storybook/api'

interface Dictionary<T = any> {
  [key: string]: T
}

type AddonStore = Dictionary;

type Selector = (store: AddonStore) => any;
type ParamSelector = (parameters: {
  [key: string]: any
}, selectors: {
  [key: string]: any
}) => any;

type ActionDispatcher = (...args: any[]) => void | Promise<void>;
type ActionGenerator = (
  action: (store: AddonStore, ...args: any[]) => AddonStore | Promise<AddonStore>
) => ActionDispatcher;
type Actions = ({ local: ActionGenerator, global: ActionGenerator }) => Dictionary<ActionDispatcher>;

type RegisterOptions = {
  type?: addonTypes
  initData?: Dictionary
}

export declare function register(
  storeSelectors?: Dictionary<Selector>,
  createActions?: Actions
): (Component: React.ComponentType, options: RegisterOptions) => void;


interface StoryContext {
  id: string;
  name: string;
  kind: string;
  [key: string]: any;
  parameters: Parameters;
}

export type StoryFn<ReturnType = unknown> = (p?: StoryContext) => ReturnType;
type DecoratorFunction = (fn: StoryFn, c: StoryContext) => ReturnType<StoryFn>;

/**
 * Options that controls decorator behavior
 */
type DecoratorOptions = {
  isGlobal: boolean,
}

export declare function createDecorator(storeSelectors?: Dictionary<Selector>,
  createActions: Actions,
  paramSelectors?: Dictionary<
    (parameters: Dictionary, selectors: Dictionary<() => any>) => any
  >
): (Component: React.ComponentType, options: DecoratorOptions) => DecoratorFunction;

type AddonParameters = Dictionary<any>

export declare function setParameters(): <T extends AddonParameters>(T) => ({
  [ConfigValues.PARAM_Key]: T
})

type ConfigOptions = {
  addonId?: string
  panelId?: string
  panelTitle?: string
  paramKey?: string
  eventInit?: string
  eventData?: string
  eventBack?: string
}

export declare function setConfig(config: ConfigOptions): void

type ConfigValues = {
  ADDON_ID: string
  PANEL_ID: string
  PANEL_Title: string
  PARAM_Key: string
  EVENT_ID_INIT: string
  EVENT_ID_DATA: string
  EVENT_ID_BACK: string
}

export declare function getConfig(): ConfigValues

