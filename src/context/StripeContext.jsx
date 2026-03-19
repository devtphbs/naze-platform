import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

export const useStripeSettings = () => useContext(StripeContext);

export const StripeProvider = ({ children }) => {
  const [streamerStripeKey, setStreamerStripeKey] = useState('');
  const [stripePromise, setStripePromise] = useState(null);

  // Load the current user's stripe key if they are a streamer
  useEffect(() => {
    const savedKey = localStorage.getItem('naze_stripe_key');
    if (savedKey) {
      setStreamerStripeKey(savedKey);
    }
  }, []);

  const saveStripeKey = (key) => {
    setStreamerStripeKey(key);
    localStorage.setItem('naze_stripe_key', key);
  };

  // Helper to get Stripe instance for a specific streamer (e.g. when watching someone else)
  // In a real app, you'd fetch the streamer's public key from the backend API.
  // For this prototype, we're simulating checking if the viewed streamer has a key set up.
  // We'll use a dummy valid format key if they do, or null if they don't.
  const getStreamerStripePromise = (streamerId) => {
    // Simulated check: assume "NightOwl" or actual streamKeys have Stripe set up
    // In reality: const res = await fetch(`/api/users/${streamerId}/stripe-key`)
    const dummyPublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Standard Stripe test key
    if (!stripePromise) {
       const promise = loadStripe(dummyPublicKey);
       setStripePromise(promise);
       return promise;
    }
    return stripePromise;
  };

  return (
    <StripeContext.Provider value={{ streamerStripeKey, saveStripeKey, getStreamerStripePromise }}>
      {children}
    </StripeContext.Provider>
  );
};
