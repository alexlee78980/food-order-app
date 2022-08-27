import React, { useContext, useState } from 'react';

import Modal from '../other/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import ErrorModal from '../error/ErrorModal';
import { AuthContext } from '../context/auth-context';
import CheckoutNow from './CheckoutNow';
import { useHttpClient } from '../hooks/http-hook';

const BuyNow = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const totalAmount = auth.buyNow.price.toFixed(2);

  const cartItemRemoveHandler = (id) => {
    auth.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    auth.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async () => {
    setIsSubmitting(true);
    let request;
    try{
      request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/addplan`, 'PATCH', JSON.stringify({
        mealId: auth.buyNow.id, //auth.buyNow.meals
      }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      }
    );
    setDidSubmit(true);
    auth.loginFunction(request.userId, request.email,request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
    }
    catch(err){
        console.log(err);
    }
    setIsSubmitting(false);
    //auth.addmeals(auth.buyNow.meals);
  };

  const cartItems = (
      
        <CartItem
          key={auth.buyNow.id}
          name={auth.buyNow.name}
          amount={1}
          price={auth.buyNow.price}
          dontshow={true}
        //   onRemove={cartItemRemoveHandler.bind(null, item.id)}
        //   onAdd={cartItemAddHandler.bind(null, item)}
        />
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>${totalAmount}</span>
      </div>
      {isCheckout && (
        <CheckoutNow onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
    {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
    </React.Fragment>
  );
};

export default BuyNow;
