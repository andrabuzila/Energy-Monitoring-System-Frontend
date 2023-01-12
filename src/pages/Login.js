import { useContext, useState } from "react";
import "../styles/login.scss"
import "../styles/pageStyle.scss"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

const Login = () => {
    const {setIsLoggedIn, setUserId, setUserRole} = useContext(AppContext)
    const [emailValue, setEmailValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const navigate = useNavigate()

    const onEmailChanged = (e) => {
        setEmailValue(e.target.value);
    }

    const onPasswordChanged = (e) => {
        setPasswordValue(e.target.value);
    }

    const onButtonClicked = async () => {
        const params = {
            email: emailValue,
            password: passwordValue
        }
        var userCanLogin = await axios.post(`http://localhost:8083/User/IsUserVerified`, params)
        if(userCanLogin.data){
            var id = await axios.post(`http://localhost:8083/User/GetUserId`, params)
            var email = emailValue
            var userRole = await axios.post(`http://localhost:8083/User/UserRole/${email}`)
            setUserRole(userRole.data)
            setIsLoggedIn(true)
            setUserId(id.data)
            if(userRole.data === "administrator"){
                navigate('/admin-page')
            }
            else{
                navigate('/user-dashboard')
            }
        }
    }

    return (
        <div className="login-page">
            <h2>Login</h2>
            <p>Please complete the login process if you want to enter into your account.</p>
            <div className="form-input email">
                <input className="email"
                type="text"
                placeholder="Email"
                onChange= {(e) => {onEmailChanged(e)}}
                value={emailValue} />
            </div>
            <div className="form-input">
            <input
                type="password"
                placeholder="Password" 
                value={passwordValue}
                onChange= {(e) => {onPasswordChanged(e)}}/>
            </div>
            <button className="my-btn"
            onClick={onButtonClicked}>
                Login
            </button>
        </div>
    )
}

export default Login;