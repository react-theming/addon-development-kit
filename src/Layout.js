import React from 'react';
import Rect from '@reach/rect';
import { styled, cx, css } from '@storybook/theming';

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
  height: 100%;
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


const StyledOverridden = ({
  className,
  overrides,
  children,
  isLandscape,
  size,
  ...props
}) => (
  <div className={`${className} ${overrides}`} {...props}>
    {children}
  </div>
);

const StyledLayout = styled(StyledOverridden)`
  display: flex;
  flex-direction: ${({ isLandscape }) => (isLandscape ? 'row' : 'column')};
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  label: addon-layout;
`;

export const Layout = ({ className, children }) => (
  <layout.Consumer>
    {({ isLandscape }) => (
      <StyledLayout isLandscape={isLandscape} overrides={className}>{children}</StyledLayout>
    )}
  </layout.Consumer>
);


const px = v => `${v}px`;

const StyledBlock = styled(StyledOverridden)`
  ${({ isLandscape }) => (isLandscape ? 'width' : 'height')}: ${({ size }) =>
    size ? px(size) : '2px'};
  ${({ size }) => (size ? '' : 'flex-grow: 1;')}
  label: addon-block;
`;

export const Block = ({ size, children, className }) => (
  <layout.Consumer>
    {({ isLandscape }) => (
      <StyledBlock size={size} isLandscape={isLandscape} overrides={className}>
        {children}
      </StyledBlock>
    )}
  </layout.Consumer>
);
