import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRouteAdmin = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === "ADMIN") {
        return children
    }
    if (role === "DOCTOR"){
        return <Navigate to='/doctor/medical' replace />
    }
    if (role === "NURSE"){
        return <Navigate to='/nurse/medical' replace />
    }
    if (role === "RECEPTIONIST"){
        return <Navigate to='/receptionist/records' replace />
    }
    return <Navigate to='/' replace />
}

export default ProtectedRouteAdmin

ProtectedRouteAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};




