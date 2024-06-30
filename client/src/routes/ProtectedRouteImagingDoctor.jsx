import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRouteImagingDoctor = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === "DOCTOR_DIAGNOSTIC_IMAGING") {
        return children
    }
    if (role === "DOCTOR") {
        return <Navigate to='/doctor/medical' replace />
    }
    if (role === "ADMIN"){
        return <Navigate to='/admin/statistic' replace />
    }
    if (role === "NURSE"){
        return <Navigate to='/nurse/medical' replace />
    }
    if (role === "RECEPTIONIST"){
        return <Navigate to='/receptionist/records' replace />
    }
    return <Navigate to='/' replace />
}

export default ProtectedRouteImagingDoctor

ProtectedRouteImagingDoctor.propTypes = {
    children: PropTypes.node.isRequired,
};