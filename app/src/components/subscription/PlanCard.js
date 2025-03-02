import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Button from '../common/Button';

const Card = styled.div`
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid ${props => props.isActive ? 'var(--primary-color)' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  background-color: ${props => props.isPro ? 'var(--primary-color)' : 'var(--secondary-color)'};
  color: ${props => props.isPro ? 'var(--primary-text-color)' : 'var(--secondary-text-color)'};
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  
  span {
    font-size: 1rem;
    font-weight: 400;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const FeatureItem = styled.li`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.available ? 'var(--success-color)' : 'var(--text-color-muted)'};
  }
`;

const CardActions = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

/**
 * Subscription plan card component
 */
const PlanCard = ({ 
  plan, 
  isActive = false, 
  onSubscribe, 
  isCurrentPlan = false 
}) => {
  const isPro = plan.tier === 'pro';
  
  return (
    <Card isActive={isActive}>
      <CardHeader isPro={isPro}>
        <PlanName>{plan.name}</PlanName>
        <PlanPrice>
          ${plan.price}<span>/{plan.interval}</span>
        </PlanPrice>
      </CardHeader>
      
      <CardBody>
        <FeaturesList>
          {plan.features.map((feature, index) => (
            <FeatureItem key={index} available={feature.available}>
              {feature.available ? <FaCheck /> : <FaTimes />}
              {feature.text}
            </FeatureItem>
          ))}
        </FeaturesList>
      </CardBody>
      
      <CardActions>
        <Button
          variant={isPro ? "primary" : "secondary"}
          onClick={() => onSubscribe(plan.id)}
          disabled={isCurrentPlan}
          fullWidth
        >
          {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlanCard; 