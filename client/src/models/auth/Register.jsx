import { useState } from "react";
import logo from "../../assets/img/logo2.png"
import { Form, Input, Button, message, Spin } from 'antd'
import Login from "./Login";
import { PropTypes } from 'prop-types';
import { registerApi } from "../../Api";
import axios from "axios";
import ConfirmPassword from "./ConfirmPassword";

const Register = ({ closeFormRegister, openFormLogin, openFormConfirm }) => {

    const [showFormLogin, setShowFormLogin] = useState(false);
    const [showFormConfirm, setShowFormConfirm] = useState(false);
    const [loading, setLoading] = useState(false)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const closeFormLogin = () => {
        setShowFormLogin(false)
    }

    const openFormConfirmInternal = () => {
        openFormConfirm();
        setShowFormConfirm(true);
    };

    const handleRegister = async() => {
        setLoading(true)
        try {
            let response = await axios.post(registerApi, {
                FullName: fullName,
                Email: email,
                Password: password1,
                ConfirmPassword: password2,
            });
            if (response.status===200) {
                setLoading(false)
                sessionStorage.setItem("id", response.data.Data.Account.Id)
                sessionStorage.setItem("type", "register")
                message.success(response.data.Message);
                openFormConfirmInternal();
            }
        } catch(error) {
            setLoading(false)
            message.error(error.response.data.Message)
        }
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="popup-form max-h-full overflow-auto bg-white p-5 rounded-xl shadow-lg">
                <Form onFinish={handleRegister} className="w-80 md:w-96 bg-white p-3 rounded-xl flex flex-col">
                    <img className=" mx-auto w-50 h-auto min-w-[120px] max-w-[200px] mt-2" src={logo} alt="logo" />
                    <h1 className=" text-3xl font-semibold text-center text-blue-700 font-rubik mt-3">
                        Đăng ký
                    </h1>
                    <h1 className="font-medium">Họ tên</h1>
                    <Form.Item name="name" rules={[{ required: true, message: 'Hãy nhập họ tên của bạn!' }]}>
                        <Input 
                            type="text"
                            placeholder="Nhập tên của bạn" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </Form.Item>
                    <h1 className="font-medium">Email</h1>
                    <Form.Item name="email" rules={[{ required: true, message: 'Hãy nhập email của bạn!' }]}>
                        <Input 
                            type="text"
                            placeholder="Nhập email của bạn" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <h1 className="font-medium">Mật khẩu</h1>
                    <Form.Item name="password1" rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}>
                        <Input.Password 
                            type="text"
                            placeholder="Nhập mật khẩu của bạn"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                        />
                    </Form.Item>
                    <h1 className="font-medium">Nhập lại mật khẩu</h1>
                    <Form.Item name="password2" rules={[{ required: true, message: 'Hãy nhập lại mật khẩu của bạn!' }]}>
                        <Input.Password 
                            type="text"
                            placeholder="Nhập lại mật khẩu của bạn"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                    </Form.Item>
                    <div className="text-center">
                        <span className="text-black text-[15px] font-normal font-rubik">Bạn đã có tài khoản? </span>
                        <a onClick={() => {closeFormRegister(); openFormLogin()}} className="text-red-600 text-[15px] font-medium font-rubik underline">Đăng nhập</a>
                    </div>

                    {showFormLogin && <Login closeFormLogin={closeFormLogin}/>}
                    {showFormConfirm && <ConfirmPassword closeFormConfirm={()=> setShowFormConfirm(false)}/>}

                    <div className="flex gap-5 items-center justify-center mt-3">
                        <Button
                            className="bg-blue-700 text-white px-10 rounded-md"
                            htmlType="submit"
                        >
                            {loading ? (
                                <Spin/>
                            ) : (
                                <div>Đăng ký</div>
                            )}
                        </Button>
                        <Button
                            className="bg-red-600 text-white px-10 rounded-md"
                            onClick={closeFormRegister}
                        >
                            Thoát
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

Register.propTypes = {
    closeFormRegister: PropTypes.func.isRequired,
    openFormLogin: PropTypes.func.isRequired,
    openFormConfirm: PropTypes.func.isRequired,
}
export default Register;
