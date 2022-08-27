import WhiteCard from "../../other/WhiteCard";
import Card from "../../other/Card";
import classes from "./ResetPassword.module.css";
import React, { useState, useContext, useEffect } from "react";
import ErrorModal from "../../error/ErrorModal";
import LoadingSpinner from "../../other/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../other/Button";
import { AuthContext } from "../../context/auth-context";
const Confirmation = () => {
    const auth =  useContext(AuthContext);
    const { token } = useParams();
    const navigate = useNavigate();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(()=>{
      const sendConfirm = async() =>{
        let request;
        try{
        request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/validate`, 'POST', JSON.stringify({
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      );
      auth.loginFunction(request.userId, request.email,request.name, request.address, request.meals, request.employee, request.cell, request.validated, request.token);
      navigate('/login');
      } catch(err){
        console.log(err);
      }
    }; sendConfirm()}, []);

    return <React.Fragment>
     {isLoading && <LoadingSpinner/>}
     </React.Fragment>
};
export default Confirmation;