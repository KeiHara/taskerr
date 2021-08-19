import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

//create .env.local and paste ur own api key for stripe 
const publicKey = "pk_test_51JCx2FF8eF8urKgjatIySmGTW2Fhf7vb1rt9VYjfzsKHldLSdWify7axMDpdItCGNLZ1vs5imzeFuoiM7oXJMlsS00P0zRJgNO"

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
