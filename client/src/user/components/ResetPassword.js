import WhiteCard from "../../other/WhiteCard";
import Card from "../../other/Card";
import classes from "./ResetPassword.module.css";
import { useState } from "react";
import ErrorModal from "../../error/ErrorModal";
import LoadingSpinner from "../../other/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import Button from "../../other/Button";
const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [submitted, setSubmitted] = useState(false);
    const sendReset = async(event) =>{
        event.preventDefault();
        let request;
        try{
        request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/sendresetpassword`, 'POST',  JSON.stringify({
          email:email
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      setSubmitted(true);
      } catch(err){
        console.log(err);
      }
    }
    
    const emailInputHandler = (event) =>{
        setEmail(event.target.value);
    };
    return <Card>
    {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
    {isLoading && <LoadingSpinner/>}
    <h1>Reset Password</h1>
        <WhiteCard>
{!submitted && <form className={classes.form} onSubmit={sendReset}>
<div className={classes.email}>
<h3>
<label>Email: </label>
<input type='email' value={email} onChange={emailInputHandler}></input>
</h3>
</div>
<div className={classes.email}>
<Button type='submit'>Reset Password</Button>
</div>
</form>}
{submitted && 
<h2>Check the email entered for password reset link! Email may be sent to spam folder!</h2>
}
</WhiteCard>
    </Card>
};
export default ResetPassword