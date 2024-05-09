import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import replacePlusWithSpace from "../../content/ReplacePlusWithSpace";

const GoogleLogin = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
    
        if (location.pathname.includes("oauth2/redirect") && location.search.includes("message")) {
            const params = new URLSearchParams(location.search);
            let status = parseInt(params.get("status"), 10);
            let message = params.get("message");
            
            while (message.includes("%")) {
                message = decodeURIComponent(message);
            }
    
            if (status === 200) {
                sessionStorage.setItem("successMessage", replacePlusWithSpace(message));
                navigate("/");
            }
            if (status !== 200) {
                sessionStorage.setItem("errorMessage", replacePlusWithSpace(message));
                navigate("/");
            }
        } else {
            setLoading(false);
        }
    }, [location.pathname, location.search, navigate]);
    

    return (
        loading ? 
            <div className="absolute inset-0 flex items-center justify-center bg-white z-50 bg-opacity-50">
                <CircularProgress />
            </div>  
        :
            <div>
                
            </div>
    );
}

export default GoogleLogin;
