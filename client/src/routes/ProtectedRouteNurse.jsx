import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRouteNurse = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === "NURSE") {
        return children
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
    if (role === "RECEPTIONIST"){
        return <Navigate to='/receptionist/records' replace />
    }
    return <Navigate to='/' replace />
}

export default ProtectedRouteNurse

ProtectedRouteNurse.propTypes = {
    children: PropTypes.node.isRequired,
};