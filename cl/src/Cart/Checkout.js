import { useRef, useState } from 'react';

import classes from './Checkout.module.css';
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
const isEmpty = (value) => value.trim() === '';
const isFiveChars = (value) => value.trim().length === 5;

const Checkout = (props, defVal) => {
  const auth = useContext(AuthContext);
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    address: true,
    date: true,
    time:true,
    timeRange: true,
    message:true,
    cell: true
  });

  const nameInputRef = useRef();
  const addressInputRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();
  const additionalInfoRef = useRef();
  const cellRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();
    console.log("sdsds");
    const enteredName = nameInputRef.current.value;
    const enteredaddress = addressInputRef.current.value;
    const enteredmessage = additionalInfoRef.current.value;
    const enteredDate = dateRef.current.value;
    const enteredTime = timeRef.current.value;
    const enteredCell = cellRef.current.value;
    console.log("aa");
    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredaddressIsValid = !isEmpty(enteredaddress);
    const enteredmessageIsValid = true;
    let dateEntered = new Date(`${enteredDate}`); 
    let dateTimeEntered = new Date(`${enteredDate} ${enteredTime}`) 
    console.log(dateTimeEntered.getHours());
    const dateNow = new Date();
    const enteredDateIsValid = dateNow.getTime() <= (dateEntered.getTime() + 31 * 60 * 60 * 1000);
    const enteredTimeValid = dateNow.getTime() + 1000* 60 * 60 * 3 < dateTimeEntered.getTime();
    const enteredTimeRangeValid =   8 < dateTimeEntered.getHours() &&  22 > dateTimeEntered.getHours();
    const enteredCellValid = !isEmpty(enteredCell);

    setFormInputsValidity({
      name: enteredNameIsValid,
      address: enteredaddressIsValid,
      date: enteredDateIsValid,
      time: enteredTimeValid ,
      timeRange: enteredTimeRangeValid,
      message: enteredmessageIsValid,
      cell: enteredCellValid
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredaddressIsValid &&
      enteredmessageIsValid &&
      enteredTimeRangeValid &&
      enteredDateIsValid &&
      enteredTimeValid &&
      enteredCellValid
    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName,
      address: enteredaddress,
      date: enteredDate,
      time:enteredTime,
      message:enteredmessage,
      cell: enteredCell
    });
  };

  const nameControlClasses = `${classes.control} ${
    formInputsValidity.name ? '' : classes.invalid
  }`;
  const addressControlClasses = `${classes.control} ${
    formInputsValidity.address ? '' : classes.invalid
  }`;
  const dateControlClasses = `${classes.control} ${
    formInputsValidity.date ? '' : classes.invalid
  }`;
  const timeControlClasses = `${classes.control} ${
    formInputsValidity.time && formInputsValidity.timeRange ? '' : classes.invalid
  }`;
  const messageControlClasses = `${classes.control} ${
    formInputsValidity.message ? '' : classes.invalid
  }`;
  const cellControlClasses = `${classes.control} ${
    formInputsValidity.cell ? '' : classes.invalid
  }`;
  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameControlClasses}>
        <label htmlFor='name'>Your Name</label>
        <input type='text' id='name' ref={nameInputRef} defaultValue={props.defVal ? props.defVal.name: auth.name} />
        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={addressControlClasses}>
        <label htmlFor='address'>Address</label>
        <input type='text' id='address' ref={addressInputRef} defaultValue={props.defVal ? props.defVal.address: auth.address} />
        {!formInputsValidity.address && <p>Please enter a valid address!</p>}
      </div>
      <div className={dateControlClasses}>
        <label htmlFor='date'>Delivered Date</label>
        <input type='date' id='date' ref={dateRef} />
        {!formInputsValidity.date && <p>Please enter a valid date!</p>}
      </div>
      <div className={timeControlClasses}>
        <label htmlFor='time'>Delievered Time</label>
        <input type='time' id='time' ref={timeRef} />
        {!formInputsValidity.time && <p>Please enter a time at least 3 hours from now!</p>}
        {!formInputsValidity.timeRange && <p>Please pick a time between 8:00 am-10:00 pm!</p>}
      </div>
      <div className={cellControlClasses}>
        <label htmlFor='cell'>Cell</label>
        <input type='cell' id='cell' ref={cellRef} defaultValue={props.defVal ? props.defVal.cell: auth.cell} />
        {!formInputsValidity.cell && <p>Please enter a valid Cell</p>}
      </div>
      <div className={messageControlClasses}>
        <label htmlFor='msg'>Additional Message</label>
        <input type='text' id='msg' ref={additionalInfoRef} />
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

export default Checkout;
