import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
  padding: ${props => props.padding || '1.5rem'};
  margin-bottom: ${props => props.marginBottom || '0'};
  border: ${props => props.bordered 
    ? '1px solid var(--border-color)' 
    : props.highlight 
      ? '2px solid var(--primary-color)' 
      : 'none'};
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  
  &:hover {
    ${props => props.hoverable && `
      transform: translateY(-4px);
      box-shadow: var(--card-shadow-hover, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    `}
  }
`;

const CardHeader = styled.div`
  padding: ${props => props.noPadding ? '0' : '0 0 1rem 0'};
  margin-bottom: ${props => props.noPadding ? '0' : '1rem'};
  border-bottom: ${props => props.noBorder ? 'none' : '1px solid var(--border-color)'};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.size === 'large' ? '1.5rem' : props.size === 'small' ? '1rem' : '1.25rem'};
  font-weight: 600;
  margin: 0 0 ${props => props.subtitle ? '0.5rem' : '0'} 0;
`;

const CardSubtitle = styled.p`
  color: var(--text-color-secondary);
  margin: 0;
  font-size: 0.875rem;
`;

const CardBody = styled.div`
  flex: 1;
`;

const CardFooter = styled.div`
  padding: ${props => props.noPadding ? '0' : '1rem 0 0 0'};
  margin-top: ${props => props.noPadding ? '0' : '1rem'};
  border-top: ${props => props.noBorder ? 'none' : '1px solid var(--border-color)'};
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  gap: 0.5rem;
`;

const Card = ({ 
  title, 
  subtitle, 
  titleSize, 
  children, 
  footer, 
  footerAlign,
  padding,
  marginBottom,
  bordered,
  highlight,
  hoverable,
  fullHeight,
  headerNoPadding,
  headerNoBorder, 
  footerNoPadding,
  footerNoBorder,
  className,
  ...props 
}) => {
  return (
    <CardContainer 
      padding={padding}
      marginBottom={marginBottom}
      bordered={bordered}
      highlight={highlight}
      hoverable={hoverable}
      fullHeight={fullHeight}
      className={className}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader noPadding={headerNoPadding} noBorder={headerNoBorder}>
          {title && <CardTitle size={titleSize} subtitle={subtitle}>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      
      <CardBody>
        {children}
      </CardBody>
      
      {footer && (
        <CardFooter align={footerAlign} noPadding={footerNoPadding} noBorder={footerNoBorder}>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default Card;