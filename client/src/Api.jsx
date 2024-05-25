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
export const getRecordReceptionist = (keyword, gender, year, page) => `${host}/api/receptionist/records?keyword=${keyword}&gender=${gender}&year=${year}&page=${page}`
//Create record by receptionist
export const createRecordReception = `${host}/api/receptionist/record/new`
//Update record by receptionist
export const updateRecordReception = `${host}/api/receptionist/record`


//Account

//Get account by admin
export const getAccount = (keyword, type, page) => `${host}/api/admin/accounts?keyword=${keyword}&type=${type}&page=${page}`
//Lock/Unlock account by admin
export const lockunlockAcount = (id) => `${host}/api/admin/account/set-active/${id}`
//Renew password by admin
export const renewPassword = `${host}/api/admin/account/reset-password`
//Delete account by admin
export const deleteAccount = (id) => `${host}/api/admin/account/${id}`
//Staff unregistered by admin
export const unregisteredAccount = (keyword, type, page) => `${host}/api/admin/healthcare-staffs/account?keyword=${keyword}&type=${type}&page=${page}`
//Create account staff by admin
export const createAccount = (id) => `${host}/api/admin/account/new/${id}`

// Health Staff

//Get doctor by admin
export const getDoctor = (keyword, title, department, gender, page) => `${host}/api/admin/healthcare-staffs?type=doctor&keyword=${keyword}&title=${title}&department=${department}&gender=${gender}&page=${page}` 
//Get nurse by admin
export const getNurse = (keyword, page) => `${host}/api/admin/healthcare-staffs?type=nurse&keyword=${keyword}&page=${page}`
//Get receptionist by admin
export const getReceptionist = (keyword, page) => `${host}/api/admin/healthcare-staffs?type=receptionist&keyword=${keyword}&page=${page}`
//Create staff by admin
export const createStaff = `${host}/api/admin/healthcare-staff/new`
//Update staff by admin
export const updateStaff = `${host}/api/admin/healthcare-staff`
//Delete staff by admin
export const deleteStaff = (id) => `${host}/api/admin/healthcare-staff/${id}`
//Get doctor by patient
export const getDoctorPatient = (keyword, title, department, gender, page) => `${host}/api/patient/doctors?keyword=${keyword}&title=${title}&department=${department}&gender=${gender}&page=${page}`

//Schedule

//Get all by admin
export const getSchedule = (id, page) => `${host}/api/admin/schedules/${id}?page=${page}`
//Create by admin
export const createSchedule = (id) => `${host}/api/admin/schedule/new/${id}`
//Update by admin
export const updateSchedule = (id) => `${host}/api/admin/schedules/${id}`
//Get list schedule by receptionist
export const getListSchedule = (id) => `${host}/api/receptionist/schedules/${id}`
//Register number schedule by receptionist
export const registerNumberSchedule = (id) => `${host}/api/receptionist/register-clinic/${id}`
//Get schedule by patient
export const getSchedulePatient = (id, page) => `${host}/api/patient/schedules/${id}?page=${page}`
//Get schedule option by patient
export const getScheduleOption = (id, time) => `${host}/api/patient/schedule/get-time/${id}/${time}`

//Ticker
//Create ticker by patient
export const createTicker = (idDoctor, idSchedule, idRecord) => `${host}/api/patient/ticket/new/${idDoctor}/${idSchedule}/${idRecord}`
//Get ticker by patient
export const getTicket = (status, page) => `${host}/api/patient/tickets?status=${status}&page=${page}`

//Medical

//Get medical out of date by admin
export const getEndMedical = (keyword, type, page) => `${host}/api/admin/medicals?keywork${keyword}=&type=${type}&page=${page}`
//Delete medical out of date by admin
export const deleteEndMedical = (id) => `${host}/api/admin/medical/${id}`
//Delete all medical out of date by admin
export const deleteAllEndMedical = `${host}/api/admin/medicals`
//Get medical by patient
export const getMedicalPatient = (id, keyword, page) => `${host}/api/patient/medicals?record=${id}&keyword=${keyword}&page=${page}`
//Get biosignal by patient
export const getBiosignalPatient = (id) => `${host}/api/patient/biosignal-statistical/${id}`

//Department
//Get department
export const getDepartment = (keyword, page) => `${host}/api/receptionist/departments?keyword=${keyword}&page=${page}`
//Create department by admin
export const createDepartment = `${host}/api/admin/department/new`
//Update department by admin
export const updateDepartment = `${host}/api/admin/department`
//Delete department by admin
export const deleteDepartment = (id) => `${host}/api/admin/department/${id}`

//Dashboard
//Data Statistics by admin
export const getDataStatistics = `${host}/api/admin/dashboard`