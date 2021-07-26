import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

//create .env.local and paste ur own api key for stripe 
const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const stripePromise = loadStripe(publicKey)
ReactDOM.render(
  <AuthProvider>
      <Elements stripe={stripePromise}>
          <App />
      </Elements>
    </AuthProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
