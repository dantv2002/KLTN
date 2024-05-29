import {Routes, Route, useLocation} from "react-router-dom"
import { useEffect } from 'react';
import Home from "./pages/Home";
import RecordsManagement from "./pages/patient/RecordsManagement";
import GoogleLogin from "./models/auth/GoogleLogin";
import DashboardNurse from "./pages/nurse/DashboardNurse";
import DashboardDoctor from "./pages/doctor/DashboardDoctor";
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
import { useTitle } from "./context/UseTitle";
import ScheduleManagement from "./pages/patient/ScheduleManagement";
import MedicalManagement from "./pages/patient/MedicalManagement";
import DepartmentManagementByAdmin from "./components/admin/DepartmentManagementByAdmin";
import MedicalManagementByNurse from "./components/nurse/MedicalManagementByNurse";
import ReceptionManagementByNurse from "./components/nurse/ReceptionManagementByNurse";
import MedicalManagementByDoctor from "./components/doctor/MedicalManagementByDoctor";
import DiagnosisManagementByDoctor from "./components/doctor/DiagnosisManagementByDoctor";
import ScreenReceptionByNurse from "./components/nurse/ScreenReceptionByNurse";
import ProtectedRoutePatient from "./routes/ProtectedRoutePatient";
import ProtectedRouteNurse from "./routes/ProtectedRouteNurse";
import ProtectedRouteReceptionist from "./routes/ProtectedRouteReceptionist";
import ProtectedRouteDoctor from "./routes/ProtectedRouteDoctor";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmin";

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
      '/call': 'Gọi bệnh nhân',
      '/nurse/medical': 'Điều dưỡng - Quản lý hồ sơ bệnh án',
      '/nurse/reception': 'Điều dưỡng - Tiếp nhận bệnh nhân',
      '/doctor/medical': 'Bác sĩ - Quản lý hồ sơ bệnh án',
      '/doctor/diagnosis': 'Bác sĩ - Chẩn đoán',
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

      <Route path='/records' element={
        <ProtectedRoutePatient>
          <RecordsManagement/>
        </ProtectedRoutePatient>
      }/>
      <Route path='/schedules' element={
        <ProtectedRoutePatient>
          <ScheduleManagement/>
        </ProtectedRoutePatient>
      }/>
      <Route path='/medicals' element={
        <ProtectedRoutePatient>
          <MedicalManagement/>
        </ProtectedRoutePatient>
      }/>

      <Route element={
        <ProtectedRouteNurse>
          <DashboardNurse/>
        </ProtectedRouteNurse>
      }>
        <Route path='/nurse/medical' element={
          <ProtectedRouteNurse>
            <MedicalManagementByNurse/>
          </ProtectedRouteNurse>
        }/>
        <Route path='/nurse/reception' element={
          <ProtectedRouteNurse>
            <ReceptionManagementByNurse/>
          </ProtectedRouteNurse>
        }/>
      </Route>
      <Route path='/call' element={
        <ProtectedRouteNurse>
          <ScreenReceptionByNurse/>
        </ProtectedRouteNurse>
      }/>

      <Route element={
        <ProtectedRouteDoctor>
          <DashboardDoctor/>
        </ProtectedRouteDoctor>
      }>
        <Route path='/doctor/medical' element={
          <ProtectedRouteDoctor>
            <MedicalManagementByDoctor/>
          </ProtectedRouteDoctor>
        }/>
        <Route path='/doctor/diagnosis' element={
          <ProtectedRouteDoctor>
            <DiagnosisManagementByDoctor/>
          </ProtectedRouteDoctor>
        }/>
      </Route>

      <Route element={
        <ProtectedRouteReceptionist>
          <DashboardReceptionist/>
        </ProtectedRouteReceptionist>
      }>
        <Route path='/receptionist/records' element={
          <ProtectedRouteReceptionist>
            <RecordsManagementByReceptionist/>
          </ProtectedRouteReceptionist>
        }/>
      </Route>

      <Route element={
        <ProtectedRouteAdmin>
          <DashboardAdmin/>
        </ProtectedRouteAdmin>
      }>
        <Route path='/admin/statistic' element={
          <ProtectedRouteAdmin>
            <DataStatisticsManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/account' element={
          <ProtectedRouteAdmin>
            <AccountManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/unregister' element={
          <ProtectedRouteAdmin>
            <UnregisteredManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/doctor' element={
          <ProtectedRouteAdmin>
            <DoctorManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/nurse' element={
          <ProtectedRouteAdmin>
            <NurseManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/receptionist' element={
          <ProtectedRouteAdmin>
            <ReceptionistManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/medical' element={
          <ProtectedRouteAdmin>
            <MedicalManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/schedule' element={
          <ProtectedRouteAdmin>
            <ScheduleManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
        <Route path='/admin/department' element={
          <ProtectedRouteAdmin>
            <DepartmentManagementByAdmin/>
          </ProtectedRouteAdmin>
        }/>
      </Route>

      <Route path="*" element={<PageNotFound/>} />
    </Routes>
  );
};

export default App;
