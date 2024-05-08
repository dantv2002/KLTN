import { useState } from "react";
import logo from "../../assets/img/logo2.png"
import { Form, Input, Button, message, Spin } from 'antd'
import ConfirmPassword from "./ConfirmPassword";
import { PropTypes } from 'prop-types';
import axios from "axios";
import { resetApi } from "../../Api";

const ResetPassword = ({ closeFormReset, openFormConfirm }) => {

    const [showFormConfirm, setShowFormConfirm] = useState(false);
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const openFormConfirmInternal = () => {
        openFormConfirm();
    };

    const handleReset = async() => {
        setLoading(true)
        try {
            let response = await axios.put(resetApi, {
                Email: email,
                Password: password1,
                ConfirmPassword: password2,
            });
            if (response.status===200) {
                setLoading(false)
                sessionStorage.setItem("id", response.data.Data.Account.Id)
                sessionStorage.setItem("type", "reset-password")
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
            <div className="popup-form absolute mt-12 text-black">
                <Form onFinish={handleReset} className="w-80 md:w-96 space-y-5 bg-white p-5 rounded-xl flex flex-col">
                    <img className=" mx-auto w-50 h-auto min-w-[120px] max-w-[200px] mt-2" src={logo} alt="logo" />
                    <h1 className=" text-3xl font-semibold text-center text-blue-700 font-rubik">
                        Đặt lại mật khẩu
                    </h1>
                    <Form.Item className="flex flex-col w-full" name="email" label="Email" rules={[{ required: true, message: 'Hãy nhập email của bạn!' }]}>
                        <Input 
                            type="text"
                            className="rounded-lg" 
                            placeholder="Nhập email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item className="flex flex-col w-full" name="password1" label="Mật khẩu mới" rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}>
                        <Input.Password
                            type="text"
                            className="rounded-lg"
                            placeholder="Nhập mật khẩu mới"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item className="flex flex-col w-full" name="password2" label="Xác nhận mật khẩu mới" rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}>
                        <Input.Password 
                            type="text"
                            className="rounded-lg" 
                            placeholder="Nhập lại mật khẩu mới" 
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                    </Form.Item>

                    {showFormConfirm && <ConfirmPassword closeFormConfirm={()=> setShowFormConfirm(false)}/>}

                    <div className="flex gap-5 items-center justify-center">
                        <Button
                            className="bg-blue-700 text-white px-10 rounded-md"
                            htmlType="submit"
                        >
                            {loading ? (
                                <Spin/>
                            ) : (
                                <div>Xác nhận</div>
                            )}
                        </Button>
                        <Button
                            className="bg-red-600 text-white px-10 rounded-md"
                            onClick={closeFormReset}
                        >
                            Close
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

ResetPassword.propTypes = {
    closeFormReset: PropTypes.func.isRequired,
    openFormConfirm: PropTypes.func.isRequired,
}

export default ResetPassword
