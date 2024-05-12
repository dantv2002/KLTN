import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home";
import RecordsManagement from "./pages/patient/RecordsManagement";
import GoogleLogin from "./models/auth/GoogleLogin";
import DashboardNurse from "./pages/nurse/DashboardNurse";
import RecordsManagementByNurse from './components/nurse/RecordsManagementByNurse';
import DashboardDoctor from "./pages/doctor/DashboardDoctor";
import RecordsManagementByDoctor from "./components/doctor/RecordsManagementByDoctor";
import DashboardReceptionist from "./pages/receptionist/DashboardReceptionist";
import RecordsManagementByReceptionist from "./components/receptionist/RecordsManagementByReceptionist";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AccountManagementByAdmin from "./components/admin/AccountManagementByAdmin";
import ScheduleManagementByAdmin from "./components/admin/ScheduleManagementByAdmin";
import UnregisteredManagementByAdmin from "./components/admin/UnregisteredManagementByAdmin";
import DoctorManagementByAdmin from "./components/admin/DoctorManagementByAdmin";
import NurseManagementByAdmin from "./components/admin/NurseManagementByAdmin";
import ReceptionistManagementByAdmin from "./components/admin/ReceptionistManagementByAdmin";
import MedicalManagementByAdmin from "./components/admin/MedicalManagementByAdmin";
import DataStatisticsManagementByAdmin from "./components/admin/DataStatisticsManagementByAdmin";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/oauth2/redirect' element={<GoogleLogin/>}/>
      <Route path='/records' element={<RecordsManagement/>}/>
      <Route element={<DashboardNurse/>}>
        <Route path='/nurse/records' element={<RecordsManagementByNurse/>}/>
      </Route>
      <Route element={<DashboardDoctor/>}>
        <Route path='/doctor/records' element={<RecordsManagementByDoctor/>}/>
      </Route>
      <Route element={<DashboardReceptionist/>}>
        <Route path='/receptionist/records' element={<RecordsManagementByReceptionist/>}/>
      </Route>
      <Route element={<DashboardAdmin/>}>
        <Route path='/admin/statistic' element={<DataStatisticsManagementByAdmin/>}/>
        <Route path='/admin/account1' element={<AccountManagementByAdmin/>}/>
        <Route path='/admin/account2' element={<UnregisteredManagementByAdmin/>}/>
        <Route path='/admin/doctor' element={<DoctorManagementByAdmin/>}/>
        <Route path='/admin/nurse' element={<NurseManagementByAdmin/>}/>
        <Route path='/admin/receptionist' element={<ReceptionistManagementByAdmin/>}/>
        <Route path='/admin/medical' element={<MedicalManagementByAdmin/>}/>
        <Route path='/admin/schedule' element={<ScheduleManagementByAdmin/>}/>
      </Route>
    </Routes>
  );
};

export default App;
