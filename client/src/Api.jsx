export const host = "http://localhost:8080/emr"

// Auth

//Login
export const loginApi = `${host}/api/auth/login`
//Google
export const googleApi = `${host}/oauth2/authorize/google`
//Logout
export const logoutApi = `${host}/api/logout`
//Register
export const registerApi = `${host}/api/auth/register`
//Reset Password
export const resetApi = `${host}/api/auth/reset-password`
//Confirm
export const confirmApi = (type, id) => `${host}/api/auth/${type}/${id}`
//Change Password
export const changeApi = `${host}/api/update-password`

// Patient

//New records
export const newRecordsPatient = `${host}/api/patient/record/new`
//Get all records
export const getAllRecordsPatient = `${host}/api/patient/records`
