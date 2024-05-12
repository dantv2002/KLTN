import { useState, useEffect } from "react";
import { createSchedule, getDoctor, getSchedule, updateSchedule } from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker, InputNumber } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"

const ScheduleManagementByAdmin = () => {

    const location = useLocation();
    const [idDoctor, setIdDoctor] = useState("");
    const [dataDoctors, setDataDoctors] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [gender, setGender] = useState("");
    const [visibleInsert, setVisibleInsert] = useState(false);
    const [formInsert] = Form.useForm();
    const [visibleRead, setVisibleRead] = useState(false);
    const [dataSchedules, setDataSchedules] = useState([]);
    const [idSchedule, setIdSchedule] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [number, setNumber] = useState(0);
    const [clinic, setClinic] = useState("");
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [formUpdate] = Form.useForm();
    const [newSchedules, setNewSchedules] = useState([]);
    const [shouldReloadFormRead, setShouldReloadFormRead] = useState(false);

    const columnsDoctors = [
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
                Xem lịch
              </Button>
              <Button type="link" onClick={() => handleInsert(doctor.Id)}>
                Đặt lịch
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
        render: (_, schedules) => (
          <Space size="middle">
            <Button type="link" onClick={() => handleUpdate(schedules)}>
              Cập nhật
            </Button>
          </Space>
        ),
      },
    ];

    useEffect(() => {
      const fetchDoctor = async () => {
        try {
          let response = await axios.get(getDoctor("", "", "", ""), {
            withCredentials: true
          });
          if (response.status === 200) {
            message.success(response.data.Message);
            setDataDoctors(response.data.Data.HealthCareStaffs);
          }
        } catch(error) {
          message.error(error.response.data.Message);
        }
      };
      fetchDoctor();
    }, [location.pathname]);

    const handleSearch = async () => {
      try {
        const searchGender = gender === undefined ? "" : gender;
        let response = await axios.get(getDoctor(keyword, title, department, searchGender), {
          withCredentials: true
        });
        if (response.status === 200) {

          message.success(response.data.Message);
          setDataDoctors(response.data.Data.HealthCareStaffs);
        }
      } catch(error) {
        message.error(error.response.data.Message);
      }
    };

    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const handleReadSchedules = async(id) => {
      try{
        let response = await axios.get(getSchedule(id),{
          withCredentials: true
        })
        if (response.status === 200){
          setVisibleRead(true);
          setDataSchedules(response.data.Data.Schedules)
          message.success(response.data.Message)
        }
      }catch(error){
        message.error(error.response.data.Message)
      }
    }

    const handleInsert = (id) => {
      setVisibleInsert(true);
      setIdDoctor(id);
    };

    const handleCancelInsert = () => {
      setVisibleInsert(false);
      setNewSchedules([])
    };

    const handleCancelRead = () => {
      setVisibleRead(false);
    }

    const handleUpdate = (schedules) => {
      setIdSchedule(schedules.Id);
      setDate(moment(schedules.Date, "DD/MM/YYYY"));
      setTime(schedules.Time);
      setNumber(parseInt(schedules.Number));
      setClinic(schedules.Clinic);
      setIdDoctor(schedules.DoctorId);
      formUpdate.setFieldsValue({
        date: moment(schedules.Date, "DD/MM/YYYY"),
        time: schedules.Time,
        number: parseInt(schedules.Number),
        clinic: schedules.Clinic,
      });
      setVisibleUpdate(true);     
    };

    const handleCancelUpdate = () => {
      setVisibleUpdate(false);
    };

    const handleUpdateSchedule = async () => {
      try {
        let requestData = [{
          Id: idSchedule,
          Date: moment(date).format("DD/MM/YYYY"),
          Time: time,
          Number: parseInt(number),
          Clinic: clinic,
          DoctorId: idDoctor,
        }];
        
        let response = await axios.put(updateSchedule(idDoctor), requestData, {
          withCredentials: true
        });
    
        if (response.status === 200) {
          message.success(response.data.Message);
          setVisibleUpdate(false);
          setShouldReloadFormRead(true);
        }
      } catch (error) {
        message.error(error.response.data.Message);
      }
    }

    useEffect(() => {
      if (shouldReloadFormRead) {
        const fetchData = async () => {
          try {
            let response = await axios.get(getSchedule(idDoctor), {
              withCredentials: true
            });
            if (response.status === 200) {
              setVisibleRead(true);
              setDataSchedules(response.data.Data.Schedules);
            }
          } catch (error) {
            console.log(error.response.data.Message);
          }
        };
        fetchData();
        setShouldReloadFormRead(false);
      }
    }, [shouldReloadFormRead, idDoctor]);
    
    

    const addScheduleForm = () => {
      setNewSchedules([...newSchedules, { date: "", time: "", clinic: "", datescreen: "" }]);
    };

    const handleDateChange = (date, dateValue, index) => {
      const updatedSchedules = [...newSchedules];
      updatedSchedules[index].datescreen = date
      updatedSchedules[index].date = dateValue;
      setNewSchedules(updatedSchedules);
    };

    const handleTimeChange = (timeValue, index) => {
      const updatedSchedules = [...newSchedules];
      updatedSchedules[index].time = timeValue;
      setNewSchedules(updatedSchedules);
    };

    const handleClinicChange = (clinicValue, index) => {
      const updatedSchedules = [...newSchedules];
      updatedSchedules[index].clinic = clinicValue;
      setNewSchedules(updatedSchedules);
    };

    const handleCreateMultipleSchedules = async () => {
      try {
        const schedulesData = newSchedules.map(schedule => ({
          Date: moment(schedule.date).format("DD/MM/YYYY"),
          Time: schedule.time,
          Clinic: schedule.clinic
        }));
        let response = await axios.post(createSchedule(idDoctor), schedulesData, {
          withCredentials: true
        });
        if (response.status === 200) {
          setVisibleInsert(false);
          setNewSchedules([]);
          message.success(response.data.Message);
        }
      } catch(error) {
        message.error(error.response.data.Message);
      }
    };

    return (
      <div>
        <Input
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo tên"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Input
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo chức danh"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo khoa"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <Select
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo giới tính"
          value={gender}
          onChange={(value) => setGender(value)}
          allowClear
        >
          <Select.Option value="Nam">Nam</Select.Option>
          <Select.Option value="Nữ">Nữ</Select.Option>
          <Select.Option value="Khác">Khác</Select.Option>
        </Select>
        <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
        <Table 
            columns={columnsDoctors} 
            dataSource={dataDoctors}
            pagination={false}
        />
        <Modal 
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tạo lịch khám</h1>}
          visible={visibleInsert}
          onOk={handleCreateMultipleSchedules}
          okText="Tạo"
          onCancel={handleCancelInsert}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          {newSchedules.map((schedule, index) => (
            <div key={index}>
              <Form {...formLayout} form={formInsert}>
                <Form.Item label="Ngày khám" rules={[{ required: true, message: 'Ngày khám không được để trống!' }]}>
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn ngày khám"
                    value={schedule.datescreen}
                    onChange={(date, dateString) => handleDateChange(date, dateString, index)}
                  />
                </Form.Item>
                <Form.Item label="Thời gian" rules={[{ required: true, message: 'Thời gian không được để trống!' }]}>
                  <Select
                    className="w-96 mt-3 mr-3"
                    placeholder="Chọn thời gian khám"
                    onChange={(value) => handleTimeChange(value, index)}
                  >
                    <Select.Option value="MORNING">Buổi sáng</Select.Option>
                    <Select.Option value="AFTERNOON">Buổi chiều</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Phòng" rules={[{ required: true, message: 'Phòng không được để trống!' }]}>
                  <Select
                    className="w-96 mt-3 mr-3"
                    placeholder="Chọn phòng khám"
                    onChange={(value) => handleClinicChange(value, index)}
                  >
                    <Select.Option value="1">Phòng 1</Select.Option>
                    <Select.Option value="2">Phòng 2</Select.Option>
                    <Select.Option value="3">Phòng 3</Select.Option>
                    <Select.Option value="4">Phòng 4</Select.Option>
                    <Select.Option value="5">Phòng 5</Select.Option>
                    <Select.Option value="6">Phòng 6</Select.Option>
                    <Select.Option value="7">Phòng 7</Select.Option>
                    <Select.Option value="8">Phòng 8</Select.Option>
                    <Select.Option value="9">Phòng 9</Select.Option>
                    <Select.Option value="10">Phòng 10</Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            </div>
          ))}
          <Button type="dashed" onClick={addScheduleForm} block icon={<PlusOutlined />}>
            Thêm lịch
          </Button>
        </Modal>
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem lịch khám</h1>}
          visible={visibleRead && !shouldReloadFormRead}
          onCancel={handleCancelRead}
          cancelText="Thoát"
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ className: "bg-red-600" }}
          className="w-full max-w-xl mx-auto mt-10"
        >
          <Table 
            columns={columnsSchedules} 
            dataSource={dataSchedules}
          />
        </Modal>
        <Modal 
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tạo lịch khám</h1>}
          visible={visibleUpdate}
          onOk={() => formUpdate.submit()}
          okText="Cập nhật"
          onCancel={handleCancelUpdate}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          <Form {...formLayout} form={formUpdate} onFinish={handleUpdateSchedule}>
            <Form.Item name="date" label="Ngày khám" rules={[{ required: true, message: 'Ngày khám không được để trống!' }]}>
              <DatePicker
                type="text"
                className="w-full"
                placeholder="Chọn ngày khám"
                value={date ? moment(date, 'DD/MM/YYYY') : undefined}
                onChange={(date, dateString) => setDate(dateString)}
              />
            </Form.Item>
            <Form.Item name="time" label="Thời gian" rules={[{ required: true, message: 'Thời gian không được để trống!' }]}>
              <Select 
                type="text"
                placeholder="Chọn thời gian"
                value={time}
                onChange={(value) => setTime(value)}
              >
                <Select.Option value="MORNING">Buổi sáng</Select.Option>
                <Select.Option value="AFTERNOON">Buổi chiều</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="number" label="Số thứ tự" rules={[{ required: true, message: 'Số thứ tự không được để trống!' }, { type: 'number', message: 'Vui lòng nhập một số!' }]}>
              <InputNumber
                type="text"
                className="w-full"
                placeholder="Nhập số thứ tự"
                value={number}
                onChange={(value) => setNumber(value)}
              />
            </Form.Item>
            <Form.Item name="clinic" label="Phòng" rules={[{ required: true, message: 'Phòng không được để trống!' }]}>
              <Select
                placeholder="Chọn phòng"
                value={clinic}
                onChange={(value) => setClinic(value)}
              >
                <Select.Option value="1">Phòng 1</Select.Option>
                <Select.Option value="2">Phòng 2</Select.Option>
                <Select.Option value="3">Phòng 3</Select.Option>
                <Select.Option value="4">Phòng 4</Select.Option>
                <Select.Option value="5">Phòng 5</Select.Option>
                <Select.Option value="6">Phòng 6</Select.Option>
                <Select.Option value="7">Phòng 7</Select.Option>
                <Select.Option value="8">Phòng 8</Select.Option>
                <Select.Option value="9">Phòng 9</Select.Option>
                <Select.Option value="10">Phòng 10</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
}

export default ScheduleManagementByAdmin;
