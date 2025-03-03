import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Spinner, AlertMessage } from '../ui';
import stripeService from '../../services/stripeService';

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

const CheckoutComponent = ({ planId, onCancel, simple = false }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const plansData = await stripeService.getPlans();
        setPlans(plansData);
        
        // Find the selected plan
        if (planId) {
          const plan = plansData.find(p => p.id === planId);
          setSelectedPlan(plan);
        }
      } catch (err) {
        setError('Failed to load plan information. Please try again later.');
        console.error('Error loading plans:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlans();
  }, [planId]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      await stripeService.createCheckoutSession(planId);
      // If successful, user will be redirected to Stripe
    } catch (err) {
      setError('Failed to initiate checkout. Please try again later.');
      console.error('Checkout error:', err);
      setLoading(false);
    }
  };

  if (loading && !selectedPlan) {
    return (
      <CheckoutContainer>
        <Spinner size="medium" message="Loading plan details..." />
      </CheckoutContainer>
    );
  }

  if (!selectedPlan) {
    return (
      <CheckoutContainer>
        <AlertMessage variant="error">
          Plan not found. Please select a valid subscription plan.
        </AlertMessage>
        <ButtonContainer>
          <Button variant="secondary" onClick={onCancel}>Go Back</Button>
        </ButtonContainer>
      </CheckoutContainer>
    );
  }

  // Simple checkout version (minimal UI)
  if (simple) {
    return (
      <CheckoutContainer>
        <Title>Complete Your Subscription</Title>
        <p style={{ marginBottom: '1.5rem' }}>
          You&apos;ll be redirected to Stripe&apos;s secure payment page to complete your subscription.
        </p>
        
        {error && <AlertMessage variant="error">{error}</AlertMessage>}
        
        <ButtonContainer>
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCheckout}
            disabled={loading}
            loading={loading}
          >
            Proceed to Payment
          </Button>
        </ButtonContainer>
      </CheckoutContainer>
    );
  }

  // Full checkout version (with plan details)
  return (
    <CheckoutContainer>
      <Title>Subscription Checkout</Title>
      
      {error && <AlertMessage variant="error">{error}</AlertMessage>}
      
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
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCheckout}
          disabled={loading}
          loading={loading}
        >
          Proceed to Payment
        </Button>
      </ButtonContainer>
    </CheckoutContainer>
  );
};

export default CheckoutComponent;