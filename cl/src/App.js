import React, {Suspense} from 'react';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
// import Food from './foods/Foods';
// import Home from './Home/Home';
 import MainHeader from './other/MainHeader';
// import Plans from './plans/plans';
// import Auth from './user/auth';
import image from './images/background.jpg'
import './App.css';
import Cart from './Cart/Cart';
import { useState } from 'react';
import { useEffect, useCallback, useContext} from 'react';
import BuyNow from './Cart/BuyNow';
import { AuthContext } from './context/auth-context';
// import Orders from './order/order';
import Add from './add/Add';
import { useHttpClient } from './hooks/http-hook';
import LoadingSpinner from './other/LoadingSpinner';
import PasswordReset from './user/components/PasswordReset';
import ValidateNeeded from './user/components/ValidateNeeded';
import Confirmation from './user/components/confirmation';
const ResetPassword = React.lazy(()=>import('./user/components/ResetPassword'));
const Home = React.lazy(()=>import ('./Home/Home'));
const Plans = React.lazy(()=>import ('./plans/plans'));
const Food = React.lazy(()=>import ('./foods/Foods'));
const Auth = React.lazy(()=>import ('./user/auth'));
const Orders = React.lazy(()=>import ('./order/order'));
function App() {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [cart, setCart] = useState(false);
  const [cartItem , setCartItem] = useState([]);
  const [foodItem , setFoodItem] = useState([]);
  const [token, setToken] = useState();
  const [address, setAddress] = useState();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [total, setTotal] = useState(0);
  const [employee, setEmployee] = useState(false);
  const [meals, setMeals] = useState(0);
  const [tokenExpirationDate,setTokenExpirationDate] = useState();
  const [cell, setCell] = useState();
  const [validated, setValidated] = useState();
  const [userId, setUserId] = useState();
  const [buyNow, setBuyNow] = useState();
  const loginFunction = useCallback((uid, email, name, address, meals, employee, cell, validated, token, expirationDate) => {
    setEmail(email);
    if(!validated){
      navigate('/validate');
      console.log(validated);
      console.log('not validated');
      return
    }

    setUserId(uid);
    setValidated(validated);
    console.log("logged In");
    const tokenExpirationDate = expirationDate ||new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    setEmployee(employee);
    setName(name);
    setEmail(email);
    setAddress(address);
    setToken(token);
    setMeals(meals);
    setCell(cell);
    setToken(token);
    localStorage.setItem('userData', JSON.stringify({userId: uid, email, name, address, meals, employee, cell, token: token, expiration: tokenExpirationDate.toISOString()
    }));
  }, []);

  const logout = useCallback(() => {
    setEmployee(false);
    setUserId(null);
    setName(null);
    setEmail(null);
    setCell(null);
    setAddress(null);
    setMeals(0);
    setToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('cart');
  }, []);


  useEffect(()=>{
    const call = async() => {
    const stored = JSON.parse(localStorage.getItem('userData'));
    if (stored && stored.token && new Date(stored.expiration) > new Date()){
      let request;
      try{
      request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/logintoken`, 'POST',  JSON.stringify({
      }),
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + stored.token
    }
  );
  console.log(request.userId);
  loginFunction(request.userId, request.email, request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token, stored.tokenExpirationDate);
  const storedCart= JSON.parse(localStorage.getItem('cart'));
  // if (storedCart && storedCart.cart);{
  //   setCartItem(storedCart.cart);
  //   setTotal(storedCart.cart.length);
  // };
  }catch(err){
    console.log(err);
  };
  }}
  call();
  },[loginFunction]);

  const showCartHandler = () => {
    window.scrollTo(0, 0);
    setCart(true);
  }
  const hideCartHandler = () => {
    setCart(false);
  }

  const hideBuyNowHandler = () => {
    setBuyNow(null);
  }
  const addtoCart = (item) => {
    setTotal(prev=> prev + item.amount);
    const existingCartItemIndex = cartItem.findIndex(
      (i) => i.id === item.id
    );
    const existingCartItem = cartItem[existingCartItemIndex];
    if (existingCartItem){
    const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + item.amount,
      }
      let updatedItems = [...cartItem];
      updatedItems[existingCartItemIndex] = updatedItem;
      setCartItem(updatedItems)
    }else{
      // localStorage.setItem('cart', JSON.stringify({cart: [...prev, item]}))
    setCartItem(prev=>{;
      return [...prev, item];});
    }
  };


  const setItemtoCart = (item, amount) => {
    console.log(amount);
    const existingCartItemIndex = cartItem.findIndex(
      (i) => i.id === item.id
    );
    const existingCartItem = cartItem[existingCartItemIndex];
    if(!amount){
      setTotal((prev=> parseInt(prev) - parseInt(existingCartItem.amount)));
      const updatedItem = {
        ...existingCartItem,
        amount: 0,
      }
      let updatedItems = [...cartItem];
      updatedItems[existingCartItemIndex] = updatedItem;
      setCartItem(updatedItems)
      return
  };
    console.log(item);
    setTotal(prev=> parseInt(prev) + parseInt(amount) - parseInt(existingCartItem.amount));
    const updatedItem = {
        ...existingCartItem,
        amount: amount,
      }
      let updatedItems = [...cartItem];
      updatedItems[existingCartItemIndex] = updatedItem;
      setCartItem(updatedItems)
  };

  const addOnetoCart = (id) => {
    console.log(cartItem);
    console.log(id);
    setTotal(prev=> prev + 1);
    const existingCartItemIndex = cartItem.findIndex(
      (i) => i.id === id
    );
    const existingCartItem = cartItem[existingCartItemIndex];
    const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + 1,
      }
      let updatedItems = [...cartItem];
      updatedItems[existingCartItemIndex] = updatedItem;
      setCartItem(updatedItems)
  };

  const removeOneFromCart = (id) => {
    setTotal(prev=> prev - 1);
    const existingCartItemIndex = cartItem.findIndex(
      (i) => i.id === id
    );
    const existingItem = cartItem[existingCartItemIndex];
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = cartItem.filter(i => i.id !== id);
    }else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...cartItem];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    setCartItem(updatedItems);
  };
  const addBuyNow = (item) =>{
    setBuyNow(item);
  };


  const addtoFoods = (item) => {
    setFoodItem(prev=>[...prev, item]);
  };
  const clearCart = () => {
    setCartItem([]);
    setTotal(0);
  }
  return (
    <div className='format'>
    <img src={image} className="background"></img>
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, userId:userId, token, email, cart:cartItem, total, food:foodItem, address, name, meals, buyNow, employee, cell,  setItemtoCart, addOnetoCart, removeOneFromCart, loginFunction: loginFunction, logout: logout, addtoCart, addtoFoods, addBuyNow}}
    >
    <MainHeader cart={showCartHandler}/>
    <div className='main'>
    {cart &&<Cart onClose={hideCartHandler} onClear={clearCart} />}
    {buyNow &&<BuyNow onClose={hideBuyNowHandler} />}
    <Suspense fallback={<div className='center'><LoadingSpinner/></div>}>
    <main>
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/login" element={<Auth/>}/>
      <Route path="/plans" element={<Plans/>}/>
      <Route path="/plans/:id" element={<Plans/>}/>
      <Route path="/foods" element={<Food/>}/>
      <Route path="/resetpassword" element={<ResetPassword/>}/>
      <Route path="/resetpassword/:token" element={<PasswordReset/>}/>
      <Route path="/validate" element={<ValidateNeeded/>}/>
      <Route path="/confirmation/:token" element={<Confirmation/>}/>
      {employee &&
      <Route path="/add" element={<Add/>}/>}
      <Route path="/orders" element={(!!token) ? <Orders/> : <Auth/>}/>
      {/* <Route path="/*" element={<Navigate to="/home" replace/>}/> */}
    </Routes>
    </main>
    </Suspense>
    </div>
    </AuthContext.Provider>
    </div>
  );
}

export default App;
