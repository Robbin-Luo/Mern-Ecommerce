import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoadingSpinner from '../../pages/LoadingSpinner/LoadingSpinner'
// import axios from '../../axios'
import axios from 'axios'
import { useDispatch } from "react-redux";
import { paymentSuccess } from "../../features/userSlice";

export default function CheckoutForm(props) {
  const { totalAmount, user, paymentIntentError, paymentIntentLoading } = props;
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const abortController = new AbortController();
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          axios.post('/orders/create-order', { user_id: user._id, order: user.cart }, { signal: abortController.signal })
            .then((res) => {
              dispatch(paymentSuccess(res.data.updatedUser));
            })
            .catch((err) => {
              setMessage('Your payment was not successful, please try again. ')
            })
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });

    return () => {
      abortController.abort();
    }
  }, [dispatch, stripe, user._id, user.cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || totalAmount <= 0) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/${user._id}/cart`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {
        totalAmount > 0 &&
        <div className='order-total-amount'>
          <div>Total:</div>
          <div>${totalAmount.toFixed(2)}</div>
        </div>
      }
      {
        paymentIntentLoading ? <div className="payment-intent-status"><LoadingSpinner /></ div> : paymentIntentError ? <div className="payment-intent-status">{paymentIntentError}</div> :
          <>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit">
              <span id="button-text">
                {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
              </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
          </>
      }

    </form>
  );
}