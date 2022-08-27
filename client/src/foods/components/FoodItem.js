import Card from '../../other/Card';
import classes from './FoodItem.module.css';
import { faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import React,{ useContext, useState } from 'react';
import { AuthContext } from '../../context/auth-context';
import Button from '../../other/Button';
import { useHttpClient } from '../../hooks/http-hook';
import DeleteModal from '../../other/DeleteModal';
import LoadingSpinner from '../../other/LoadingSpinner';
import ErrorModal from '../../error/ErrorModal';
import Modal from '../../other/Modal';
const FoodItem = (props) => {
  const {isLoading, error, sendRequest, clearError } = useHttpClient();
  const [show, setShow] = useState(false);
  const auth = useContext(AuthContext);
  const[deletepop, setDeletePop] = useState(false);
  const navigate = useNavigate();
  const [scrollPlace, setScroll] = useState(0);

  var scroll;
  window.addEventListener("scroll", function(){
    scroll = window.scrollY;
});


  const buyNow = (event) => {
    event.preventDefault();
      if (auth.isLoggedIn){
        auth.addtoCart({...props.item, amount:1});
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

  const openModal = () => {
    const val = scroll;
    setScroll(val);
    console.log(val);
    window.scrollTo(1, 0)
    setShow(true);
  };
  const closeModal = () => {
    window.scrollTo(0, scrollPlace)
    setShow(false);
  };

  const deleteHandler = async(event) => {
    console.log(props.item.id);
    event.preventDefault();
    let request;
    try{
    request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/food/deletefood`, 'DELETE',  JSON.stringify({
      id: props.item.id,
    }),
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.token
    });}
    catch(err){
      console.log(err);
    }
    props.fetch();
    setDeletePop(false);
  };
    return (
      <React.Fragment>
      {show && <Modal>
        <form className={classes.card}>
    <div onClick={openModal}>
  <img className={classes.containerImg} src={props.item.image} alt=""/>
  <div className={classes.cardBody}>
    <h3 className={classes.cardTitle}>{props.item.name}</h3>
    <h3 className={classes.cardFrom}>{props.item.from}</h3>
    <p className="card-text">{props.item.description}</p>
    </div>
    </div>
    <div className={classes.btnDiv1}>
    {/* <button class={classes.btn} type="button"> Buy now</button>
    <div className={classes.btnDiv2}/> */}
    {deletepop && <DeleteModal onClick={deleteHandler} heading={`Are you sure you want to delete ${props.item.name}?`} onClose={closeHandler}></DeleteModal>}
    <Button onClick={closeModal}>Cancel</Button>
    <Button onClick={buyNow} className={classes.btn} type="button"><FontAwesomeIcon icon={faCartShopping}/> Add to Cart</Button>
    {auth.employee && <Button onClick={deletePopup}  className={classes.delete} type="button">Delete</Button>}
    </div>
</form></Modal>}
      {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {isLoading && <LoadingSpinner asOverlay />}
      <div className={classes.cardBox} >
    <form className={classes.card}>
    <div onClick={openModal}>
  <img className={classes.containerImg} src={props.item.image} alt=""/>
  <div className={classes.cardBody}>
    <h3 className={classes.cardTitle}>{props.item.name}</h3>
    <h3 className={classes.cardFrom}>{props.item.from}</h3>
    <div className={classes.textBox}>
    <p className="card-text">{props.item.description}</p>
    </div>
    </div>
    </div>
    <div className={classes.btnDiv1}>
    {/* <button class={classes.btn} type="button"> Buy now</button>
    <div className={classes.btnDiv2}/> */}
    {deletepop && <DeleteModal onClick={deleteHandler} heading={`Are you sure you want to delete ${props.item.name}?`} onClose={closeHandler}></DeleteModal>}
    <Button onClick={buyNow} className={classes.btn} type="button"><FontAwesomeIcon icon={faCartShopping}/> Add to Cart</Button>
    {auth.employee && <Button onClick={deletePopup}  className={classes.delete} type="button">Delete</Button>}
    </div>
</form>
</div>
</React.Fragment>);
};
export default FoodItem;