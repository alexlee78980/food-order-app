import React from "react"
import { useEffect } from "react";
import Card from "../other/Card";
import SignIn from "./components/SignIn";
// const [formState, inputHandler, setFormData] = useForm(
//     {
//       email: {
//         value: '',
//         isValid: false
//       },
//       password: {
//         value: '',
//         isValid: false
//       }
//     },
//     false
//   );
const Auth = () =>  {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);
    return (<Card>
        <SignIn></SignIn>
    </Card>
    );
};

export default Auth;
