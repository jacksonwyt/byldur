import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';
import usePayment from '../hooks/usePayment';
import { formatDate } from '../utils/dateUtils';
import CheckoutComponent from '../components/subscription/CheckoutComponent';
import { 
  AlertMessage, 
  Button, 
  Spinner, 
  Card, 
  Badge, 
  Grid 
} from '../components/ui';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-color-secondary);
  margin-bottom: 3rem;
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  margin: 0 0 2rem 0;
  padding: 0;
  
  li {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: flex-start;
    
    svg {
      margin-right: 0.5rem;
      color: var(--success-color);
    }
  }
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-color);
  
  span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-color-secondary);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: var(--text-color-secondary);
`;

const DetailValue = styled.span`
  font-weight: ${props => props.bold ? '600' : '400'};
  color: ${props => props.highlight ? 'var(--primary-color)' : 'var(--text-color)'};
`;

const SubscriptionPage = () => {
  const { 
    plans, 
    subscription, 
    loading, 
    error, 
    fetchPlans, 
    fetchSubscription,
    cancelSubscription, 
    reactivateSubscription,
    hasActiveSubscription
  } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for query parameters
  const urlParams = new URLSearchParams(location.search);
  const subscriptionRequired = urlParams.get('required') === 'true';

  useEffect(() => {
    // Check for success parameter in URL (returning from Stripe)
    const success = urlParams.get('success');
    
    if (success === 'true') {
      // Show success message and clear URL params
      navigate('/subscription', { replace: true });
    }

    fetchPlans();
    fetchSubscription();
  }, [fetchPlans, fetchSubscription, location, navigate, urlParams]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCancelCheckout = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await cancelSubscription();
      } catch (err) {
        console.error('Error canceling subscription:', err);
      }
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription();
    } catch (err) {
      console.error('Error reactivating subscription:', err);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    let variant = 'info';
    if (status === 'active') variant = 'success';
    if (status === 'canceled') variant = 'warning';
    if (status === 'inactive') variant = 'error';
    
    return (
      <Badge variant={variant}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading && !plans.length) {
    return (
      <Container>
        <Spinner size="large" message="Loading subscription information..." />
      </Container>
    );
  }

  if (showCheckout && selectedPlan) {
    return (
      <Container>
        <CheckoutComponent 
          planId={selectedPlan.id} 
          onCancel={handleCancelCheckout} 
        />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Subscription Plans</Title>
      <Subtitle>Choose the plan that best fits your needs.</Subtitle>
      
      {error && <AlertMessage variant="error">{error}</AlertMessage>}
      
      {/* Required subscription message */}
      {subscriptionRequired && !hasActiveSubscription() && (
        <AlertMessage variant="warning">
          <strong>Subscription Required</strong>
          <p>This feature requires an active subscription. Please subscribe to a plan to continue.</p>
        </AlertMessage>
      )}
      
      {/* Current subscription info */}
      {subscription && (
        <Card 
          title="Current Plan"
          marginBottom="2rem"
        >
          <DetailRow>
            <DetailLabel>Plan</DetailLabel>
            <DetailValue bold highlight>{subscription.plan?.name || 'Free'}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>{getStatusBadge(subscription.status)}</DetailValue>
          </DetailRow>
          
          {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
            <DetailRow>
              <DetailLabel>Billing Period</DetailLabel>
              <DetailValue>
                {formatDate(subscription.currentPeriodStart)} to {formatDate(subscription.currentPeriodEnd)}
              </DetailValue>
            </DetailRow>
          )}
          
          {subscription.canceledAt && (
            <DetailRow>
              <DetailLabel>Canceled On</DetailLabel>
              <DetailValue>{formatDate(subscription.canceledAt)}</DetailValue>
            </DetailRow>
          )}
          
          <DetailRow>
            <DetailLabel>Actions</DetailLabel>
            <div>
              {hasActiveSubscription() && (
                <Button 
                  variant="secondary" 
                  onClick={handleCancelSubscription}
                  disabled={loading}
                >
                  Cancel Subscription
                </Button>
              )}
              
              {subscription.status === 'canceled' && (
                <Button 
                  onClick={handleReactivateSubscription}
                  disabled={loading}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Reactivate Subscription
                </Button>
              )}
            </div>
          </DetailRow>
        </Card>
      )}
      
      {/* Available plans */}
      <SectionTitle>Available Plans</SectionTitle>
      <Grid 
        columns={3} 
        tabletColumns={2} 
        mobileColumns={1} 
        gap="2rem"
        marginBottom="3rem"
      >
        {plans.map(plan => (
          <Grid.Item key={plan.id} span={1}>
            <Card
              fullHeight
              highlight={subscription?.plan?.id === plan.id && hasActiveSubscription()}
              padding="2rem"
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {plan.name}
              </h2>
              
              <PlanPrice>
                ${plan.price} <span>/ {plan.interval}</span>
              </PlanPrice>
              
              <p style={{ color: 'var(--text-color-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
                {plan.description}
              </p>
              
              <FeaturesList>
                {plan.features && plan.features.map((feature, index) => (
                  <li key={index}><FaCheck /> {feature}</li>
                ))}
              </FeaturesList>
              
              <Button 
                onClick={() => handleSelectPlan(plan)}
                disabled={subscription?.plan?.id === plan.id && hasActiveSubscription() || loading}
                variant={plan.name.toLowerCase().includes('pro') ? 'primary' : 'secondary'}
                fullWidth
              >
                {subscription?.plan?.id === plan.id && hasActiveSubscription() 
                  ? 'Current Plan' 
                  : 'Select Plan'}
              </Button>
            </Card>
          </Grid.Item>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPage;