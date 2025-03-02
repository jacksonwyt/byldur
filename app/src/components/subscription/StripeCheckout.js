import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useStripe as useStripeContext } from '../../hooks/useStripe';

const CheckoutContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const PlanDetails = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
`;

const PlanName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  span {
    font-size: 1rem;
    font-weight: 400;
  }
`;

const PlanDescription = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
`;

const PlanFeatures = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 1rem;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: var(--error-bg-color);
  color: var(--error-color);
  border-radius: 0.5rem;
  border-left: 4px solid var(--error-color);
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: var(--success-bg-color);
  color: var(--success-color);
  border-radius: 0.5rem;
  border-left: 4px solid var(--success-color);
`;

const StripeCheckout = ({ planId, onCancel }) => {
  const stripe = useStripe();
  const { plans, loading, error, createCheckoutSession } = useStripeContext();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    // Find the selected plan from available plans
    if (plans && plans.length > 0 && planId) {
      const plan = plans.find(p => p.id === planId);
      setSelectedPlan(plan);
    }
  }, [plans, planId]);

  const handleCheckout = async () => {
    if (!stripe) return;
    
    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      await createCheckoutSession(planId);
      // If this succeeds, the user will be redirected to Stripe
    } catch (err) {
      setCheckoutError(err.message || 'Failed to create checkout session.');
      setIsCheckingOut(false);
    }
  };

  if (loading.plans) {
    return (
      <CheckoutContainer>
        <Spinner size="medium" message="Loading plan details..." />
      </CheckoutContainer>
    );
  }

  if (!selectedPlan) {
    return (
      <CheckoutContainer>
        <ErrorMessage>
          Plan not found. Please select a valid subscription plan.
        </ErrorMessage>
        <ButtonContainer>
          <Button variant="secondary" onClick={onCancel}>Go Back</Button>
        </ButtonContainer>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <Title>Subscription Checkout</Title>
      
      {checkoutError && (
        <ErrorMessage>{checkoutError}</ErrorMessage>
      )}
      
      {error.checkout && (
        <ErrorMessage>{error.checkout}</ErrorMessage>
      )}
      
      {checkoutSuccess && (
        <SuccessMessage>
          Payment successful! Your subscription is now active.
        </SuccessMessage>
      )}
      
      <PlanDetails>
        <PlanName>{selectedPlan.name}</PlanName>
        <PlanPrice>
          ${selectedPlan.price} <span>/ {selectedPlan.interval}</span>
        </PlanPrice>
        <PlanDescription>{selectedPlan.description}</PlanDescription>
        
        <PlanFeatures>
          {selectedPlan.features && selectedPlan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </PlanFeatures>
      </PlanDetails>
      
      <ButtonContainer>
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={isCheckingOut || loading.checkout}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCheckout}
          disabled={!stripe || isCheckingOut || loading.checkout}
          loading={isCheckingOut || loading.checkout}
        >
          Proceed to Payment
        </Button>
      </ButtonContainer>
    </CheckoutContainer>
  );
};

export default StripeCheckout; 