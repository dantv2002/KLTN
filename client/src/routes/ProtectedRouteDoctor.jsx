import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRouteDoctor = ({ children }) => {
  
    const role = Cookies.get("Role")

    if (role === "DOCTOR") {
        return children
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

export default ProtectedRouteDoctor

ProtectedRouteDoctor.propTypes = {
    children: PropTypes.node.isRequired,
};