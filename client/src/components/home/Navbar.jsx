import { useState } from "react";
import { Link } from "react-scroll";
import { AiOutlineClose, AiOutlineMenu, AiOutlineDown} from "react-icons/ai";
import Login from "../../models/auth/Login";
import Register from "../../models/auth/Register";
import ResetPassword from "../../models/auth/ResetPassword";
import ConfirmPassword from "../../models/auth/ConfirmPassword";
import ChangePassword from "../../models/ChangePassword";
import logo from "../../assets/img/logo2.png"
import { createTicker, getAllRecordsPatient, getDoctorPatient, getSchedulePatient, logoutApi } from "../../Api";
import Cookies from "js-cookie"
import axios from "axios";
import { Modal, message, Button, Space, Select, Input, Table } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import replacePlusWithSpace from "../../content/ReplacePlusWithSpace";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [showFormLogin, setShowFormLogin] = useState(false);
  const [showFormRegister, setShowFormRegister] = useState(false);
  const [showFormReset, setShowFormReset] = useState(false);
  const [showFormConfirm, setShowFormConfirm] = useState(false);
  const [showFormChangePassword, setShowFormChangePassword] = useState(false);
  const fullname = Cookies.get("FullName")
  const name =  fullname ? replacePlusWithSpace(fullname) : ""
  const navigate = useNavigate();
  const [idDoctor, setIdDoctor] = useState("");
  const [idSchedule, setIdSchedule] = useState("");
  const [dataDoctors, setDataDoctors] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [visibleDoctor, setVisibleDoctor] = useState(false);
  const [dataSchedules, setDataSchedules] = useState([]);
  const [visibleSchedule, setVisibleSchedule] = useState(false);
  const [dataRecords, setDataRecords] = useState([]);
  const [visibleRecord, setVisibleRecord] = useState(false);



  const columnsDoctors = [
    {
      title: 'STT',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Chức danh',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: 'Khoa',
      dataIndex: 'DepartmentId',
      key: 'DepartmentId',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, doctor) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleReadSchedules(doctor.Id)}>
            Chọn
          </Button>
        </Space>
      ),
    },
  ];

  const columnsSchedules = [
    {
      title: 'Ngày khám',
      dataIndex: 'Date',
      key: 'Date',
    },
    {
      title: 'Buổi',
      dataIndex: 'Time',
      key: 'Time',
    },
    {
      title: 'Số',
      dataIndex: 'Number',
      key: 'Number',
    },
    {
      title: 'Phòng',
      dataIndex: 'Clinic',
      key: 'Clinic',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_,schedule) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleReadRecord(schedule.Id)}>
            Chọn
          </Button>
        </Space>
      ),
    },
  ];
  
  const columnsRecords = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'IdentityCard',
      key: 'IdentityCard',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_,record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleAppointment(record.Id)}>
            Đăng ký
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const openFormLogin = () => {
    setShowFormLogin(true);
    setMenu(false);
  };

  const closeFormLogin = () => {
    setShowFormLogin(false);
  };

  const openFormRegister = () => {
    setShowFormRegister(true);
    setShowFormLogin(false);
    setShowFormConfirm(false);
  };  

  const openFormReset = () => {
    setShowFormReset(true);
    setShowFormLogin(false);
  };

  const openFormConfirm = () => {
    setShowFormConfirm(true);
    setShowFormReset(false);
    setShowFormRegister(false)
  };

  const openFormChangePassword = () => {
    setShowFormChangePassword(true)
    setMenu(false)
  }

  const closeFormChangePassword = () => {
    setShowFormChangePassword(false)
  }

  const handleLogout = async() => {
    try{
      const response = await axios.get(logoutApi, {
        withCredentials: true
      });
      if (response.status === 200){
        sessionStorage.setItem("successMessage", response.data.Message)
        navigate("/")
        window.location.reload();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleReadDoctor = async () => {
    try {
      const searchGender = gender === undefined ? "" : gender;
      let response = await axios.get(getDoctorPatient(keyword, title, department, searchGender), {
        withCredentials: true
      });
      if (response.status === 200) {
        setVisibleDoctor(true);
        message.success(response.data.Message);
        setDataDoctors(response.data.Data.HealthCareStaffs);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  };

  const handleCancelDoctor = () => {
    setVisibleDoctor(false);
  }

  const handleReadSchedules = async(id) => {
    setIdDoctor(id);
    try{
      let response = await axios.get(getSchedulePatient(id),{
        withCredentials: true
      })
      if (response.status === 200){
        setVisibleSchedule(true);
        setDataSchedules(response.data.Data.Schedules)
        message.success(response.data.Message)
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleCancelSchedule = () => {
    setVisibleSchedule(false);
  }

  const handleReadRecord = async(id) => {
    setIdSchedule(id);
    try{
      let response = await axios.get(getAllRecordsPatient,{
        withCredentials: true
      })
      if (response.status === 200){
        setVisibleRecord(true);
        setDataRecords(response.data.Data.Records)
        message.success(response.data.Message)
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleCancelRecord = () => {
    setVisibleRecord(false);
  }

  const handleAppointment = async(id) => {
    try {
      let response = await axios.get(createTicker(idDoctor, idSchedule, id),{
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        setVisibleRecord(false);
        setVisibleSchedule(false);
        setVisibleDoctor(false)
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  return (
      <div className=" fixed w-full z-10 text-white">
        <div>
          <div className=" flex flex-row justify-between p-5 md:px-32 px-5 bg-blue-700 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            <div className=" flex flex-row items-center cursor-pointer">
              <Link to="home" spy={true} smooth={true} duration={500}>
                <img className="w-[10vw] h-auto min-w-[120px] max-w-[200px]" src={logo} alt="logo" />
              </Link>
            </div>

            <nav className=" hidden lg:flex flex-row items-center text-lg font-medium gap-8">
              <Link
                to="home"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
              >
                Trang chủ
              </Link>
              <Link
                to="about"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
              >
                Giới thiệu
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
              >
                Dịch vụ
              </Link>
              <Link
                to="doctors"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
              >
                Đội ngũ
              </Link>
              <Link
                to="blog"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
              >
                Bài viết
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
              >
                Liên hệ
              </Link>
            </nav>

            <div className=" hidden lg:flex items-center relative">
            {!name ? (
              <button
              className="bg-cyan-400 h-12 text-white px-4 py-2 rounded-[30px] hover:bg-hoverColor transition duration-300 ease-in-out"
              onClick={openFormLogin}
              >
                Đăng nhập
              </button>
            ) : (
              <div className="relative group flex items-center">
                <h1 className="mr-2">{name}</h1>
                <AiOutlineDown className="text-white group-hover:text-hoverColor transition-all cursor-pointer" />
                <ul className="absolute top-full left-0 w-48 bg-cyan-400 border rounded-md shadow-lg invisible opacity-0 mt-14 group-hover:mt-3 group-hover:opacity-100 group-hover:visible transition-all duration-500 font-rubik">
                  <li className="py-2 px-4 rounded-md hover:bg-blue-700">
                    <a href="/records" className="hover:text-hoverColor transition-all cursor-pointer block">
                      Quản lý hồ sơ
                    </a>
                  </li>
                  <li className="py-2 px-4 rounded-md hover:bg-blue-700">
                    <Link
                      to="profile"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className="hover:text-hoverColor transition-all cursor-pointer block"
                    >
                      Quản lý phiếu khám
                    </Link>
                  </li>
                  <li className="py-2 px-4 rounded-md hover:bg-blue-700">
                    <button
                      className="hover:text-hoverColor transition-all cursor-pointer block"
                      onClick={openFormChangePassword}
                    >
                      Đổi mật khẩu
                    </button>
                  </li>
                  <li className="py-2 px-4 rounded-md hover:bg-blue-700">
                    <button
                      className="hover:text-hoverColor transition-all cursor-pointer block"
                      onClick={() => handleReadDoctor()}
                    >
                      Đặt lịch khám
                    </button>
                  </li>
                  <li className="py-2 px-4 rounded-md hover:bg-blue-700">
                    <button
                      className="hover:text-hoverColor transition-all cursor-pointer block"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
            </div>

            {showFormLogin && <Login closeFormLogin={closeFormLogin} openFormRegister={openFormRegister} openFormReset={openFormReset}/>}
            {showFormRegister && <Register closeFormRegister={()=> setShowFormRegister(false)} openFormLogin={openFormLogin} openFormConfirm={openFormConfirm}/>}
            {showFormReset && <ResetPassword closeFormReset={()=> setShowFormReset(false)} openFormConfirm={openFormConfirm}/>}
            {showFormConfirm && <ConfirmPassword closeFormConfirm={()=> setShowFormConfirm(false)}/>}
            {showFormChangePassword && <ChangePassword closeFormChangePassword={closeFormChangePassword}/>}
            
            <div className=" lg:hidden flex items-center">
              {menu ? (
                <AiOutlineClose size={28} onClick={handleChange} />
              ) : (
                <AiOutlineMenu size={28} onClick={handleChange} />
              )}
            </div>
          </div>
          {!name ? (
            <div
              className={`${
                menu ? "translate-x-0" : "-translate-x-full"
              } lg:hidden flex flex-col absolute bg-blue-700 text-white left-0 top-16 font-semibold text-xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
            >
              <Link
                to="home"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Trang chủ
              </Link>
              <Link
                to="about"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Giới thiệu
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Dịch vụ
              </Link>
              <Link
                to="doctors"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Đội ngũ
              </Link>
              <Link
                to="blog"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Bài viết
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                duration={500}
                className=" hover:text-hoverColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Liên hệ
              </Link>

              <div className=" lg:hidden">
                <button
                  className="bg-cyan-400 text-white px-4 py-2 rounded-md shadow hover:bg-hoverColor transition duration-300 ease-in-out"
                  onClick={openFormLogin}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          ) : (
            <div
            className={`${
              menu ? "translate-x-0" : "-translate-x-full"
            } lg:hidden flex flex-col absolute bg-blue-700 text-white left-0 top-16 font-semibold text-xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
            >
              <a href="/records" className="hover:text-hoverColor transition-all cursor-pointer block">
                Quản lý hồ sơ
              </a>
              <a href="/records" className="hover:text-hoverColor transition-all cursor-pointer block">
                Quản lý phiếu khám
              </a>
              <button
                className="hover:text-hoverColor transition-all cursor-pointer block"
                onClick={openFormChangePassword}
              >
                Đổi mật khẩu
              </button>
              <button
                className="hover:text-hoverColor transition-all cursor-pointer block"
              >
                Đặt lịch khám
              </button>
              <button
                className="text-white hover:text-hoverColor transition duration-300 ease-in-out"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Chọn bác sĩ</h1>}
          visible={visibleDoctor}
          onCancel={handleCancelDoctor}
          cancelText="Thoát"
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ className: "bg-red-600" }}
          width={1000}
        >
          <Input
            className="w-40 mt-3 mr-3"
            placeholder="Tìm theo tên"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Input
            className="w-40 mt-3 mr-3"
            placeholder="Tìm theo chức danh"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className="w-40 mt-3 mr-3"
            placeholder="Tìm theo khoa"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Select
            className="w-40 mt-3 mr-3"
            placeholder="Tìm theo giới tính"
            value={gender}
            onChange={(value) => setGender(value)}
            allowClear
          >
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
          <Button onClick={() => handleReadDoctor()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
          <Table
            columns={columnsDoctors} 
            dataSource={dataDoctors}
          />
        </Modal>
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Chọn lịch khám</h1>}
          visible={visibleSchedule}
          onCancel={handleCancelSchedule}
          cancelText="Thoát"
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ className: "bg-red-600" }}
          width={800}
        >
          <Table 
            columns={columnsSchedules} 
            dataSource={dataSchedules}
          />
        </Modal>
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Chọn hồ sơ</h1>}
          visible={visibleRecord}
          onCancel={handleCancelRecord}
          cancelText="Thoát"
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ className: "bg-red-600" }}
          width={800}
        >
          <Table 
            columns={columnsRecords} 
            dataSource={dataRecords}
          />
        </Modal>
      </div>  
  );
};

export default Navbar;
