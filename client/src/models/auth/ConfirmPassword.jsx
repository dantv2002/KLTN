import { PropTypes } from "prop-types";
import logo from "../../assets/img/logo2.png"
import { Form, Input, Button, message } from 'antd'
import { useState } from "react";
import axios from "axios";
import { confirmApi } from "../../Api";

const ConfirmPassword = ({closeFormConfirm}) => {

    const [code, setCode] = useState("");
    const id = sessionStorage.getItem("id")

    const handleConfirm = async() => {
        let type = sessionStorage.getItem("type")
        try {
            let response = await axios.post(confirmApi(type,id), {
                Code: code
            });
            if (response.status === 200) {
                sessionStorage.setItem("successMessage", response.data.Message)
                sessionStorage.removeItem("id");
                window.location.reload();
            }
        } catch (error) {
            message.error(error.response.data.Message); 
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="popup-form absolute mt-12 text-black">
                <Form onFinish={handleConfirm} className="w-80 md:w-96 space-y-6 bg-white p-5 rounded-xl flex flex-col">
                    <img className=" mx-auto w-50 h-auto min-w-[120px] max-w-[200px] mt-2" src={logo} alt="logo" />
                    <h1 className=" text-3xl font-semibold text-center text-blue-700 font-rubik">
                        Mã xác nhận
                    </h1>
                    <span className=" text-center">Mã xác nhận đã được gửi qua email của bạn</span>
                    <span className=" text-center">Hãy nhập mã xác nhận vào ô bên dưới</span>
                    <Form.Item className="flex flex-col w-full" name="code" label="Mã xác nhận" rules={[{ required: true, message: 'Hãy nhập email của bạn!' }]}>
                        <Input 
                            type="text"
                            className="rounded-lg" 
                            placeholder="Nhập mã xác nhận của bạn"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
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
                        onClick={closeFormConfirm}
                        >
                            Close
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

ConfirmPassword.propTypes = {
    closeFormConfirm: PropTypes.func.isRequired
}

export default ConfirmPassword
