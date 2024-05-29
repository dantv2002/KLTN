import axios from "axios";
import moment from "moment"
import { message, Button, Table, Form, Modal, Space, Input, DatePicker, Select } from "antd";
import { SearchOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from "react";
import { createRecordReception, getDepartmentReceptionist, getListSchedule, getRecordReceptionist, registerNumberSchedule, updateRecordReception } from "../../Api";
import { useLocation } from "react-router-dom";

const RecordsManagementByReceptionist = () => {

  const location = useLocation();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [insertEmail, setInsertEmail] = useState("")
  const [insertFullName, setInsertFullName] = useState("");
  const [insertBirthday, setInsertBirthDay] = useState("");
  const [insertGender, setInsertGender] = useState("");
  const [insertPhone, setInsertPhone] = useState("");
  const [insertIdentity, setInsertIdentity] = useState("");
  const [insertAddress, setInsertAddress] = useState("");
  const [insertHealth, setInsertHealth] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateFullName, setUpdateFullName] = useState("");
  const [updateBirthday, setUpdateBirthday] = useState("");
  const [updateGender, setUpdateGender] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");
  const [updateIdentity, setUpdateIdentity] = useState("");
  const [updateAddress, setUpdateAddress] = useState("");
  const [updateHealth, setUpdateHealth] = useState("");
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [formInsert] = Form.useForm();
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [formUpdate] = Form.useForm();
  const [dataSchedules, setDataSchedules] = useState([]);
  const [visibleRead, setVisibleRead] = useState(false);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [visibleDepartment, setVisibleDepartment] = useState(false);
  const [department, setDepartment] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [pageRecord, setPageRecord] = useState("0");
  const [totalItemsRecord, setTotalItemsRecord] = useState("0");
  const [pageDepartment, setPageDepartment] = useState("0");
  const [totalItemsDepartment, setTotalItemsDepartment] = useState("0");

  // Enable/disable update
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [editingGender, setEditingGender] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);


  const columnsRecords = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageRecord * 10,
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'IdentityCard',
      key: 'IdentityCard',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, records) => (
        <Space size="middle">
          <Button type="link" className="readupdate" onClick={() => handleReadUpdate(records)}>
            Xem
          </Button>
          <Button type="link" className="register" onClick={() => handleReadDepartment()} >
            Đăng ký phòng khám
          </Button>
        </Space>
      ),
    },
  ];

  const columnsDepartments = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageDepartment * 10,
    },
    {
      title: 'Tên khoa',
      dataIndex: 'NameDepartment',
      key: 'NameDepartment',
    },
    {
      title: 'Vị trí',
      dataIndex: 'Location',
      key: 'Location',
    },
    {
      title: 'Số phòng',
      dataIndex: 'NumberOfRooms',
      key: 'NumberOfRooms',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, deparments) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleReadSchedules(deparments.Id)}>
            Xem lịch khám
          </Button>
        </Space>
      ),
    },
  ];

  const columnsSchedules = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1,
    },
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
          <Button type="link" onClick={() => handleRegisterSchedule(schedules.Id)}>
            Đăng ký
          </Button>
        </Space>
      ),
    },
  ];

  const fetchRecord = useCallback(async () => {
    try {
      const genderSearch = searchGender || "";
      let response = await axios.get(getRecordReceptionist(searchKeyword, genderSearch, searchYear, pageRecord), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItemsRecord(response.data.Data.TotalItems);
        setData(response.data.Data.Records);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  },[searchKeyword, searchGender, searchYear, pageRecord]);

  useEffect(() => {
      fetchRecord();
  }, [location.pathname, fetchRecord]);

  const handleSearchRecord = () => {
    setSearchKeyword(keyword);
    setSearchGender(gender);
    setSearchYear(year);
    setPageRecord("0");
  };

  const handleChangPageRecord = (page) => {
    setPageRecord(page-1);
  }

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const handleInsert = () => {
    setVisibleInsert(true);
  };
  const handleCancelInsert = () => {
    setVisibleInsert(false);
  };
  const handleNewRecord = async() => {
    let dateofbirth = moment(insertBirthday).format("DD/MM/YYYY");
    try {
      let response = await axios.post(createRecordReception, {
        Email: insertEmail,
        FullName: insertFullName,
        DateOfBirth: dateofbirth,
        Gender: insertGender,
        NumberPhone: insertPhone,
        IdentityCard: insertIdentity,
        Address: insertAddress,
        HealthInsurance: insertHealth,
      }, {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        setVisibleInsert(false);
        fetchRecord();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleReadUpdate = (record) => {
    setIdUpdate(record.Id);
    setUpdateEmail(record.Email);
    setUpdateFullName(record.FullName);
    setUpdateBirthday(moment(record.DateOfBirth, "DD/MM/YYYY"));
    setUpdateGender(record.Gender);
    setUpdatePhone(record.NumberPhone);
    setUpdateIdentity(record.IdentityCard);
    setUpdateAddress(record.Address);
    setUpdateHealth(record.HealthInsurance);
    formUpdate.setFieldsValue({
      reupemail: record.Email,
      reupfullname: record.FullName,
      reupdayofbirth: moment(record.DateOfBirth, "DD/MM/YYYY"),
      reupgender: record.Gender,
      reupphone: record.NumberPhone,
      reupidentity: record.IdentityCard,
      reupaddress: record.Address,
      reuphealth: record.HealthInsurance,
    });
    setVisibleUpdate(true);
  };

  const handleReadUpdateRecord = async() => {
    let dateofbirth = moment(updateBirthday).format("DD/MM/YYYY");
    try {
      let response = await axios.put(updateRecordReception, {
        Id: idUpdate,
        Email: updateEmail,
        FullName: updateFullName,
        DateOfBirth: dateofbirth,
        Gender: updateGender,
        NumberPhone: updatePhone,
        IdentityCard: updateIdentity,
        Address: updateAddress,
        HealthInsurance: updateHealth,
      }, {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        setVisibleUpdate(false);
        setEditingEmail(false);
        setEditingFullName(false);
        setEditingBirthday(false);
        setEditingGender(false);
        setEditingPhone(false);
        setEditingIdentity(false);
        setEditingAddress(false);
        setEditingHealth(false);
        fetchRecord();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleCancelUpdate = () => {
    setVisibleUpdate(false);
    setEditingEmail(false);
    setEditingFullName(false);
    setEditingBirthday(false);
    setEditingGender(false);
    setEditingPhone(false);
    setEditingIdentity(false);
    setEditingAddress(false);
    setEditingHealth(false);
  };
  
  const handleEditEmail = () => {
    setEditingEmail(true);
  };
  const handleEditFullName = () => {
    setEditingFullName(true);
  };
  const handleEditBirthday = () => {
    setEditingBirthday(true);
  };
  const handleEditGender = () => {
    setEditingGender(true);
  };
  const handleEditPhone = () => {
    setEditingPhone(true);
  };
  const handleEditIdentity = () => {
    setEditingIdentity(true);
  };
  const handleEditAddress = () => {
    setEditingAddress(true);
  };
  const handleEditHealth = () => {
    setEditingHealth(true);
  };

  const handleReadSchedules = async(id) => {
    try{
      console.log(id);
      let response = await axios.get(getListSchedule(id),{
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

  const handleCancelRead = () => {
    setVisibleRead(false);
    setDepartment("");
    setSearchDepartment("");
    setPageDepartment("0");
  }

  const handleRegisterSchedule = async(id) => {
    try{
      let response = await axios.get(registerNumberSchedule(id),{
        withCredentials: true,
      })
      if (response.status === 200){
        setDepartment("");
        setSearchDepartment("");
        setPageDepartment("0");
        message.success(response.data.Message)
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleCancelDepartment = () => {
    setVisibleDepartment(false);
    setDepartment("");
    setSearchDepartment("");
    setPageDepartment("0");
  }

  const fetchDepartment = useCallback(async() => {
    try{
      let response = await axios.get(getDepartmentReceptionist(searchDepartment, pageDepartment),{
        withCredentials: true
      })
      if (response.status === 200){
        setTotalItemsDepartment(response.data.Data.TotalItems);
        setDataDepartment(response.data.Data.Departments);
        message.success(response.data.Message);
      }
    }catch(error){
      message.error(error.response.data.Message);
    }
  },[searchDepartment, pageDepartment]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const handleSearchDeparment = () => {
    setSearchDepartment(department);
    setPageDepartment("0");
  };

  const handleReadDepartment = () => {
    setVisibleDepartment(true);
  }

  const handleChangPageDepartment = (page) => {
    setPageRecord(page-1);
  }

  return (
    <div>
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
      <Input
        className="w-96 mt-3 mr-3"
        placeholder="Tìm theo tên"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <DatePicker
        className="w-96 mt-3 mr-3"
        placeholder="Tìm theo năm sinh"
        picker="year"
        onChange={(date, dateString) => setYear(dateString)}
      />
      <Button onClick={() => handleSearchRecord()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
      <br/>
      <Button onClick={() => handleInsert()} className="bg-cyan-400 text-black mt-4 mb-4" htmlType="submit" icon={<PlusCircleOutlined />} >Thêm bệnh nhân mới</Button>
      <Table 
        columns={columnsRecords} 
        dataSource={data}
        pagination={{
          total: totalItemsRecord,
          pageSize: 10,
          current: pageRecord + 1,
          onChange: handleChangPageRecord,
        }}
      />
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Thêm hồ sơ</h1>}
        visible={visibleInsert}
        onOk={() => formInsert.submit()}
        okText="Tạo"
        onCancel={handleCancelInsert}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formInsert} onFinish={handleNewRecord}>
          <Form.Item name="insteremail" label="Email" rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập email"
              value={insertEmail}
              onChange={(e) => setInsertEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="insertfullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập họ tên"
              value={insertFullName}
              onChange={(e) => setInsertFullName(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="insertdayofbirth" label="Ngày sinh" rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}>
            <DatePicker
              type="text"
              className="w-full"
              placeholder="Chọn ngày sinh"
              value={insertBirthday ? moment(insertBirthday, 'DD/MM/YYYY') : null}
              onChange={(date, dateString) => setInsertBirthDay(dateString)}
            />
          </Form.Item>
          <Form.Item name="insertgender" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
            <Select
              placeholder="Chọn giới tính"
              value={insertGender}
              onChange={(value) => setInsertGender(value)}
            >
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="insertphone" label="Điện thoại" rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập số điện thoại"
              value={insertPhone}
              onChange={(e) => setInsertPhone(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="insertidentity" label="CMND/CCCD" rules={[{ required: true, message: 'CMND/CCCD không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập CCCD/CMND"
              value={insertIdentity}
              onChange={(e) => setInsertIdentity(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="insertaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              value={insertAddress}
              onChange={(e) => setInsertAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="inserthealth" label="Số BHYT" rules={[{ required: true, message: 'Số BHYT không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập số BHYT"
              value={insertHealth}
              onChange={(e) => setInsertHealth(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem hồ sơ</h1>}
        visible={visibleUpdate}
        onOk={() => formUpdate.submit()}
        okText="Cập nhật"
        onCancel={handleCancelUpdate}
        cancelText="Thoát"
        okButtonProps={{ disabled: !(editingEmail || editingFullName || editingBirthday || editingGender || editingPhone || editingIdentity || editingAddress || editingHealth), className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formUpdate} onFinish={handleReadUpdateRecord}>
          <Form.Item className="relative" name="reupemail" label="Email" rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              disabled={!editingEmail}
              className="pl-10"
            />
            <EditOutlined onClick={handleEditEmail} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupfullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập họ tên"
              value={updateFullName}
              onChange={(e) => setUpdateFullName(e.target.value)}
              disabled={!editingFullName}
              className="pl-10"
            />
            <EditOutlined onClick={handleEditFullName} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupdayofbirth" label="Ngày sinh" rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}>
            <DatePicker
              type="text"
              className="w-full pl-10"
              placeholder="Chọn ngày sinh"
              value={updateBirthday ? moment(updateBirthday, 'DD/MM/YYYY') : null}
              onChange={(date, dateString) => setUpdateBirthday(dateString)}
              disabled={!editingBirthday}
            />
            <EditOutlined onClick={handleEditBirthday} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupgender" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
            <Select
              placeholder="Chọn giới tính"
              value={updateGender}
              onChange={(value) => setUpdateGender(value)}
              disabled={!editingGender}
              className="pl-10"
            >
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
            <EditOutlined onClick={handleEditGender} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupphone" label="Điện thoại" rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập số điện thoại"
              value={updatePhone}
              onChange={(e) => setUpdatePhone(e.target.value)}
              disabled={!editingPhone}
              className="pl-10"
            />
            <EditOutlined onClick={handleEditPhone} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupidentity" label="CMND/CCCD" rules={[{ required: true, message: 'CMND/CCCD không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập CCCD/CMND"
              value={updateIdentity}
              onChange={(e) => setUpdateIdentity(e.target.value)}
              disabled={!editingIdentity}
              className="pl-10"
            />
            <EditOutlined onClick={handleEditIdentity} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              value={updateAddress}
              onChange={(e) => setUpdateAddress(e.target.value)}
              disabled={!editingAddress}
              className="pl-10"
            />
            <EditOutlined onClick={handleEditAddress} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reuphealth" label="Số BHYT" rules={[{ required: true, message: 'Số BHYT không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập số BHYT"
              value={updateHealth}
              onChange={(e) => setUpdateHealth(e.target.value)}
              disabled={!editingHealth}
              className="pl-10"
            />
            <EditOutlined onClick={handleEditHealth} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem phòng khám</h1>}
        visible={visibleDepartment}
        onCancel={handleCancelDepartment}
        cancelText="Thoát"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={600}
      >
        <Input
          className="w-80 mt-3 mr-3"
          placeholder="Tìm theo tên khoa"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <Button onClick={() => handleSearchDeparment()} className="bg-blue-700 text-white mt-3 mb-4" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
        <Table 
          columns={columnsDepartments} 
          dataSource={dataDepartment}
          pagination={{
            total: totalItemsDepartment,
            pageSize: 10,
            current: pageDepartment + 1,
            onChange: handleChangPageDepartment,
          }}
        />
      </Modal>
      <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem lịch khám</h1>}
          visible={visibleRead}
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
    </div>
  )
}

export default RecordsManagementByReceptionist
