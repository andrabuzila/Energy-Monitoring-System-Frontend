import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { Navigate } from 'react-router-dom';

const ProtectedComponentAdmin = ({children}) => {
    const {userId, isLoggedIn} = useContext(AppContext)
    const [isUserAdmin, setIsUserAdmin] = useState(false)

    const isCurrentUserAdmin = async () => {
        try{
            if(userId!=null &&userId!="0"){
                const isAdmin = await axios.get(`http://localhost:8083/User/IsUserAdmin/${userId}`)
                setIsUserAdmin(isAdmin.data)
            }
        }catch (err) {
            console.log(err)
        }
    }

    useEffect (() => {
        (async () => await isCurrentUserAdmin())();
    },[])

    if(isLoggedIn){
        if(isUserAdmin){
            return children;
        }
    }
    else{
        return <Navigate to={'/'} />;
    }
}

export default ProtectedComponentAdmin;