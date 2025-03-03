import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 12}, 1fr);
  gap: ${props => props.gap || '1rem'};
  width: 100%;
  margin-bottom: ${props => props.marginBottom || '0'};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(${props => props.tabletColumns || props.columns || 6}, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(${props => props.mobileColumns || props.tabletColumns || 2}, 1fr);
  }
`;

const GridItem = styled.div`
  grid-column: span ${props => props.span || 1};
  
  @media (max-width: 1024px) {
    grid-column: span ${props => props.tabletSpan || props.span || 1};
  }
  
  @media (max-width: 768px) {
    grid-column: span ${props => props.mobileSpan || props.tabletSpan || props.span || 1};
  }
`;

/**
 * Grid component for responsive layouts
 */
const Grid = ({
  children,
  columns = 12,
  tabletColumns,
  mobileColumns,
  gap,
  marginBottom,
  ...props
}) => {
  return (
    <GridContainer
      columns={columns}
      tabletColumns={tabletColumns}
      mobileColumns={mobileColumns}
      gap={gap}
      marginBottom={marginBottom}
      {...props}
    >
      {children}
    </GridContainer>
  );
};

/**
 * GridItem component for use within Grid
 */
Grid.Item = ({ children, span = 1, tabletSpan, mobileSpan, ...props }) => {
  return (
    <GridItem
      span={span}
      tabletSpan={tabletSpan}
      mobileSpan={mobileSpan}
      {...props}
    >
      {children}
    </GridItem>
  );
};

Grid.Item.displayName = 'Grid.Item';

export default Grid;