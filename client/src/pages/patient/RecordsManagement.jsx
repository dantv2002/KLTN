import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/home/Navbar"
import { CircularProgress } from "@mui/material";
import Records from "../../components/patient/Records";

const RecordsManagement = () => {

    const [loading, setLoading] = useState(true)
    const location = useLocation();

    useEffect(() => {
      setLoading(true)
  
      setTimeout(() =>{
        setLoading(false)
      },1000)
    },[location.pathname])

    return (
    loading ? 
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50 bg-opacity-50">
            <CircularProgress />
        </div>  
    :
        <div>
            <Navbar/>
            <Records/>    
        </div>
    )
}

export default RecordsManagement
