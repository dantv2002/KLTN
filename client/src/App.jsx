import {Routes, Route, useLocation} from "react-router-dom"
import { useEffect } from 'react';
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
import PageNotFound from "./pages/PageNotFound";
import { useTitle } from "./hook/UseTitle";
import ScheduleManagement from "./pages/patient/ScheduleManagement";
import MedicalManagement from "./pages/patient/MedicalManagement";
import DepartmentManagementByAdmin from "./components/admin/DepartmentManagementByAdmin";



const App = () => {

  const { setTitle } = useTitle();
  const location = useLocation();

  useEffect(() => {
    const pathTitles = {
      '/': 'Trang chủ bệnh viện X',
      '/oauth2/redirect': 'Đăng nhập google',
      '/records': 'Hồ sơ bệnh nhân',
      '/schedules': 'Lịch khám',
      '/medicals': 'Hồ sơ bệnh án',
      '/nurse/records': 'Điều dưỡng - Quản lý hồ sơ bệnh nhân',
      '/doctor/records': 'Bác sĩ - Quản lý hồ sơ bệnh nhân',
      '/receptionist/records': 'Nhân viên tiếp nhận - Quản lý hồ sơ bệnh nhân',
      '/admin/statistic': 'Admin - Thống kê',
      '/admin/account': 'Admin - Quản lý tài khoản đã đăng ký',
      '/admin/unregister': 'Admin - Quản lý tài khoản chưa đăng ký',
      '/admin/doctor': 'Admin - Quản lý thông tin bác sĩ',
      '/admin/nurse': 'Admin - Quản lý thông tin điều dưỡng',
      '/admin/receptionist': 'Admin - Quản lý thông tin nhân viên tiếp nhận',
      '/admin/medical': 'Admin - Quản lý bệnh án',
      '/admin/schedule': 'Admin - Quản lý lịch khám',
      '/admin/department': 'Admin - Quản lý khoa'
    };

    const title = pathTitles[location.pathname] || 'Trang không tồn tại';
    setTitle(title);
  }, [location, setTitle]);

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/oauth2/redirect' element={<GoogleLogin/>}/>
      <Route path='/records' element={<RecordsManagement/>}/>
      <Route path='/schedules' element={<ScheduleManagement/>}/>
      <Route path='/medicals' element={<MedicalManagement/>}/>
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
        <Route path='/admin/account' element={<AccountManagementByAdmin/>}/>
        <Route path='/admin/unregister' element={<UnregisteredManagementByAdmin/>}/>
        <Route path='/admin/doctor' element={<DoctorManagementByAdmin/>}/>
        <Route path='/admin/nurse' element={<NurseManagementByAdmin/>}/>
        <Route path='/admin/receptionist' element={<ReceptionistManagementByAdmin/>}/>
        <Route path='/admin/medical' element={<MedicalManagementByAdmin/>}/>
        <Route path='/admin/schedule' element={<ScheduleManagementByAdmin/>}/>
        <Route path='/admin/department' element={<DepartmentManagementByAdmin/>}/>
      </Route>
      <Route path="*" element={<PageNotFound/>} />
    </Routes>
  );
};

export default App;
