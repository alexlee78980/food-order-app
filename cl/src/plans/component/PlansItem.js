
import classes from './PlanItem.module.css';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../../context/auth-context';
import React,{ useContext, useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import {useNavigate, useParams} from 'react-router-dom';
import Modal from '../../other/Modal';
import ErrorModal from '../../error/ErrorModal';
import Button from '../../other/Button';
import DeleteModal from '../../other/DeleteModal';
const PlanItem = (props) => {
  const {isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const {id} = useParams();
  const [show, setShow] = useState(false);
  const[deletepop, setDeletePop] = useState(false);
  const navigate = useNavigate();
  const [scrollPlace, setScroll] = useState(0);

  var scroll;
  window.addEventListener("scroll", function(){
    scroll = window.scrollY;
});

  const buyNowHandler = (event) => {
    event.preventDefault();
      if (auth.isLoggedIn){
        auth.addBuyNow(props.item);
      }else{
       navigate('/login');
      }
  };
  const deletePopup = () => {
    setDeletePop(true);
  };
  const closeHandler = () => {
    setDeletePop(false);
    setShow(false);
  };
  const deleteHandler = async(event) => {
    event.preventDefault();
    let request;
    try{
    request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/plan/deleteplan`, 'DELETE',  JSON.stringify({
      id: props.item.id,
    }),
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.token
    });}
    catch(err){
      console.log(err);
    }
    console.log("delete");
    props.fetch();
    setDeletePop(false);
  };

  const openModal = () => {
    const val = scroll;
    setScroll(val);
    window.scrollTo(1, 0)
    setShow(true);
  };
  const closeModal = () => {
    window.scrollTo(0, scrollPlace)
    setShow(false);
  };
  console.log(show);
    return (<React.Fragment>
    {show && <Modal>
      <form className={classes.card}>
  <img className={classes.containerImg} src={props.item.image} alt=""/>
  <div className={classes.cardBody}>
    <h3 className={classes.cardTitle}>{props.item.name}</h3>
    <h4 className={classes.cardFrom}>${props.item.price}</h4>
    <h4 className={classes.cardFrom}>{props.item.meals}x</h4>
    <p>{props.item.description}</p>
    <div className={classes.btnDiv1}>
    {/* <button class={classes.btn} type="button"> Buy now</button>
    <div className={classes.btnDiv2}/> */}
    {deletepop && <DeleteModal onClick={deleteHandler} heading={`Are you sure you want to delete ${props.item.name}?`} onClose={closeHandler}></DeleteModal>}
    <Button onClick={closeModal}>Cancel</Button>
    <Button className={classes.btn} type="button" onClick={buyNowHandler}><FontAwesomeIcon icon={faCartShopping}/> Buy Now</Button>
    {auth.employee && <Button onClick={deletePopup}  className={classes.delete} type="button">Delete</Button>}
  </div>
  </div>
</form></Modal>}
{error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
      <div className={classes.cardBox}>
        <form className={classes.card}>
        <div onClick={openModal}>
  <img className={classes.containerImg} src={props.item.image} alt=""/>
  <div className={classes.cardBody}>
    <h3 className={classes.cardTitle}>{props.item.name}</h3>
    <h4 className={classes.cardFrom}>${props.item.price}</h4>
    <h4 className={classes.cardFrom}>{props.item.meals}x</h4>
    <div className={classes.textBox}>
    <p>{props.item.description}</p>
    </div>
    </div>
    </div>
    <div className={classes.btnDiv1}>
    {/* <button class={classes.btn} type="button"> Buy now</button>
    <div className={classes.btnDiv2}/> */}
    {deletepop && <DeleteModal onClick={deleteHandler} heading={`Are you sure you want to delete ${props.item.name}?`} onClose={closeHandler}></DeleteModal>}
    <Button className={classes.btn} type="button" onClick={buyNowHandler}><FontAwesomeIcon icon={faCartShopping}/> Buy Now</Button>
    {auth.employee && <Button onClick={deletePopup}  className={classes.delete} type="button">Delete</Button>}

  </div>
</form>
</div>
</React.Fragment>);
};
export default PlanItem;