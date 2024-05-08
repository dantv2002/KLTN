import { Form, Input, Button, DatePicker, Select } from 'antd'
import { PropTypes } from 'prop-types';

const Appointment = ({closeFormAppointment}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="popup-form max-h-full overflow-auto bg-cyan-400 p-5 rounded-xl shadow-lg">
                <Form className="w-80 md:w-96 space-y-3 bg-cyan-400 p-3 rounded-xl flex flex-col">
                    <h1 className=" text-3xl font-semibold text-center text-blue-700 font-rubik">
                        Đặt lịch khám
                    </h1>
                    <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Hãy nhập họ tên của bạn!' }]}>
                        <Input placeholder="Nhập tên của bạn" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Hãy nhập số điện thoại của bạn!' }]}>
                        <Input placeholder="Nhập số điện thoại của bạn" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Hãy nhập email của bạn!' }]}>
                        <Input placeholder="Nhập email của bạn"/>
                    </Form.Item>
                    <Form.Item name="faculty" label="Khoa" rules={[{ required: true, message: 'Hãy chọn khoa!' }]}>
                        <Select placeholder="Chọn khoa">
                            <Select.Option value="1">Lồng ngực</Select.Option>
                            <Select.Option value="2">Thần kinh</Select.Option>
                            <Select.Option value="3">Đa khoa</Select.Option>
                            <Select.Option value="4">Chỉnh hình</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="doctors" label="Bác sĩ" rules={[{ required: true, message: 'Hãy chọn bác sĩ!' }]}>
                        <Select placeholder="Chọn bác sĩ">
                            <Select.Option value="1">Nguyễn Văn A</Select.Option>
                            <Select.Option value="2">Nguyễn Văn B</Select.Option>
                            <Select.Option value="3">Nguyễn Văn C</Select.Option>
                            <Select.Option value="4">Nguyễn Văn D</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="Ngày khám" rules={[{ required: true, message: 'Hãy chọn ngày khám!' }]}>
                        <DatePicker className="w-full" placeholder="Chọn ngày"/>
                    </Form.Item>
                    <Form.Item name="time" label="Khung giờ" rules={[{ required: true, message: 'Hãy chọn khung giờ!' }]}>
                        <Select placeholder="Chọn khung giờ">
                            <Select.Option value="1">7am-8am</Select.Option>
                            <Select.Option value="2">9am-10am</Select.Option>
                            <Select.Option value="3">2pm-3pm</Select.Option>
                            <Select.Option value="4">5pm-6pm</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="content" label="Vấn đề sức khỏe" rules={[{ required: true, message: 'Hãy nhập vấn đề của bạn!' }]}>
                        <Input.TextArea placeholder="Nhập vấn đề của bạn"/>
                    </Form.Item>
                    <div className="flex gap-5 items-center justify-center">
                        <Button
                        className="bg-blue-700 text-white px-10 rounded-md"
                        onClick={closeFormAppointment}
                        >
                            Đặt lịch
                        </Button>
                        <Button
                        className="bg-red-600 text-white px-10 rounded-md"
                        onClick={closeFormAppointment}
                        >
                            Close
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

Appointment.propTypes = {
    closeFormAppointment: PropTypes.func.isRequired,
}

export default Appointment
