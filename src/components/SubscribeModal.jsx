import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { useStripeSettings } from '../context/StripeContext';

const SubscribeForm = ({ streamerName, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedTier, setSelectedTier] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const tiers = [
    { id: 1, name: 'Tier 1', price: 4.99, perks: ['Custom Emotes', 'Ad-free viewing', 'Subscriber Badge'] },
    { id: 2, name: 'Tier 2', price: 9.99, perks: ['Tier 1 Perks', 'Extra Emotes', 'Priority in Chat'] },
    { id: 3, name: 'Tier 3', price: 24.99, perks: ['Tier 2 Perks', 'Exclusive Discord Role', 'Special Badge Flair'] }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);
    
    // Simulate API call for subscription creation
    setTimeout(() => {
      setSuccess(true);
      setIsProcessing(false);
      setTimeout(onClose, 2500);
    }, 2000);
  };

  if (success) {
    return (
      <div className="donate-success animate-fade">
        <div className="success-icon">⭐</div>
        <h3>Subscribed!</h3>
        <p>Welcome to the {streamerName} community (Tier {selectedTier}).</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="donate-form sub-form">
      <h3>Subscribe to {streamerName}</h3>
      <p className="donate-subtitle">Unlock perks and support the channel.</p>

      <div className="tier-selector">
        {tiers.map(tier => (
          <div 
            key={tier.id} 
            className={`tier-card nz-card ${selectedTier === tier.id ? 'active border-accent' : ''}`}
            onClick={() => setSelectedTier(tier.id)}
            style={{ cursor: 'pointer', marginBottom: '10px', padding: '16px', border: selectedTier === tier.id ? '2px solid var(--nz-accent)' : '' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>{tier.name}</h4>
              <span style={{ fontWeight: 'bold' }}>${tier.price}/mo</span>
            </div>
            <ul style={{ margin: '10px 0 0', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--nz-text-muted)' }}>
              {tier.perks.map((perk, i) => <li key={i}>{perk}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="form-group stripe-card-group" style={{ marginTop: '20px' }}>
        <label className="nz-label">Payment Method</label>
        <div className="stripe-card-element">
          <CardElement options={{
            style: {
              base: { fontSize: '16px', color: '#f1f0f5', '::placeholder': { color: '#6b6580' } },
              invalid: { color: '#ef4444' }
            }
          }}/>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="modal-actions" style={{ marginTop: '24px' }}>
        <button type="button" onClick={onClose} className="nz-btn nz-btn-secondary" disabled={isProcessing}>
            Cancel
        </button>
        <button type="submit" className="nz-btn nz-btn-subscribe" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : `Subscribe for $${tiers.find(t=>t.id===selectedTier).price}`}
        </button>
      </div>
    </form>
  );
};

export const SubscribeModal = ({ isOpen, onClose, streamerName }) => {
  const { getStreamerStripePromise } = useStripeSettings();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade">
      <div className="modal-content donate-modal nz-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <Elements stripe={getStreamerStripePromise(streamerName)}>
          <SubscribeForm streamerName={streamerName} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default SubscribeModal;
