
import classes from './OrderItem.module.css';
import {faCheck, faHourglass} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../../context/auth-context';
import React,{ useContext, useState } from 'react';
import Map from "../../other/Map";
import Modal from '../../other/Modal';
import {useNavigate} from 'react-router-dom';
import { useHttpClient } from '../../hooks/http-hook';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../../other/Button';
import ErrorModal from '../../error/ErrorModal';
import LoadingSpinner from '../../other/LoadingSpinner';
import DeleteModal from '../../other/DeleteModal';
import Checkout from '../../Cart/Checkout';
const OrderItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [update, setUpdate] = useState(false);
  // const navigate = useNavigate();
  const[deletepop, setDeletePop] = useState(false);
  const[finishedpop, setFinishedPop] = useState(false);
  const claimHandler = async(event) => {
    event.preventDefault();
      if (auth.employee){
        let request;
              try{
              request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/claimorder`, 'PATCH',  JSON.stringify({
                orderid: props.item.id
              }),
              {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
              });
      }catch(err){
        console.log(err);
      }
      props.reload();
    }
  }

  const deleteHandler = async(event) => {
    event.preventDefault();
        let request;
              try{
              request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/deleteorder`, 'DELETE',  JSON.stringify({
                orderid: props.item.id,
              }),
              {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
              });
        console.log(request.JSON);
      }catch(err){
        console.log(err);
      }
      auth.loginFunction(request.userId, request.email, request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
      setDeletePop(false);
      props.reload();
  }


  const finishedOrderHandler = async(event) => {
    event.preventDefault();
        let request;
              try{
              request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/finishedorder`, 'DELETE',  JSON.stringify({
                orderid: props.item.id,
              }),
              {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
              });
        console.log(request.JSON);
      }catch(err){
        console.log(err);
      }
      setFinishedPop(false);
      props.reload();
  }

  //TODO
  const updateHandler = async(event) => {
    event.preventDefault();
        let request;
              try{
              request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/deleteorder`, 'DELETE',  JSON.stringify({
                email: auth.email,
                orderid: props.item.id,
              }),
              {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
              });
        console.log(request.JSON);
      }catch(err){
        console.log(err);
      }
      props.reload();
  };


  const deletePopup = () => {
    setDeletePop(true);
  };

  const finishedPop = () => {
    setFinishedPop(true);
  };

  const closefinishedHandler = () => {
    setFinishedPop(false);
  };
  const closeHandler = () => {
    setDeletePop(false);
  };
  let urgent = (((new Date(`${props.item.date} ${props.item.time}`)- new Date())  / 1000 / 60 /60) < 2 && (( new Date(`${props.item.date} ${props.item.time}`)- new Date() )  / 1000 / 60 /60) > 0);
  urgent = auth.employee && urgent && !props.item.claimed;
    return (
      <React.Fragment>
      {update && <Modal><Checkout></Checkout></Modal>}
      {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {isLoading && <LoadingSpinner asOverlay />}
  {!update && <form className={`${classes.card} ${urgent ? classes.urgent : ''}`}>
  <img src={props.item.image} alt=""/>
  <div className={classes.cardBody}>
    <h3 className={classes.cardTitle}>{props.item.name} {urgent && <FontAwesomeIcon icon={faHourglass}/>}</h3>
    <p className={classes.cardFrom}>{props.item.email} || {props.item.cell}</p>
    <p className="card-text"><strong>Address:</strong> {props.item.address}</p>
    <div className={classes.mapContainer}>
    <Map center={props.item.location} zoom={16} />
    </div>
    <p className="card-text"><strong>Delievered Time: </strong>{props.item.date} at {props.item.time}</p>
    {props.item.meals.map(meal=><strong><p className="card-text">{meal.amount} {meal.name} from {meal.from}<br/></p></strong>)}
    <div className={classes.btnDiv1}>
    {deletepop && <DeleteModal onClick={deleteHandler} heading={`Are you sure you want to delete this order?`} onClose={closeHandler}></DeleteModal>}
    {finishedpop && <DeleteModal onClick={finishedOrderHandler} heading={`Confirm on completing order?`} onClose={closefinishedHandler}></DeleteModal>}
    {props.item.email == auth.email && <Button class={classes.btn} onClick={deletePopup} type="button"><FontAwesomeIcon icon={faXmark}/> Cancel Order</Button>}
    {/* <div className={classes.btnDiv2}/> */}
    {auth.employee && !props.item.claimed && <Button className={classes.btn} type="button" onClick={claimHandler}><FontAwesomeIcon icon={faCheck}/> Claim Order</Button>}
    {/* {props.item.email == auth.email  && <Button className={classes.btn} type="button"><FontAwesomeIcon icon={faCheck}/> Update Order</Button>} */}
    {auth.employee && props.item.claimed == auth.userId  && <Button className={classes.btn} onClick={finishedPop} type="button"><FontAwesomeIcon icon={faCheck}/> Finished Delivery</Button>}  
  </div>
  </div>
</form>}
</React.Fragment>);
};
export default OrderItem;