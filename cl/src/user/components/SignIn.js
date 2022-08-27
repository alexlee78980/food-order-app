import { useState, useContext } from 'react';
import './SignIn.css'
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../other/Card';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import Button from '../../other/Button';
import ErrorModal from '../../error/ErrorModal';
import WhiteCard from '../../other/WhiteCard';
import LoadingSpinner from '../../other/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
const SignIn = () => {
  const [signup, setSignUp] = useState(false);
  const auth = useContext(AuthContext);
  const nav = useNavigate();
  const [update, setUpdate] = useState(false);
  const [userName, setUserName] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userCell, setUserCell] = useState('');
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [cell, setCell] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const switchLoginHandler = () => {
    setSignUp(false);
  };
  const userNameHandler = (event) => {
    setUserName(event.target.value);
  };
  const userEmailHandler = (event) => {
    setUserEmail(event.target.value);
  };
  const userPasswordHandler = (event) => {
    setUserPassword(event.target.value);
  };
  const confirmPasswordHandler = (event) => {
    setconfirmPassword(event.target.value);
  };
  const userAddressHandler = (event) => {
    setUserAddress(event.target.value);
  };
  const userCellHandler = (event) => {
    setUserCell(event.target.value);
  };
  const switchSignUpHandler = () => {
    setSignUp(true);
  };


  const logInHandler = async(event) => {
    event.preventDefault();
    let request;
    try{
    request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/login`, 'POST',  JSON.stringify({
      email: useremail,
      password: userPassword
    }),
    {
      'Content-Type': 'application/json',
      
    }
  );
  console.log(request.cell);
  auth.loginFunction(request.userId, request.email,  request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
  }catch(err){
    console.log(err);
  };
  }


  const signUpHandler = async(event) => {
  event.preventDefault();
  let request;
  try{
  request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/signup`, 'POST',  JSON.stringify({
    email: useremail,
    password: userPassword,
    name: userName,
    address: userAddress,
    cell: userCell
  }),
  {
    'Content-Type': 'application/json'
  }
);
  auth.loginFunction(request.userId, request.email,  request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
}catch(err){
  console.log(err);
};}

const updateInfo = () =>{
  setUpdate(true);
};

const updateConfirm = async(event) =>{
  event.preventDefault();
  let request;
  try{
  request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/updateuser`, 'PATCH',  JSON.stringify({
    name,
    address,
    cell,
  }),
  {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + auth.token
  }
)
auth.loginFunction(request.userId, request.email, request.name, request.address, request.meals, request.employee, request.cell, request.token, request.validated, request.validated);
setUpdate(false);
} catch(err){
  console.log(err);
}
}

const cancel = () =>{
  setUpdate(false);
};

const changeName = (event) =>{
  setName(event.target.value)
};

const changeAddress = (event) =>{
  setAddress(event.target.value)
};

const changeCell = (event) =>{
  setCell(event.target.value)
};
const navPlanHandler = () =>{
  nav('/plans');
};
console.log(name);
  let user;
  if (!auth.isLoggedIn) {
    user = <Card>
      <div className='center'>
        <FontAwesomeIcon icon={faUser} size="7x" />
      </div>
      <section className="forms-section">
        <div className="forms">
          <div className={`form-wrapper ${!signup && 'is-active'}`}>
            <button type="button" onClick={switchLoginHandler} className="switcher switcher-login">
              Login
              <span className="underline"></span>
            </button>
            <form className="form form-login" onSubmit={logInHandler}>
              <fieldset>
                <legend>Please, enter your email and password for login.</legend>
                <div className="input-block">
                  <label for="login-email">E-mail</label>
                  <input id="login-email" type="email" required onChange={userEmailHandler} value={useremail} />
                </div>
                <div className="input-block">
                  <label for="login-password">Password</label>
                  <input id="login-password" type="password" required onChange={userPasswordHandler} value={userPassword} />
                </div>
              </fieldset>
              <button type="submit" className="btn-login">Login</button>
              <div className='Link'>
              <Link to="/resetpassword">forgot password</Link>
              </div>
            </form>
          </div>
          <div className={`form-wrapper ${signup && 'is-active'}`}>
            <button type="button" onClick={switchSignUpHandler} className="switcher switcher-signup">
              Sign Up
              <span className="underline"></span>
            </button>
            <form className="form form-signup" onSubmit={signUpHandler}>
              <fieldset>
                <legend>Please, enter your email, password and password confirmation for sign up.</legend>
                <div className="input-block">
                  <label for="signup-name">Name</label>
                  <input id="signup-name" type="text" required onChange={userNameHandler} value={userName} />
                </div>
                <div className="input-block">
                  <label for="signup-email">E-mail</label>
                  <input id="signup-email" type="email" required onChange={userEmailHandler} value={useremail} />
                </div>
                <div className="input-block">
                  <label for="signup-password">Password (at least 6 characters)</label>
                  <input id="signup-password" type="password" required onChange={userPasswordHandler} value={userPassword} />
                </div>
                <div className="input-block">
                  <label for="signup-password-confirm">Confirm password (at least 6 characters)</label>
                  <input id="signup-password-confirm" type="password" required onChange={confirmPasswordHandler} value={confirmPassword} />
                </div>
                <div className="input-block">
                  <label for="signup-Address">Address</label>
                  <input id="signup-Address" type="address" required onChange={userAddressHandler} value={userAddress} />
                </div>
                <div className="input-block">
                  <label for="signup-Address">Cell</label>
                  <input id="signup-Address" type="address" required onChange={userCellHandler} value={userCell} />
                </div>
              </fieldset>
              <button type="submit" className="btn-signup">Sign Up</button>
            </form>
          </div>
        </div>
      </section>
    </Card>
  } else {
user = !update ? <Card>
  <h1>
    Welcome!!!</h1> <h1> {auth.name} 
  </h1>
  <WhiteCard>
  <h4>Name: {auth.name} </h4>
  <h4><b> Delivery Address: </b> {auth.address}</h4>
  <h4>Cell: {auth.cell} </h4>
  <h4>Meals remaining: {auth.meals} </h4>
  <div className='buttonDiv'>
  <Button onClick={auth.logout}>Logout</Button>
  <Button onClick={navPlanHandler}>Buy Plan</Button>
  <Button onClick={updateInfo}>Update</Button>
  </div>
  </WhiteCard>
</Card> :  <Card>
  <h1>
    Welcome!!!</h1> <h1> {auth.name} 
  </h1>
  <WhiteCard>
  <h4>Name: <input onChange={changeName} value={name} defaultValue={auth.name}/> </h4>
  <h4>Delivery Address: <input onChange={changeAddress} value={address} defaultValue={auth.address}/></h4>
  <h4>Cell: <input onChange={changeCell} value={cell} defaultValue={auth.cell}/> </h4>
  <h4>Meals remaining: {auth.meals} </h4>
  <div className='buttonDiv'>
  <Button onClick={updateConfirm}>Done</Button>
  <Button onClick={cancel}>Cancel</Button>
  </div>
  </WhiteCard>
</Card>

  }
  return (  <div>
    {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {isLoading && <LoadingSpinner/>}
    <ErrorModal error={error} onClear={clearError}></ErrorModal>
    {user}
  </div>
  );
};

export default SignIn;