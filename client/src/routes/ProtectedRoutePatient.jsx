import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoutePatient = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === "PATIENT") {
        return children
    }
    if (role === "ADMIN"){
        return <Navigate to='/admin/statistic' replace />
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

export default ProtectedRoutePatient

ProtectedRoutePatient.propTypes = {
    children: PropTypes.node.isRequired,
};