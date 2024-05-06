
import logo from "../assets/img/logo2.png"
import { Form, Input, Button, message } from 'antd'
import axios from "axios";
import { PropTypes } from 'prop-types';
import { useState } from "react";
import { changeApi, logoutApi } from "../Api";


const ChangePassword = ({closeFormChangePassword}) => {

    const [oldpass, setOldPass] = useState("");
    const [newpass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleChange = async() => {
        try {
            let response = await axios.put(changeApi, {
                OldPassword: oldpass,
                NewPassword: newpass,
                ConfirmNewPassword: confirm,
            }, {
                withCredentials: true
            });
            if (response.status===200) {
                await axios.get(logoutApi, {
                    withCredentials: true
                });
                sessionStorage.setItem("successMessage", response.data.Message);
                window.location.reload();
            }
        } catch(error) {
            message.error(error.response.data.Message)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="popup-form absolute mt-12 text-black">
            <Form onFinish={handleChange} className="w-80 md:w-96 space-y-3 bg-white p-5 rounded-xl flex flex-col">
                <img className=" mx-auto w-50 h-auto min-w-[120px] max-w-[200px] mt-2" src={logo} alt="logo" />
                <h1 className=" text-3xl font-semibold text-center text-blue-700 font-rubik">
                    Đổi mật khẩu
                </h1>
                <Form.Item className="flex flex-col w-full" name="password1" label="Mật khẩu cũ" rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}>
                    <Input.Password 
                        type="text"
                        className="rounded-lg" 
                        placeholder="Nhập mật khẩu cũ của bạn" 
                        value={oldpass}
                        onChange={(e) => setOldPass(e.target.value)}
                    />
                </Form.Item>
                <Form.Item className="flex flex-col w-full" name="password2" label="Mật khẩu mới" rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}>
                    <Input.Password 
                        type="text"
                        className="rounded-lg"
                        placeholder="Nhập mật khẩu mới của bạn" 
                        value={newpass}
                        onChange={(e) => setNewPass(e.target.value)}
                    />
                </Form.Item>
                <Form.Item className="flex flex-col w-full" name="password3" label="Xác nhận" rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}>
                    <Input.Password 
                        type="text"
                        className="rounded-lg" 
                        placeholder="Nhập lại mật khẩu mới của bạn" 
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </Form.Item>
                <div className="flex gap-5 items-center justify-center">
                    <Button
                        className="bg-blue-700 text-white px-10 rounded-md"
                        htmlType="submit"
                    >
                        Xác nhận
                    </Button>
                    <Button
                    className="bg-red-600 text-white px-10 rounded-md"
                    onClick={closeFormChangePassword}
                    >
                        Đóng
                    </Button>
                </div>
            </Form>
        </div>
        </div>
    )
}

ChangePassword.propTypes = {
    closeFormChangePassword: PropTypes.func.isRequired,
}

export default ChangePassword
