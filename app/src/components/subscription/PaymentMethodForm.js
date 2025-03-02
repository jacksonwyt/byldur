import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import Button from '../common/Button';

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const CardContainer = styled.div`
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background-color: var(--input-bg-color);
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const ActionContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

const PaymentMethodForm = ({ onSubmit, buttonText = 'Update Payment Method', isSubmitting = false }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    // Reset error
    setError(null);
    
    // Get a reference to the card element
    const cardElement = elements.getElement(CardElement);
    
    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (error) {
      console.error('Error creating payment method:', error);
      setError(error.message);
      return;
    }
    
    // Call the onSubmit prop with the paymentMethod ID
    onSubmit(paymentMethod.id);
  };
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'var(--text-color)',
        '::placeholder': {
          color: 'var(--text-color-muted)',
        },
      },
      invalid: {
        color: 'var(--error-color)',
        iconColor: 'var(--error-color)',
      },
    },
    hidePostalCode: true,
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <CardContainer>
          <CardElement options={cardElementOptions} />
        </CardContainer>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ActionContainer>
          <Button 
            type="submit" 
            disabled={!stripe || isSubmitting} 
            loading={isSubmitting}
          >
            {buttonText}
          </Button>
        </ActionContainer>
      </form>
    </FormContainer>
  );
};

export default PaymentMethodForm; 