import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRouteGuess = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === undefined) {
        return children
    }
    if (role === "PATIENT") {
        return <Navigate to='/admin/statistic' replace />
    }
    if (role === "ADMIN"){
        return <Navigate to='/admin/statistic' replace />
    }
    if (role === "DOCTOR"){
        return <Navigate to='/doctor/medical' replace />
    }
    if (role === "DOCTOR_DIAGNOSTIC_IMAGING") {
        return <Navigate to='/doctor/diagnosis' replace />
    }
    if (role === "NURSE"){
        return <Navigate to='/nurse/medical' replace />
    }
    if (role === "RECEPTIONIST"){
        return <Navigate to='/receptionist/records' replace />
    }
}

export default ProtectedRouteGuess

ProtectedRouteGuess.propTypes = {
    children: PropTypes.node.isRequired,
};