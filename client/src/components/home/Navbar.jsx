import { useState } from "react";
import { Link } from "react-scroll";
import { AiOutlineClose, AiOutlineMenu, AiOutlineDown} from "react-icons/ai";
import Login from "../../models/auth/Login";
import Register from "../../models/auth/Register";
import ResetPassword from "../../models/auth/ResetPassword";
import ConfirmPassword from "../../models/auth/ConfirmPassword";
import Appointment from "../../models/patient/Appointment";
import ChangePassword from "../../models/ChangePassword";
import logo from "../../assets/img/logo2.png"
import { logoutApi } from "../../Api";
import Cookies from "js-cookie"
import axios from "axios";
import { message } from "antd";
import replacePlusWithSpace from "../../content/ReplacePlusWithSpace";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [showFormLogin, setShowFormLogin] = useState(false);
  const [showFormRegister, setShowFormRegister] = useState(false);
  const [showFormReset, setShowFormReset] = useState(false);
  const [showFormConfirm, setShowFormConfirm] = useState(false);
  const [showFormAppointment, setShowFormAppointment] = useState(false);
  const [showFormChangePassword, setShowFormChangePassword] = useState(false);
  const fullname = Cookies.get("FullName")
  const name =  fullname ? replacePlusWithSpace(fullname) : ""
  const navigate = useNavigate();

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

  const openFormAppointment = () => {
    setShowFormAppointment(true)
    setMenu(false)
  }

  const closeFormAppointment = () => {
    setShowFormAppointment(false)
  }

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
                      onClick={openFormAppointment}
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
            {showFormAppointment && <Appointment closeFormAppointment={closeFormAppointment}/>}
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
                onClick={openFormAppointment}
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
      </div>  
  );
};

export default Navbar;
