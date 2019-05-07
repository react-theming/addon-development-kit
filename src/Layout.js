import React from 'react';
import Rect from '@reach/rect';
import { styled, css } from '@storybook/theming';

const layout = React.createContext({});

const panelDimensions = rect =>
  rect
    ? {
        width: rect.width,
        height: rect.height,
        isLandscape: rect.width >= rect.height,
      }
    : {};

const AddonHolder = styled('div')`
  height: 100;
  label: addon-holder;
`;

export const LayoutProvider = ({ children }) => (
  <Rect>
    {({ rect, ref }) => {
      const dimensions = panelDimensions(rect);
      return (
        <AddonHolder ref={ref}>
          <layout.Provider value={dimensions}>{children}</layout.Provider>
        </AddonHolder>
      );
    }}
  </Rect>
);

const StyledLayout = styled('div')`
  display: flex;
  flex-direction: ${({ isLandscape }) => (isLandscape ? 'row' : 'column')};
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  label: addon-layout;
`;

export const Layout = ({ children }) => (
  <layout.Consumer>
    {({ isLandscape }) => (
      <StyledLayout isLandscape={isLandscape}>{children}</StyledLayout>
    )}
  </layout.Consumer>
);

const StyledBlock = styled.div(({ isLandscape, size }) => ({
  flexGrow: 1,
  ...(size
    ? {
        ...(isLandscape ? { width: size } : { height: size }),
        flexGrow: undefined,
      }
    : {
        ...(isLandscape ? { width: 2 } : { height: 2 }),
      }),
}));

export const Block = ({ size, children }) => (
  <layout.Consumer>
    {({ isLandscape }) => (
      <StyledBlock size={size} isLandscape={isLandscape}>
        {children}
      </StyledBlock>
    )}
  </layout.Consumer>
);
