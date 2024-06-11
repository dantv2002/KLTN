import { useState, useEffect, useCallback } from "react";
import { Link, scroller } from "react-scroll";
import { AiOutlineClose, AiOutlineMenu, AiOutlineDown} from "react-icons/ai";
import Login from "../../models/auth/Login";
import Register from "../../models/auth/Register";
import ResetPassword from "../../models/auth/ResetPassword";
import ConfirmPassword from "../../models/auth/ConfirmPassword";
import ChangePassword from "../../models/ChangePassword";
import logo from "../../assets/img/logo3.png"
import { createTicker, getDepartmentPatient, getAllRecordsPatient, getDoctorPatient, getSchedulePatient, getScheduleOption, logoutApi } from "../../Api";
import Cookies from "js-cookie"
import axios from "axios";
import { Modal, message, Button, Space, Select, Input, Table, DatePicker } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import replacePlusWithSpace from "../../hook/ReplacePlusWithSpace";
import { useNavigate, useLocation } from 'react-router-dom';
import moment from "moment";
import Loading from "../../hook/Loading";
import Consultation from "../../models/consultation/Consultation";

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
  const [title, setTitle] = useState(null);
  const [department, setDepartment] = useState(null);
  const [gender, setGender] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTitle, setSearchTitle] = useState(null);
  const [searchDepartment, setSearchDepartment] = useState(null);
  const [searchGender, setSearchGender] = useState(null);
  const [time, setTime] = useState("");
  const [visibleDoctor, setVisibleDoctor] = useState(false);
  const [dataSchedules, setDataSchedules] = useState([]);
  const [visibleSchedule, setVisibleSchedule] = useState(false);
  const [dataRecords, setDataRecords] = useState([]);
  const [visibleRecord, setVisibleRecord] = useState(false);
  const [listDepartment, setListDepartment] = useState([]);
  const [pageDoctor, setPageDoctor] = useState("0");
  const [totalItemsDoctor, setTotalItemsDoctor] = useState("0");
  const [pageSchedule, setPageSchedule] = useState("0");
  const [totalItemsSchedule, setTotalItemsSchedule] = useState("0");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);


  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavigation = (event, to) => {
    if (!isHomePage) {
      event.preventDefault();
      navigate(`/?scrollTo=${to}`);
      
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTo = urlParams.get('scrollTo');
    if (scrollTo) {
      scroller.scrollTo(scrollTo, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
      });
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const columnsDoctors = [
    {
      title: 'STT',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageDoctor * 10,
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
      sorter: (a, b) => a.FullName.localeCompare(b.FullName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Chức danh',
      dataIndex: 'Title',
      key: 'Title',
      sorter: (a, b) => a.Title.localeCompare(b.Title),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Khoa',
      dataIndex: 'DepartmentName',
      key: 'DepartmentName',
      sorter: (a, b) => a.DepartmentName.localeCompare(b.DepartmentName),
      sortDirections: ['ascend', 'descend'],
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
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageSchedule * 10,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'Date',
      key: 'Date',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <Input
            placeholder="Nhập ngày khám"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            className="bg-blue-700"
            style={{ width: 90, marginRight: 8 }}
          >
            Lọc
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Đặt lại
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const date = moment(record.Date, 'DD/MM/YYYY').date().toString().padStart(2, '0');
        const filterValue = value.toString().padStart(2, '0');
        return date === filterValue || date === value;
      },
    },
    {
      title: 'Buổi',
      dataIndex: 'Time',
      key: 'Time',
      render: (text) => {
        if (text === 'MORNING') return 'Buổi sáng';
        if (text === 'AFTERNOON') return 'Buổi chiều';
        return text;
      },
      sorter: (a, b) => {
        const textA = a.Time === 'MORNING' ? 'Buổi sáng' : (a.Time === 'AFTERNOON' ? 'Buổi chiều' : a.Time);
        const textB = b.Time === 'MORNING' ? 'Buổi chiều' : (b.Time === 'AFTERNOON' ? 'Buổi chiều' : b.Time);
        return textA.localeCompare(textB);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Số',
      dataIndex: 'Number',
      key: 'Number',
      sorter: (a, b) => a.Number.localeCompare(b.Number),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Phòng',
      dataIndex: 'Clinic',
      key: 'Clinic',
      sorter: (a, b) => a.Clinic.localeCompare(b.Clinic),
      sortDirections: ['ascend', 'descend'],
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
      sorter: (a, b) => a.FullName.localeCompare(b.FullName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <Input
            placeholder="Nhập năm sinh"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            className="bg-blue-700"
            style={{ width: 90, marginRight: 8 }}
          >
            Lọc
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Đặt lại
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const yearOfBirth = moment(record.DateOfBirth, 'DD/MM/YYYY').year();
        return yearOfBirth.toString() === value;
      },
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'IdentityCard',
      key: 'IdentityCard',
      sorter: (a, b) => a.IdentityCard.localeCompare(b.IdentityCard),
      sortDirections: ['ascend', 'descend'],
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

  const showModal = () => {
      setVisible(true);
  };

  const hideModal = () => {
      setVisible(false);
  };

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
    setVisibleDoctor(true);
    fetchDepartment();
  };

  const fetchDoctor = useCallback(async () => {
    if (name) {
      try {
        setLoading(true);
        const titleSearch = searchTitle || ""
        const departmentSearch = searchDepartment || "";
        const genderSearch = searchGender || "";
        let response = await axios.get(getDoctorPatient(searchKeyword, titleSearch, departmentSearch, genderSearch, pageDoctor), {
          withCredentials: true
        });
        if (response.status === 200) {
          setTotalItemsDoctor(response.data.Data.TotalItems);
          setDataDoctors(response.data.Data.HealthCareStaffs);
        }
      } catch(error) {
        message.error(error.response.data.Message);
      } finally {
        setLoading(false);
      }
    }
  }, [name, searchKeyword, searchTitle, searchDepartment, searchGender, pageDoctor]);

  const fetchDepartment = async () => {
    if (name) {
      try {
        let response = await axios.get(getDepartmentPatient, {
          withCredentials: true
        });
        if (response.status === 200) {
          const departmentsData = response.data.Data.Departments;
          const departmentsArray = departmentsData
            .map(department => ({
              id: department.Id,
              name: department.NameDepartment
            }));
          setListDepartment(departmentsArray);    
        }
      } catch(error) {
        message.error(error.response.data.Message);
      }
    }
  }

  useEffect(() => {
      fetchDoctor();
  }, [fetchDoctor]);


  const handleChangPageDoctor = (page) => {
    setPageDoctor(page-1);
  }

  const handleSearchDoctor = () => {
    setSearchKeyword(keyword);
    setSearchTitle(title);
    setSearchDepartment(department);
    setSearchGender(gender);
    setPageDoctor("0");
  };

  const handleCancelDoctor = () => {
    setVisibleDoctor(false);
    setKeyword("");
    setTitle(null);
    setDepartment(null);
    setGender(null);
    setSearchKeyword("");
    setSearchTitle(null);
    setSearchDepartment(null);
    setSearchGender(null);
  }

  const handleReadSchedules = async(id) => {
    setIdDoctor(id);
    setVisibleSchedule(true);
  }

  const fetchSchedule = useCallback(async () => {
    try{
      setLoading(true)
      let response = await axios.get(getSchedulePatient(idDoctor, pageSchedule),{
        withCredentials: true
      })
      if (response.status === 200){
        setTotalItemsSchedule(response.data.Data.TotalItems);
        setDataSchedules(response.data.Data.Schedules);
      }
    }catch(error){
      message.error(error.response.data.Message)
    }finally{
      setLoading(false);
    }
  }, [idDoctor, pageSchedule]);

  useEffect(() => {
    if (idDoctor) {
      fetchSchedule();
    }
  }, [fetchSchedule, idDoctor]);

  const handleChangPageSchedule = (page) => {
    setPageSchedule(page-1);
  }

  const handleCancelSchedule = () => {
    setVisibleSchedule(false);
    setTime("");
  }

  const handleSearchSchedule = async () => {
    try {
      setLoading(true);
        if (!time || !moment(time).isValid()) {
            await fetchSchedule();
        } else {
          let searchTime = moment(time).format("DD-MM-YYYY");
          console.log(searchTime);
          let response = await axios.get(getScheduleOption(idDoctor, searchTime), {
              withCredentials: true
          });
          if (response.status === 200) {
              setTotalItemsSchedule("2");
              setPageSchedule("0");
              setDataSchedules(response.data.Data.Record);
          }
        }
    } catch (error) {
        message.error(error.response.data.Message);
    } finally {
      setLoading(false)
    }
};

  const handleReadRecord = async(id) => {
    setIdSchedule(id);
    try{
      setLoading(true)
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
    } finally {
      setLoading(false);
    }
  }

  const handleCancelRecord = () => {
    setVisibleRecord(false);
  }

  const handleAppointment = async(id) => {
    try {
      setLoading(true);
      let response = await axios.get(createTicker(idDoctor, idSchedule, id),{
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        handleCancelRecord();
        handleCancelSchedule();
        handleCancelDoctor();
      }
    }catch(error){
      message.error(error.response.data.Message)
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className=" fixed w-full z-10 text-white">
        <div>
          <div className=" flex flex-row justify-between p-5 md:px-32 px-5 bg-blue-700 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            <div className="flex flex-row items-center cursor-pointer bg-blue-900 bg-opacity-70 p-2 rounded-xl border-2 border-white shadow-lg hover:scale-105 hover:bg-opacity-90 hover:shadow-xl transition-all duration-300 hover:animate-pulse" onClick={() => window.location.href = '/'}>
              <div className="flex items-center relative">
                <img className="h-auto min-w-[10px] max-w-[40px] shadow-lg hover:shadow-white" src={logo} alt="logo" />
                <div className="ml-2 flex flex-col">
                  <span className="text-[13px] font-rubik font-semibold text-white drop-shadow-md hover:text-yellow-500">Bệnh viện X</span>
                  <span className="text-[10px] font-medium font-rubik text-white drop-shadow-md hover:text-yellow-500">
                    Trung tâm sức khỏe
                  </span>
                </div>
              </div>
            </div>
            <nav className="hidden lg:flex flex-row items-center text-sm sm:text-xs md:text-sm 15.6inch:text-lg 14inch:text-base font-bold gap-8 font-rubik">
              <Link
                to="home"
                spy={true}
                smooth={true}
                duration={500}
                className="hover:text-hoverColor transition-all cursor-pointer"
                onClick={(event) => handleNavigation(event, 'home')}
              >
                Trang chủ
              </Link>
              <Link
                to="about"
                spy={true}
                smooth={true}
                duration={500}
                className="hover:text-hoverColor transition-all cursor-pointer"
                onClick={(event) => handleNavigation(event, 'about')}
              >
                Giới thiệu
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="hover:text-hoverColor transition-all cursor-pointer"
                onClick={(event) => handleNavigation(event, 'services')}
              >
                Dịch vụ
              </Link>
              <Link
                to="doctors"
                spy={true}
                smooth={true}
                duration={500}
                className="hover:text-hoverColor transition-all cursor-pointer"
                onClick={(event) => handleNavigation(event, 'doctors')}
              >
                Đội ngũ
              </Link>
              <Link
                to="blog"
                spy={true}
                smooth={true}
                duration={500}
                className="hover:text-hoverColor transition-all cursor-pointer"
                onClick={(event) => handleNavigation(event, 'blog')}
              >
                Bài viết
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                duration={500}
                className="hover:text-hoverColor transition-all cursor-pointer"
                onClick={(event) => handleNavigation(event, 'contact')}
              >
                Liên hệ
              </Link>
              {name && (
                <div className="relative group flex items-center">
                  <h1 className="mr-2">Chức năng</h1>
                  <AiOutlineDown className="text-white group-hover:text-hoverColor transition-all cursor-pointer" />
                  <ul className="absolute top-full left-0 w-52 bg-blue-700 border rounded-md shadow-lg invisible opacity-0 mt-14 group-hover:mt-3 group-hover:opacity-100 group-hover:visible transition-all duration-500 font-rubik font-normal">
                    <li className="py-2 px-4 rounded-md hover:bg-black">
                      <a href="/records" className="hover:text-hoverColor transition-all cursor-pointer block">
                        Quản lý hồ sơ
                      </a>
                    </li>
                    <li className="py-2 px-4 rounded-md hover:bg-black">
                      <a href="/schedules" className="hover:text-hoverColor transition-all cursor-pointer block">
                        Quản lý phiếu khám
                      </a>
                    </li>
                    <li className="py-2 px-4 rounded-md hover:bg-black">
                      <a href="/medicals" className="hover:text-hoverColor transition-all cursor-pointer block">
                        Quản lý bệnh án
                      </a>
                    </li>
                    <li className="py-2 px-4 rounded-md hover:bg-black">
                      <button
                        className="hover:text-hoverColor transition-all cursor-pointer block"
                        onClick={() => handleReadDoctor()}
                      >
                        Đặt lịch khám
                      </button>
                    </li>
                    <li className="py-2 px-4 rounded-md hover:bg-black">
                      <button
                        className="hover:text-hoverColor transition-all cursor-pointer block"
                        onClick={() => showModal()}
                      >
                          Chẩn đoán sơ bộ
                      </button>
                      <Consultation visible={visible} hideModal={hideModal}/>
                    </li>
                  </ul>
                </div>
              )}
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
              <div className="relative group flex items-center text-sm sm:text-xs md:text-sm 15.6inch:text-lg 14inch:text-base">
                <h1 className="mr-2">{name}</h1>
                <AiOutlineDown className="text-white group-hover:text-hoverColor transition-all cursor-pointer" />
                <ul className="absolute top-full left-0 w-48 bg-blue-700 border rounded-md shadow-lg invisible opacity-0 mt-14 group-hover:mt-3 group-hover:opacity-100 group-hover:visible transition-all duration-500 font-rubik">
                  <li className="py-2 px-4 rounded-md hover:bg-black">
                    <button
                      className="hover:text-hoverColor transition-all cursor-pointer block"
                      onClick={openFormChangePassword}
                    >
                      Đổi mật khẩu
                    </button>
                  </li>
                  <li className="py-2 px-4 rounded-md hover:bg-black">
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
              <a href="/schedules" className="hover:text-hoverColor transition-all cursor-pointer block">
                Quản lý phiếu khám
              </a>
              <a href="/medicals" className="hover:text-hoverColor transition-all cursor-pointer block">
                Quản lý bệnh án
              </a>
              <button
                className="hover:text-hoverColor transition-all cursor-pointer block"
                onClick={openFormChangePassword}
              >
                Đổi mật khẩu
              </button>
              <button
                className="hover:text-hoverColor transition-all cursor-pointer block"
                onClick={() => handleReadDoctor()}
              >
                Đặt lịch khám
              </button>
              <button
                className="hover:text-hoverColor transition-all cursor-pointer block"
                onClick={() => showModal()}
              >
                Chẩn đoán sơ bộ
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
          <Select
            className="w-40 mt-3 mr-3"
            placeholder="Tìm theo chức danh"
            value={title}
            onChange={(value) => setTitle(value)}
            allowClear
          >
            <Select.Option value="Ths">Ths</Select.Option>
            <Select.Option value="TS">TS</Select.Option>
            <Select.Option value="BS">BS</Select.Option>
            <Select.Option value="BSCKI">BSCKI</Select.Option>
            <Select.Option value="BSCKII">BSCKII</Select.Option>
          </Select>
          <Select
            className="w-40 mt-3 mr-3"
            placeholder="Chọn khoa"
            value={department}
            onChange={(value) => setDepartment(value)}
            allowClear
          >
            {listDepartment.map((department) => (
              <Select.Option 
                key={department.id} 
                value={department.id}
              >
                {department.name}
              </Select.Option>
            ))}
          </Select>
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
          <Button onClick={() => handleSearchDoctor()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
          <Table
            columns={columnsDoctors} 
            dataSource={dataDoctors}
            loading={{ indicator: <Loading/>, spinning: loading }}
            pagination={{
              total: totalItemsDoctor,
              pageSize: 10,
              current: pageDoctor + 1,
              onChange: handleChangPageDoctor,
            }}
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
          <DatePicker
            className="w-60 mt-3 mr-3"
            placeholder="Chọn ngày xem lịch khám"
            onChange={(date, dateString) => setTime(dateString)}
          />
          <Button onClick={() => handleSearchSchedule()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
          <Table 
            columns={columnsSchedules} 
            dataSource={dataSchedules}
            loading={{ indicator: <Loading/>, spinning: loading }}
            pagination={{
              total: totalItemsSchedule,
              pageSize: 10,
              current: pageSchedule + 1,
              onChange: handleChangPageSchedule,
            }}
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
            loading={{ indicator: <Loading/>, spinning: loading }}
          />
        </Modal>
      </div>  
  );
};

export default Navbar;
