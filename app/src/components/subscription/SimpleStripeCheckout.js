import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useStripe } from '../../hooks/useStripe';

const CheckoutContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: var(--error-bg-color);
  color: var(--error-color);
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

/**
 * A simplified Stripe checkout component
 */
const SimpleStripeCheckout = ({ planId, onSuccess, onCancel }) => {
  const { createCheckoutSession, loading, error } = useStripe();

  const handleCheckout = async () => {
    try {
      await createCheckoutSession(planId);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error is handled by the Stripe context
      console.error('Checkout error:', err);
    }
  };

  return (
    <CheckoutContainer>
      <Title>Complete Your Subscription</Title>
      <Description>
        You'll be redirected to Stripe's secure payment page to complete your subscription.
      </Description>
      
      {error.checkout && <ErrorMessage>{error.checkout}</ErrorMessage>}
      
      <ButtonContainer>
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading.checkout}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCheckout}
          disabled={loading.checkout}
          loading={loading.checkout}
        >
          Proceed to Payment
        </Button>
      </ButtonContainer>
    </CheckoutContainer>
  );
};

export default SimpleStripeCheckout; 