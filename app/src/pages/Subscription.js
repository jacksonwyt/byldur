import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaCreditCard, FaHistory, FaArrowRight, FaRedo } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import subscriptionService from '../services/subscriptionService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/dateUtils';
import { useStripe as useStripeContext } from '../hooks/useStripe';
import StripeWrapper from '../components/subscription/StripeWrapper';
import PaymentMethodForm from '../components/subscription/PaymentMethodForm';

const SubscriptionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--text-color-secondary);
  font-size: 1.1rem;
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => {
    if (props.type === 'info') return 'var(--info-bg-color)';
    if (props.type === 'success') return 'var(--success-bg-color)';
    if (props.type === 'warning') return 'var(--warning-bg-color)';
    if (props.type === 'error') return 'var(--error-bg-color)';
    return 'var(--info-bg-color)';
  }};
  color: ${props => {
    if (props.type === 'info') return 'var(--info-color)';
    if (props.type === 'success') return 'var(--success-color)';
    if (props.type === 'warning') return 'var(--warning-color)';
    if (props.type === 'error') return 'var(--error-color)';
    return 'var(--info-color)';
  }};
  border-left: 4px solid ${props => {
    if (props.type === 'info') return 'var(--info-color)';
    if (props.type === 'success') return 'var(--success-color)';
    if (props.type === 'warning') return 'var(--warning-color)';
    if (props.type === 'error') return 'var(--error-color)';
    return 'var(--info-color)';
  }};
`;

const AlertContent = styled.div``;

const AlertTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const AlertText = styled.p`
  margin: 0;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div`
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

const PlanHeader = styled.div`
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

const PlanBody = styled.div`
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

const PlanActions = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const CurrentPlanSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const DetailsCard = styled.div`
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
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

const PaymentHistorySection = styled.div`
  margin-top: 3rem;
`;

const PaymentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    font-weight: 600;
    color: var(--text-color-secondary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.status === 'active') return 'var(--success-bg-color)';
    if (props.status === 'canceled') return 'var(--warning-bg-color)';
    if (props.status === 'inactive') return 'var(--error-bg-color)';
    return 'var(--info-bg-color)';
  }};
  color: ${props => {
    if (props.status === 'active') return 'var(--success-color)';
    if (props.status === 'canceled') return 'var(--warning-color)';
    if (props.status === 'inactive') return 'var(--error-color)';
    return 'var(--info-color)';
  }};
`;

const ConfirmationDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-lg);
`;

const DialogTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const DialogText = styled.p`
  margin-bottom: 1.5rem;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Subscription = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    subscription, 
    plans, 
    paymentHistory,
    loading, 
    error,
    fetchPaymentHistory,
    createCheckoutSession,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod
  } = useStripeContext();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // Check for required subscription query parameters
  const urlParams = new URLSearchParams(location.search);
  const subscriptionRequired = urlParams.get('required') === 'true';
  const aiOnlyRequired = urlParams.get('aiOnly') === 'true';
  
  useEffect(() => {
    document.title = 'Subscription | Byldur';
    
    // Check for success parameter in URL (returning from Stripe)
    const success = urlParams.get('success');
    
    if (success === 'true') {
      // Show success message and clear URL params
      navigate('/dashboard/subscription', { replace: true });
    }
    
    // Load payment history when component mounts
    fetchPaymentHistory();
  }, [location, navigate, fetchPaymentHistory, urlParams]);
  
  // Get status badge text and color
  const getStatusBadge = (status) => {
    return <StatusBadge status={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</StatusBadge>;
  };
  
  // Handle subscription checkout
  const handleSubscribe = async (planId) => {
    await createCheckoutSession(planId);
  };
  
  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    const success = await cancelSubscription();
    if (success) {
      setShowCancelDialog(false);
    }
  };
  
  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    const success = await reactivateSubscription();
    if (success) {
      setShowReactivateDialog(false);
    }
  };
  
  // Handle payment method update
  const handleUpdatePaymentMethod = () => {
    setShowPaymentDialog(true);
  };
  
  // Add a new function to handle payment method form submission
  const handlePaymentMethodSubmit = async (paymentMethodId) => {
    try {
      // Your implementation for updating payment method with the paymentMethodId
      console.log('Updating payment method with ID:', paymentMethodId);
      
      // Close the dialog upon success
      setShowPaymentDialog(false);
    } catch (err) {
      console.error('Error updating payment method:', err);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <Spinner size="50px" message="Loading subscription information..." />
      </div>
    );
  }
  
  return (
    <SubscriptionContainer>
      <PageHeader>
        <PageTitle>Subscription</PageTitle>
        <PageDescription>Manage your subscription and billing information</PageDescription>
      </PageHeader>
      
      {/* Show error message if any */}
      {error && (
        <Alert type="error">
          <AlertContent>
            <AlertTitle>Error</AlertTitle>
            <AlertText>{error}</AlertText>
          </AlertContent>
        </Alert>
      )}
      
      {/* Show notice if subscription is required */}
      {subscriptionRequired && !subscription?.active && (
        <Alert type={aiOnlyRequired ? 'info' : 'warning'}>
          <AlertContent>
            <AlertTitle>{aiOnlyRequired ? 'AI Feature Access' : 'Subscription Required'}</AlertTitle>
            <AlertText>
              {aiOnlyRequired 
                ? 'This AI feature requires an active subscription. Please subscribe to a plan to use AI-powered features.' 
                : 'This feature requires an active subscription. Please subscribe to a plan to continue.'}
            </AlertText>
          </AlertContent>
        </Alert>
      )}
      
      {/* Current Subscription Section */}
      {subscription && (
        <CurrentPlanSection>
          <SectionTitle>Current Plan</SectionTitle>
          <DetailsCard>
            <DetailRow>
              <DetailLabel>Plan</DetailLabel>
              <DetailValue bold highlight>{subscription.plan?.name || 'Free'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{getStatusBadge(subscription.status)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Billing Period</DetailLabel>
              <DetailValue>
                {subscription.currentPeriodStart && subscription.currentPeriodEnd
                  ? `${formatDate(subscription.currentPeriodStart)} to ${formatDate(subscription.currentPeriodEnd)}`
                  : 'N/A'}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Next Billing Date</DetailLabel>
              <DetailValue>
                {subscription.status === 'active' && subscription.currentPeriodEnd
                  ? formatDate(subscription.currentPeriodEnd)
                  : 'N/A'}
              </DetailValue>
            </DetailRow>
            {subscription.canceledAt && (
              <DetailRow>
                <DetailLabel>Canceled On</DetailLabel>
                <DetailValue>{formatDate(subscription.canceledAt)}</DetailValue>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>Actions</DetailLabel>
              <div>
                {subscription.status === 'active' && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={loading.cancel}
                  >
                    <FaTimes size={12} /> Cancel Subscription
                  </Button>
                )}
                
                {subscription.status === 'canceled' && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setShowReactivateDialog(true)}
                    disabled={loading.reactivate}
                    loading={loading.reactivate}
                  >
                    <FaRedo size={12} /> Reactivate
                  </Button>
                )}
                
                {subscription.status === 'active' && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleUpdatePaymentMethod}
                    disabled={loading.updatePayment}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    <FaCreditCard size={12} /> Update Payment
                  </Button>
                )}
              </div>
            </DetailRow>
          </DetailsCard>
        </CurrentPlanSection>
      )}
      
      {/* Available Plans Section */}
      <div>
        <SectionTitle>Available Plans</SectionTitle>
        <PlansGrid>
          {plans.map((plan) => (
            <PlanCard key={plan.id} isActive={subscription?.plan?.id === plan.id}>
              <PlanHeader isPro={plan.name.toLowerCase().includes('pro')}>
                <PlanName>{plan.name}</PlanName>
                <PlanPrice>
                  ${plan.price}{' '}
                  <span>/ {plan.interval}</span>
                </PlanPrice>
              </PlanHeader>
              <PlanBody>
                <FeaturesList>
                  {plan.features.map((feature, index) => (
                    <FeatureItem key={index} available={true}>
                      <FaCheck /> {feature}
                    </FeatureItem>
                  ))}
                </FeaturesList>
              </PlanBody>
              <PlanActions>
                {subscription?.plan?.id === plan.id ? (
                  <Button variant="outline" disabled fullWidth>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.name.toLowerCase().includes('pro') ? 'primary' : 'secondary'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading.checkout}
                    loading={loading.checkout}
                    fullWidth
                  >
                    {plan.price > 0 ? 'Subscribe' : 'Choose Plan'} <FaArrowRight size={12} />
                  </Button>
                )}
              </PlanActions>
            </PlanCard>
          ))}
        </PlansGrid>
      </div>
      
      {/* Payment History Section */}
      {paymentHistory && paymentHistory.length > 0 && (
        <PaymentHistorySection>
          <SectionTitle>Payment History</SectionTitle>
          <DetailsCard>
            <PaymentTable>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDate(payment.date)}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.description}</td>
                    <td>{getStatusBadge(payment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </PaymentTable>
          </DetailsCard>
        </PaymentHistorySection>
      )}
      
      {/* Cancellation Confirmation Dialog */}
      {showCancelDialog && (
        <ConfirmationDialog>
          <DialogContent>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogText>
              Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.
            </DialogText>
            <DialogActions>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                disabled={loading.cancel}
              >
                Keep Subscription
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelSubscription}
                disabled={loading.cancel}
                loading={loading.cancel}
              >
                Cancel Subscription
              </Button>
            </DialogActions>
          </DialogContent>
        </ConfirmationDialog>
      )}
      
      {/* Reactivation Confirmation Dialog */}
      {showReactivateDialog && (
        <ConfirmationDialog>
          <DialogContent>
            <DialogTitle>Reactivate Subscription</DialogTitle>
            <DialogText>
              Are you sure you want to reactivate your subscription?
            </DialogText>
            <DialogActions>
              <Button
                variant="outline"
                onClick={() => setShowReactivateDialog(false)}
                disabled={loading.reactivate}
              >
                Keep Subscription
              </Button>
              <Button
                variant="primary"
                onClick={handleReactivateSubscription}
                disabled={loading.reactivate}
                loading={loading.reactivate}
              >
                Reactivate
              </Button>
            </DialogActions>
          </DialogContent>
        </ConfirmationDialog>
      )}
      
      {/* Payment Method Dialog */}
      {showPaymentDialog && (
        <ConfirmationDialog>
          <DialogContent>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogText>
              Please enter your new payment method details:
            </DialogText>
            
            <StripeWrapper>
              <PaymentMethodForm 
                onSubmit={handlePaymentMethodSubmit} 
                buttonText="Update Payment Method"
                isSubmitting={loading.updatePayment}
              />
            </StripeWrapper>
            
            <DialogActions>
              <Button 
                variant="secondary" 
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </DialogContent>
        </ConfirmationDialog>
      )}
    </SubscriptionContainer>
  );
};

export default Subscription; 