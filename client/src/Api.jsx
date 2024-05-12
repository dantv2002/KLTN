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

// Record

//New records by patient
export const newRecordsPatient = `${host}/api/patient/record/new`
//Get all records by patient
export const getAllRecordsPatient = `${host}/api/patient/records`
//Update record by patient
export const updateRecordPatient = `${host}/api/patient/record`
//Delete record
export const deleteRecord = (id) => `${host}/api/patient/record/${id}`
//Get record by receptionist
export const getRecordReceptionist = (gender, keyword, year) => `${host}/api/receptionist/records?gender=${gender}&keyword=${keyword}&year=${year}`
//Create record by receptionist
export const createRecordReception = `${host}/api/receptionist/record/new`
//Update record by receptionist
export const updateRecordReception = `${host}/api/receptionist/record`


//Account

//Get account by admin
export const getAccount = (keyword, type) => `${host}/api/admin/accounts?keyword=${keyword}&type=${type}`
//Lock/Unlock account by admin
export const lockunlockAcount = (id) => `${host}/api/admin/account/set-active/${id}`
//Renew password by admin
export const renewPassword = `${host}/api/admin/account/reset-password`
//Delete account by admin
export const deleteAccount = (id) => `${host}/api/admin/account/${id}`
//Staff unregistered by admin
export const unregisteredAccount = (type, keyword) => `${host}/api/admin/healthcare-staffs/account?type=${type}&keyword=${keyword}`
//Create account staff by admin
export const createAccount = (id) => `${host}/api/admin/account/new/${id}`

// Health Staff

//Get doctor by admin
export const getDoctor = (keyword, title, department, gender) => `${host}/api/admin/healthcare-staffs?type=doctor&keyword=${keyword}&title=${title}&department=${department}&gender=${gender}` 
//Get nurse by admin
export const getNurse = (keyword) => `${host}/api/admin/healthcare-staffs?type=nurse&keyword=${keyword}`
//Get receptionist by admin
export const getReceptionist = (keyword) => `${host}/api/admin/healthcare-staffs?type=receptionist&keyword=${keyword}`
//Create staff by admin
export const createStaff = `${host}/api/admin/healthcare-staff/new`
//Update staff by admin
export const updateStaff = `${host}/api/admin/healthcare-staff`
//Delete staff by admin
export const deleteStaff = (id) => `${host}/api/admin/healthcare-staff/${id}`
//Get doctor by patient
export const getDoctorPatient = (keyword, title, department, gender) => `${host}/api/patient/doctors?keyword=${keyword}&title=${title}&department=${department}&gender=${gender}`

//Schedule

//Get all by admin
export const getSchedule = (id) => `${host}/api/admin/schedules/${id}`
//Create by admin
export const createSchedule = (id) => `${host}/api/admin/schedule/new/${id}`
//Update by admin
export const updateSchedule = (id) => `${host}/api/admin/schedules/${id}`
//Get list schedule by receptionist
export const getListSchedule = (id) => `${host}/api/receptionist/schedules/${id}`
//Register number schedule by receptionist
export const registerNumberSchedule = (id) => `${host}/api/receptionist/register-clinic/${id}`
//Get schedule by patient
export const getSchedulePatient = (id) => `${host}/api/patient/schedules/${id}`

//Ticker
//Create ticker by patient
export const createTicker = (idDoctor, idSchedule, idRecord) => `${host}/api/patient/ticket/new/${idDoctor}/${idSchedule}/${idRecord}`


//Medical

//Get medical out of date by admin
export const getEndMedical = (keyword, type) => `${host}/api/admin/medicals?keywork${keyword}=&type=${type}`
//Delete medical out of date by admin
export const deleteEndMedical = (id) => `${host}/api/admin/medical/${id}`
//Delete all medical out of date by admin
export const deleteAllEndMedical = `${host}/api/admin/medicals`

//Department
//Get department
export const getDepartment = (keyword) => `${host}/api/receptionist/departments?keyword=${keyword}`
