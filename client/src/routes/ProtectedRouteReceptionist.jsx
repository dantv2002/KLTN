import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRouteReceptionist = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === "RECEPTIONIST") {
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
    return <Navigate to='/' replace />
}

export default ProtectedRouteReceptionist

ProtectedRouteReceptionist.propTypes = {
    children: PropTypes.node.isRequired,
};