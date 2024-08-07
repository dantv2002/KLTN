import { useState, useEffect, useCallback } from "react";
import { createSchedule, getDoctor, getSchedule, updateSchedule, getDepartmentAdmin, deleteSchedule, deleteAllSchedule, getOneDepartmentAdmin } from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined, CloseSquareOutlined } from "@ant-design/icons"
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
    const [clinic, setClinic] = useState(null);
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
    const [visibleDeleteAll, setVisibleDeleteAll] = useState(false);
    const [idDepartment, setIdDepartment] = useState("");
    const [listClinics, setListClinics] = useState([]);

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
          title: 'CCCD',
          dataIndex: 'IdentityCard',
          key: 'IdentityCard',      
          sorter: (a, b) => a.IdentityCard.localeCompare(b.IdentityCard),
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
              <Button type="link" onClick={() => handleReadSchedules(doctor)}>
                Xem lịch
              </Button>
              <Button type="link" onClick={() => handleInsert(doctor)}>
                Tạo lịch
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

    const fetchOneDepartment = useCallback(async () => {
      console.log(idDepartment);
      if (idDepartment !== "") {
        try {
          let response = await axios.get(getOneDepartmentAdmin(idDepartment), {
            withCredentials: true
          });
          if (response.status === 200) {
            console.log(response.data.Data.Department.Clinics);
            setListClinics(response.data.Data.Department.Clinics);
          }
        } catch(error) {
          message.error(error.response.data.Message);
        }
      }
    }, [idDepartment]);

    useEffect(() => {
      fetchDoctor();
      fetchDepartment();
      fetchOneDepartment();
    }, [location.pathname, fetchDoctor, fetchOneDepartment]);

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

    const handleReadSchedules = (doctor) => {
      setIdDepartment(doctor.DepartmentId);
      setIdDoctor(doctor.Id);
      setVisibleRead(true);
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

    const handleInsert = (doctor) => {
      setIdDepartment(doctor.DepartmentId);
      setIdDoctor(doctor.Id);
      setVisibleInsert(true);
    };

    const handleCancelInsert = () => {
      setVisibleInsert(false);
      setIdDepartment("")
      setNewSchedules([])
    };

    const handleCancelRead = () => {
      setVisibleRead(false);
      setIdDepartment("");
      setPageSchedule("0");
    }

    const handleUpdate = (schedules) => {
      setIdSchedule(schedules.Id);
      setDate(moment(schedules.Date, "DD/MM/YYYY"));
      setTime(schedules.Time);
      setClinic(schedules.Clinic);
      setIdDoctor(schedules.DoctorId);
      formUpdate.setFieldsValue({
        date: moment(schedules.Date, "DD/MM/YYYY"),
        time: schedules.Time,
        location: schedules.Location,
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
          setPageSchedule("0");
        }
      } catch (error) {
        message.error(error.response.data.Message);
      }
    }

    const addScheduleForm = () => {
      setNewSchedules([...newSchedules, { date: "", time: "", clinic: null, datescreen: "" }]);
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

    const handleDeleteOneSchedule = (index) => {
      const updatedSchedules = [...newSchedules];
      updatedSchedules.splice(index, 1);
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
          setIdDepartment("");
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

    const handleConfirmDeleteAll = () => {
      setVisibleDeleteAll(true);
    }

    const handleCancelDeleteAll = () => {
      setVisibleDeleteAll(false);
    }

    const handleDeleteAll = async() => {
      try {
        let response = await axios.delete(deleteAllSchedule,{
          withCredentials: true,
        })
        if (response.status === 200){
          message.success(response.data.Message);
          setVisibleDeleteAll(false);
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
                <Button className="bg-red-600 text-white mb-2 ml-3" onClick={() => handleDeleteOneSchedule(index)}>Xóa</Button>
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
                <Form.Item label="Phòng" rules={[{ required: true, message: 'Phòng không được để trống!' }]}>
                  <Select
                    className="w-full"                
                    placeholder="Chọn phòng khám"
                    value={schedule.clinic}
                    onChange={(value) => handleClinicChange(value, index)}
                    allowClear
                  >
                    {listClinics.map((clinics) => (
                      <Select.Option 
                        key={clinics}
                        value={clinics}
                      >
                        Phòng {clinics}
                      </Select.Option>
                    ))}
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
          <Button onClick={() => handleConfirmDeleteAll()} className="bg-red-600 text-white mt-4 mb-3" htmlType="submit" icon={<CloseSquareOutlined />} >Xóa tất cả lịch khám các tháng trước</Button>
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
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Cập nhật lịch khám</h1>}
          visible={visibleUpdate}
          onOk={() => formUpdate.submit()}
          okText="Cập nhật"
          onCancel={handleCancelUpdate}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          <Form 
            {...formLayout} 
            form={formUpdate} 
            onFinish={handleUpdateSchedule}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                formUpdate.submit();
              }
            }}
          >
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
            <Form.Item name="clinic" label="Phòng" rules={[{ required: true, message: 'Phòng không được để trống!' }]}>
              <Select
                className="w-full"                
                placeholder="Chọn phòng khám"
                value={clinic}
                onChange={(value) => setClinic(value)}
                allowClear
              >
                {listClinics.map((clinics) => (
                  <Select.Option 
                    key={clinics}
                    value={clinics}
                  >
                    Phòng {clinics}
                  </Select.Option>
                ))}
              </Select>
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
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận xóa tất cả lịch khám</h1>}
          visible={visibleDeleteAll}
          onOk={() => handleDeleteAll()}
          okText="Xác nhận"
          onCancel={handleCancelDeleteAll}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          <div className="text-center">
            <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa tất cả lịch khám các tháng trước không?</p>
          </div>
        </Modal>
      </div>
    )
}

export default ScheduleManagementByAdmin;
