import { useRef, useState } from 'react';

import classes from './Checkout.module.css';
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
const isEmpty = (value) => value.trim() === '';

const CheckoutNow = (props) => {
  const auth = useContext(AuthContext);
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    address: true,
    date: true,
    time:true,
    message:true
  });

  const nameInputRef = useRef();
  const addressInputRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();
  const additionalInfoRef = useRef();

const confirmHandler = (event) => {
    event.preventDefault();
    props.onConfirm();
};  


  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className= {classes.control}>
        <label htmlFor='name'>Fake card number</label>
        <input type='text' id='name' ref={nameInputRef} />
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default CheckoutNow;
