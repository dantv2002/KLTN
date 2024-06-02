import { useState } from "react";
import { PropTypes } from "prop-types";
import logo from "../../assets/img/logo2.png"
import google from "../../assets/img/google.png"
import { Form, Input, Button, message} from 'antd'
import axios from "axios";
import Register from "./Register";
import { googleApi, loginApi } from "../../Api";
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";


const Login = ({ closeFormLogin, openFormRegister, openFormReset }) => {

  const [showFormRegister, setShowFormRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const openFormResetInternal = () => {
    openFormReset();
  };

  const handleLogin = async() => {
    try {
      let response = await axios.post(loginApi, {
        Email: email,
        Password: password,
      }, {
        withCredentials: true
      });
      if (response.status === 200) {
        sessionStorage.setItem("successMessage", response.data.Message)
        let role = Cookies.get("Role")
        if (role === "PATIENT") {
          window.location.reload();
        } else if (role === "NURSE") {
          navigate("/nurse/medical");
        } else if (role === "RECEPTIONIST") {
          navigate("/receptionist/records");
        } else if (role === "DOCTOR") {
          navigate("/doctor/medical");
        } else if (role === "ADMIN") {
          navigate("/admin/statistic");
        }       
      }
    } catch (error) {
        message.error(error.response.data.Message); 
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="popup-form absolute mt-12 text-black">
        <Form onFinish={handleLogin} className="w-80 md:w-96 bg-white p-5 rounded-xl flex flex-col">
          <img className=" mx-auto w-50 h-auto min-w-[120px] max-w-[200px] mt-2" src={logo} alt="logo" />
          <h1 className=" text-3xl font-semibold text-center text-blue-700 font-rubik mt-3">
            Đăng nhập
          </h1>
          <h1 className="font-medium">Email:</h1>
          <Form.Item 
            className="w-full" 
            name="email" 
            rules={[{ required: true, message: 'Hãy nhập email của bạn!' }]}
          >
            <Input 
              type="text"
              className="rounded-lg w-full" 
              placeholder="Nhập email của bạn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <h1  className="font-medium">Mật khẩu:</h1>
          <Form.Item 
            className="w-full" 
            name="password" 
            rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}
          >
            <Input.Password 
              type="text"
              className="rounded-lg w-full"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <a onClick={openFormResetInternal} className="text-blue-700 text-[15px] font-medium font-rubik underline text-right">Quên mật khẩu</a>
          <span className="text-center">Hoặc</span>
          <a href={googleApi}>
            <img className="mx-auto w-[10px] h-auto min-w-[20px] max-w-[40px] mt-2" src={google} alt="google" />
          </a>
          <div className="text-center mt-2 mb-2">
            <span className="text-black text-[15px] font-normal font-rubik">Bạn chưa có tài khoản? </span>
            <a onClick={openFormRegister} className="text-red-600 text-[15px] font-medium font-rubik underline">Đăng ký</a>
          </div>

          {showFormRegister && <Register closeFormRegister={()=> setShowFormRegister(false)} openFormLogin={closeFormLogin}/>}

          <div className="flex gap-5 items-center justify-center">
            <Button
              className="bg-blue-700 text-white px-10 rounded-md"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
            <Button
              className="bg-red-600 text-white px-10 rounded-md"
              onClick={closeFormLogin}
            >
              Close
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

Login.propTypes = {
  closeFormLogin: PropTypes.func.isRequired,
  openFormRegister: PropTypes.func.isRequired,
  openFormReset: PropTypes.func.isRequired,
};

export default Login;
