import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { useStripeSettings } from '../context/StripeContext';

const DonateForm = ({ streamerName, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [1, 5, 10, 25, 50];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet
    }

    setIsProcessing(true);
    setError(null);
    
    // In a real app, you would first call your backend here to create a PaymentIntent
    // const res = await fetch('/api/create-payment-intent', { method: 'POST', body: { amount } });
    // const { clientSecret } = await res.json();
    
    // Then confirm it with Stripe
    // const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardElement) }});
    
    // For this prototype, we'll simulate a 2-second processing delay
    setTimeout(() => {
      setSuccess(true);
      setIsProcessing(false);
      setTimeout(onClose, 2000); // Close modal 2s after success
    }, 2000);
  };

  if (success) {
    return (
      <div className="donate-success animate-fade">
        <div className="success-icon">🎉</div>
        <h3>Donation Successful!</h3>
        <p>You sent ${customAmount || amount} to {streamerName}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="donate-form">
      <h3>Donate to {streamerName}</h3>
      <p className="donate-subtitle">Support the stream directly.</p>
      
      <div className="amount-selector">
        {predefinedAmounts.map(preset => (
          <button 
            key={preset}
            type="button" 
            className={`amount-btn ${amount === preset && !customAmount ? 'active' : ''}`}
            onClick={() => { setAmount(preset); setCustomAmount(''); }}
          >
            ${preset}
          </button>
        ))}
        <input 
          type="number" 
          placeholder="Custom" 
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
          className="nz-input custom-amount"
          min="1"
        />
      </div>

      <div className="form-group">
        <label className="nz-label">Message (Optional)</label>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something nice..."
          className="nz-input"
          rows="2"
          maxLength="255"
        />
      </div>

      <div className="form-group stripe-card-group">
        <label className="nz-label">Card Details</label>
        <div className="stripe-card-element">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#f1f0f5',
                '::placeholder': { color: '#6b6580' },
              },
              invalid: { color: '#ef4444' }
            }
          }}/>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="nz-btn nz-btn-secondary" disabled={isProcessing}>
            Cancel
        </button>
        <button type="submit" className="nz-btn nz-btn-primary" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : `Donate $${customAmount || amount}`}
        </button>
      </div>
    </form>
  );
};

export const DonateModal = ({ isOpen, onClose, streamerName }) => {
  const { getStreamerStripePromise } = useStripeSettings();
  
  if (!isOpen) return null;

  // We wrap the actual form in Elements to provide Stripe context
  return (
    <div className="modal-overlay animate-fade">
      <div className="modal-content donate-modal nz-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <Elements stripe={getStreamerStripePromise(streamerName)}>
          <DonateForm streamerName={streamerName} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default DonateModal;
