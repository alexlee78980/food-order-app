import WhiteCard from "../../other/WhiteCard";
import Card from "../../other/Card";
import classes from "./ResetPassword.module.css";
import { useState, useContext } from "react";
import ErrorModal from "../../error/ErrorModal";
import LoadingSpinner from "../../other/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../other/Button";
import { AuthContext } from "../../context/auth-context";
const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const auth = useContext(AuthContext);
    const { token } = useParams();
    const navigate = useNavigate();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const sendReset = async(event) =>{
        event.preventDefault();
        let request;
        try{
        request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/resetpassword`, 'POST',  JSON.stringify({
            newPassword: newPassword
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      );
      auth.loginFunction(request.userId, request.email, request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
      navigate('/login');
      } catch(err){
        console.log(err);
      }

    }

    
    const newPasswordInputHandler = (event) =>{
        setNewPassword(event.target.value);
    };
    return <Card>
    {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
    {isLoading && <LoadingSpinner/>}
    <h1>Reset Password</h1>
        <WhiteCard>
 <form className={classes.form} onSubmit={sendReset}>
<div className={classes.newPassword}>
<h3>
<label>New Password: </label>
<input type='password' value={newPassword} onChange={newPasswordInputHandler}></input>
</h3>
</div>
<div className={classes.newPassoword}>
<Button type='submit'>Reset Password</Button>
</div>
</form>
</WhiteCard>
    </Card>
};
export default PasswordReset