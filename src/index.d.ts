type Store = {
  [key: string]: any
};

type Selector = (store: Store) => any;
type ParamSelector = (parameters: {
  [key: string]: any
}, selectors: {
  [key: string]: any
}) => any;

type ActionDispatcher = (...args: any[]) => void | Promise<void>;
type ActionGenerator = (
  action: (store: Store, ...args: any[]) => Store | Promise<Store>
) => ActionDispatcher;
type Actions = ({ local: ActionGenerator, global: ActionGenerator }) => {
  [key: string]: ActionDispatcher
};

export declare function register(
  storeSelectors: {
    [key: string]: Selector
  },
  createActions: Actions
): (Component: React.ComponentType) => void;


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

export declare function createDecorator(storeSelectors: {
  [key: string]: Selector
},
  createActions: Actions,
  paramSelectors: {
    [key: string]: ParamSelector
  }
): (Component: React.ComponentType, options: DecoratorOptions) => DecoratorFunction;

type AddonParameters = {
  [key: string]: any
}
export declare function setParameters(): <T extends AddonParameters>(T) => ({
  addonKey: T
})
