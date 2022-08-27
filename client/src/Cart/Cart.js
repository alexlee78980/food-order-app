import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../other/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import Checkout from './Checkout';
import { useHttpClient } from '../hooks/http-hook';
import DeleteModal from '../other/DeleteModal';
import { AuthContext } from '../context/auth-context';
const Cart = (props) => {
  const {isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [isunderZero, setIsUnderZero] = useState(false);
  const auth = useContext(AuthContext);
  const mealsRemaining = auth.meals;
  const mealsRemainingAfter = auth.meals - auth.total;
  const totalItems = auth.total;
  const hasItems =  auth.total > 0;
  const nav = useNavigate();
  const cartItemRemoveHandler = (id) => {
    auth.removeOneFromCart(id);
  };
  const cartItemAddHandler = (id) => {
    auth.addOnetoCart(id);
  };
  
  const cartChangeHandler = (item, amount) => {
    auth.setItemtoCart(item, amount);
  };

  const orderHandler = () => {
    if(mealsRemainingAfter < 0){
      setIsUnderZero(true);
    }else{
    setIsCheckout(true);
    }
  };
  const clearHandler = () => {
    setIsUnderZero(false);
  }
  const navigate = () => {
    nav("/plans");
    setIsUnderZero(false);
    setIsCheckout(false);
    props.onClose();
  }
  const submittedHandler = () => {
    props.onClose();
    props.onClear();
  }

  const submitOrderHandler = async (userData) => {
    if(mealsRemainingAfter < 0){
      setIsUnderZero(true);
      return;
    }
    console.log(auth.userId);
    setIsSubmitting(true);
    // let request;
    // try{
    //   request =await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/addmeals`, 'PATCH', JSON.stringify({
    //     email: auth.email, //auth.email,
    //     id: auth.userId,
    //     meals: -(auth.total), //auth.buyNow.meals
    //     password: auth.password
    //   }),
    //   {
    //     'Content-Type': 'application/json',
    //   }
    // );
    // }
    // catch(err){
    //     console.log(err);
    // }
    // console.log(auth.food);
  let request;
    try{
      request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/addOrder`, 'POST', JSON.stringify({
        name: userData.name,
        email: auth.email,
        userid: auth.userId,
        address: userData.address,
        date: userData.date ,
        time: userData.time,
        cell: userData.cell,
        meals: auth.cart,
        additionalMsg: userData.message,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
          
        }
      );
      console.log('reached');
      auth.loginFunction(request.userId, request.email, request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
      setDidSubmit(true);
      }
      catch(err){
          console.log(err);
      }
      console.log("ran");
    setIsSubmitting(false);
  };
  console.log(auth.cart);
  const cartItems = (
    <ul className={classes['cart-items']}>
      {auth.cart.filter(item => item.amount > 0).map((item) => {
        console.log(item.id);
        return <CartItem
          key={item.id}
          id={item.id}
          name={item.name}
          amount={item.amount}
          from={item.from}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item.id)}
          onChange={cartChangeHandler.bind(null, item)}
        />
      })}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Meals Remaining</span>
        <span>{mealsRemaining}x</span>
      </div>
      <div className={classes.total}>
        <span>Total Items</span>
        <span>{totalItems}x</span>
      </div>
      <div className={classes.total}>
        <span>Meals Remaining After Transaction</span>
        <span>{mealsRemainingAfter}x</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={submittedHandler}>
        Close
      </button>
    </div>
    </React.Fragment>
  );
  
  return (
    <Modal onClose={props.onClose}>
    {isunderZero && <DeleteModal onClick={navigate} onClose={clearHandler}  heading={`You dont have enough meals remaining. Do to buy more?`} ></DeleteModal>}
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
