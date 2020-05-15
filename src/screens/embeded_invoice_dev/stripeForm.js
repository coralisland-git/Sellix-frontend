import React, { useState } from 'react';
import {loadStripe} from '@stripe/stripe-js/pure';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loading } from 'components'

import './stripeForm.scss'


const StripeForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const { invoice, onSuccess } = props

  const { stripe_client_secret  } = invoice;

  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true)

    setTimeout(() => {

        const element = elements.getElement(CardElement)

        stripe
            .confirmCardPayment(stripe_client_secret, {
                payment_method: {
                    card: element,
                }
            })
            .then(function(result) {
                if (result.error) {
                    // Show error to your customer
                    setIsLoading(false);
                    setError(result.error.message);
                } else {
                    // The payment succeeded!
                    setIsLoading(false);
                    setIsSuccess(true);
                    onSuccess && onSuccess()
                }
            });
    }, 100)
    
  };

  if(isSuccess) {
      return ""
    //   return <div style={{textAlign: 'center'}}>
    //       <SuccessIndicator size='96px' color='#613bea' />
    //   </div>
  }
 
  return ( <>
        {isLoading && <div className="stripe-loader-container">
            {Loading()}
        </div>}
        <form onSubmit={handleSubmit} style={isLoading ? { display: 'none'} : {}}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            <p className="text-red" style={{
                textAlign: 'center',
                marginTop: '10px',
                marginBottom: 0,
                minHeight: '13px'
            }}>{error || ''}</p>
        </form>
    </>
  );
};

const StripeFormContainer = (props) => {

    const { invoice } = props

    const { stripe_publishable_key, stripe_client_secret  } = invoice;

    const [stripePromise, _] = useState(loadStripe(stripe_publishable_key))

    return (
        <div className="stripe-form">
            {/* <h5>Please pay with your card below</h5> */}
            <Elements stripe={stripePromise}>
                <StripeForm {...props}/>
            </Elements>
        </div>
      );
}

export default StripeFormContainer