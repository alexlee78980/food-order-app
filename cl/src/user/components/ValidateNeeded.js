import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Card from "../../other/Card";
import Button from "../../other/Button";
import { useHttpClient } from "../../hooks/http-hook";
import WhiteCard from "../../other/WhiteCard";
import ErrorModal from "../../error/ErrorModal";
import LoadingSpinner from "../../other/LoadingSpinner";

const ValidateNeeded = () => {
    const auth = useContext(AuthContext);
    const[clicked, setClicked] = useState();
    const[email, setEmail] = useState();
    useEffect(() =>{
      if(auth.email){
        setEmail(auth.email);
      }},[]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const sendValidation = async() =>{
            console.log(email);
            console.log("aaa");
            let request;
            try{
            request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/sendvalidate`, 'POST',  JSON.stringify({
                email:email || auth.email
            }),
            {
              'Content-Type': 'application/json'
            }
          );  
          setClicked(true);
          return;
        } catch(err){
            console.log(err);
          }
        setClicked(false);
    };
    const emailChangeHandler = (event) =>{
      setEmail(event.target.value);
    };

    return <Card>    <h1>Validation</h1>
     <WhiteCard>
     {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {isLoading && <LoadingSpinner/>}
        Validation needed for <input type='email' value={email} onChange={emailChangeHandler}/>!
        {clicked && <p>validation sent to {auth.email}, please check your spam folders as well!</p>}
        <div>
        <Button onClick={sendValidation}>Send Validation</Button>
        </div>
    </WhiteCard></Card>
};

export default ValidateNeeded;