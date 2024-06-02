import { useState, useEffect, useCallback } from "react";
import { createSchedule, getDoctor, getSchedule, updateSchedule, getDepartmentAdmin, deleteSchedule } from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker, InputNumber } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import Loading from "../../hook/Loading";

const ScheduleManagementByAdmin = () => {

    const location = useLocation();
    const [idDoctor, setIdDoctor] = useState("");
    const [dataDoctors, setDataDoctors] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState(null);
    const [gender, setGender] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchTitle, setSearchTitle] = useState("");
    const [searchDepartment, setSearchDepartment] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const [visibleInsert, setVisibleInsert] = useState(false);
    const [formInsert] = Form.useForm();
    const [visibleRead, setVisibleRead] = useState(false);
    const [dataSchedules, setDataSchedules] = useState([]);
    const [idSchedule, setIdSchedule] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [localtion2, setLocation2] = useState("");
    const [number, setNumber] = useState(0);
    const [callNumber, setCallNumber] = useState(0);
    const [clinic, setClinic] = useState("");
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [formUpdate] = Form.useForm();
    const [newSchedules, setNewSchedules] = useState([]);
    const [shouldReloadFormRead, setShouldReloadFormRead] = useState(false);
    const [listDepartment, setListDepartment] = useState([]);
    const [pageDoctor, setPageDoctor] = useState("0");
    const [totalItemsDoctor, setTotalItemsDoctor] = useState("0");
    const [pageSchedule, setPageSchedule] = useState("0");
    const [totalItemsSchedule, setTotalItemsSchedule] = useState("0");
    const [loading, setLoading] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);

    const columnsDoctors = [
        {
          title: 'Số thứ tự',
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
        title: 'STT',
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
        title: 'Vị trí',
        dataIndex: 'Location',
        key: 'Location',
        sorter: (a, b) => a.Location.localeCompare(b.Location),
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
        title: 'Đã gọi tới',
        dataIndex: 'CallNumber',
        key: 'CallNumber',
        sorter: (a, b) => a.CallNumber.localeCompare(b.CallNumber),
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
        render: (_, schedules) => (
          <Space size="middle">
            <Button type="link" onClick={() => handleUpdate(schedules)}>
              Cập nhật
            </Button>
            <Button type="link" danger onClick={() => handleConfirmDelete(schedules.Id)}>
              Xóa
            </Button>
          </Space>
        ),
      },
    ];

    const fetchDoctor = useCallback(async () => {
      try {
        setLoading(true);
        const departmentSearch = searchDepartment || "";
        const genderSearch = searchGender || "";
        let response = await axios.get(getDoctor(searchKeyword, searchTitle, departmentSearch, genderSearch, pageDoctor), {
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
    }, [searchKeyword, searchTitle, searchDepartment, searchGender, pageDoctor]);

    const fetchDepartment = async () => {
      try {
        let response = await axios.get(getDepartmentAdmin("", ""), {
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

    useEffect(() => {
      fetchDoctor();
      fetchDepartment();
    }, [location.pathname, fetchDoctor]);

    const handleChangPageDoctor = (page) => {
      setPageDoctor(page-1);
    }

    const handleSearch = () => {
      setSearchKeyword(keyword);
      setSearchTitle(title);
      setSearchDepartment(department);
      setSearchGender(gender);
      setPageDoctor("0");
    };

    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const handleReadSchedules = (id) => {
      setVisibleRead(true);
      setIdDoctor(id);
      console.log(id);
      setShouldReloadFormRead(true);
    }

    const fetchSchedule = useCallback(async () => {
      if (shouldReloadFormRead) {
        try{
          setLoading(true);
          let response = await axios.get(getSchedule(idDoctor, pageSchedule),{
            withCredentials: true
          })
          if (response.status === 200){
            setTotalItemsSchedule(response.data.Data.TotalItems);
            setDataSchedules(response.data.Data.Schedules);
          }
        }catch(error){
          message.error(error.response.data.Message)
        } finally {
          setLoading(false);
        }
        setShouldReloadFormRead(false);
      }
    }, [idDoctor, pageSchedule, shouldReloadFormRead]);

    useEffect(() => {
      fetchSchedule();
    }, [fetchSchedule]);

    const handleChangPageSchedule = (page) => {
      setPageSchedule(page-1);
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
      setPageSchedule("0");
    }

    const handleUpdate = (schedules) => {
      setIdSchedule(schedules.Id);
      setDate(moment(schedules.Date, "DD/MM/YYYY"));
      setTime(schedules.Time);
      setLocation2(schedules.Location);
      setClinic(schedules.Clinic);
      setNumber(parseInt(schedules.Number));
      setCallNumber(parseInt(schedules.CallNumber));
      setIdDoctor(schedules.DoctorId);
      formUpdate.setFieldsValue({
        date: moment(schedules.Date, "DD/MM/YYYY"),
        time: schedules.Time,
        location: schedules.Location,
        clinic: schedules.Clinic,
        number: parseInt(schedules.Number),
        callnumber: parseInt(schedules.CallNumber),
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
          Location: localtion2,
          Clinic: clinic,
          Number: parseInt(number),
          CallNumber: parseInt(callNumber),
          DoctorId: idDoctor,
        }];
        
        let response = await axios.put(updateSchedule(idDoctor), requestData, {
          withCredentials: true
        });
    
        if (response.status === 200) {
          message.success(response.data.Message);
          setVisibleUpdate(false);
          setShouldReloadFormRead(true);
          setPageSchedule("0");
        }
      } catch (error) {
        message.error(error.response.data.Message);
      }
    }

    const addScheduleForm = () => {
      setNewSchedules([...newSchedules, { date: "", time: "", clinic: "", location: "", datescreen: "" }]);
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

    const handleLocationChange = (locationValue, index) => {
      const updatedSchedules = [...newSchedules];
      updatedSchedules[index].location = locationValue;
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
          Location: schedule.location,
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

    const handleConfirmDelete = (id) => {
      setIdSchedule(id);
      setVisibleDelete(true);
    }

    const handleCancelDelete = () => {
      setVisibleDelete(false);
    }

    const handleDeleteSchedule = async() => {
      try {
        let response = await axios.delete(deleteSchedule(idDoctor, idSchedule),{
          withCredentials: true,
        })
        if (response.status === 200){
          message.success(response.data.Message);
          setVisibleDelete(false);
          setShouldReloadFormRead(true);
          setPageSchedule("0");
        }
    }catch(error){
      message.error(error.response.data.Message);
    }
    }

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
        <Select
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo khoa"
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
            loading={{ indicator: <Loading/>, spinning: loading }}
            pagination={{
              total: totalItemsDoctor,
              pageSize: 10,
              current: pageDoctor + 1,
              onChange: handleChangPageDoctor,
            }}
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
                <h2 className="text-sm font-bold mb-2 ml-3 text-green-400">Lịch khám {index + 1}</h2>
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
                    className="w-full"
                    placeholder="Chọn thời gian khám"
                    onChange={(value) => handleTimeChange(value, index)}
                  >
                    <Select.Option value="MORNING">Buổi sáng</Select.Option>
                    <Select.Option value="AFTERNOON">Buổi chiều</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Vị trí" rules={[{ required: true, message: 'Vị trí không được để trống!' }]}>
                  <Input
                    className="w-full"
                    placeholder="Chọn ngày khám"
                    value={schedule.location}
                    onChange={(e) => handleLocationChange(e.target.value, index)}
                  />
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
          width={900}
        >
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
            <Form.Item name="location" label="Vị trí" rules={[{ required: true, message: 'Vị trí không được để trống!' }]}>
              <Input
                type="text"
                className="w-full"
                placeholder="Nhập vị trí"
                value={localtion2}
                onChange={(e) => setLocation2(e.target.value)}
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
            <Form.Item name="number" label="Số thứ tự" rules={[{ required: true, message: 'Số thứ tự không được để trống!' }, { type: 'number', message: 'Vui lòng nhập một số!' }]}>
              <InputNumber
                type="text"
                className="w-full"
                placeholder="Nhập số thứ tự"
                value={number}
                onChange={(value) => setNumber(value)}
              />
            </Form.Item>
            <Form.Item name="callnumber" label="Đã gọi tới" rules={[{ required: true, message: 'Số đã gọi không được để trống!' }, { type: 'number', message: 'Vui lòng nhập một số!' }]}>
              <InputNumber
                type="text"
                className="w-full"
                placeholder="Nhập số đã gọi"
                value={callNumber}
                onChange={(value) => setCallNumber(value)}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận xóa lịch khám</h1>}
          visible={visibleDelete}
          onOk={() => handleDeleteSchedule()}
          okText="Xác nhận"
          onCancel={handleCancelDelete}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          <div className="text-center">
            <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa lịch khám này không?</p>
          </div>
        </Modal>
      </div>
    )
}

export default ScheduleManagementByAdmin;
