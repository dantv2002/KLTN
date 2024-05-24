import axios from "axios";
import moment from "moment"
import { message, Button, Table, Form, Modal, Space, Input, DatePicker, Select } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { deleteRecord, getAllRecordsPatient, newRecordsPatient, updateRecordPatient, getBiosignalPatient } from "../../Api";
import {SearchOutlined} from "@ant-design/icons"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Records = () => {

  //Data
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
  const [data, setData] = useState([]);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [searchDateStart, setSearchDateStart] = useState("");
  const [searchDateEnd, setSearchDataEnd] = useState("");
  const [idRecord, setIdRecord] = useState("");
  const [dataBiosignal, setDataBiosignal] = useState([]);
  const [visibleRead, setVisibleRead] = useState(false);
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [formInsert] = Form.useForm();
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [formUpdate] = Form.useForm();

  // Enable/disable update
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [editingGender, setEditingGender] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);


  useEffect(() => {
    const fetchPatientRecords = async() => {
      try {
        let response = await axios.get(getAllRecordsPatient, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.Data.Records)
        }
      } catch(error) {
        message.error(error.response.data.Message)
      }
    }
    fetchPatientRecords();
  },[])

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
      let response = await axios.post(newRecordsPatient, {
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
        sessionStorage.setItem("successMessage", response.data.Message)
        window.location.reload();

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
      let response = await axios.put(updateRecordPatient, {
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
        sessionStorage.setItem("successMessage", response.data.Message)
        window.location.reload();

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

  const handleDelete = async(id) => {
    try {
      let response = await axios.delete(deleteRecord(id),{
        withCredentials:true
      });
      if (response.status === 200){
        sessionStorage.setItem("successMessage", response.data.Message)
        window.location.reload();
      }
    }catch(error){
      sessionStorage.setItem("errorMessage", error.response.data.Message)
    }
  }

  useEffect(() => {
    const fetchPatientBiosignal = async() => {
      if (searchDateStart && searchDateEnd) {
        try {
          let datestart = moment(searchDateStart).format("DD/MM/YYYY");
          let dateend = moment(searchDateEnd).format("DD/MM/YYYY");
          let response = await axios.post(getBiosignalPatient(idRecord), {
            StartDate: datestart,
            EndDate: dateend,
          },{
            withCredentials: true
          })
          if (response.status === 200) {
            message.success(response.data.Message);
            setDataBiosignal(response.data.Data.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }
      }
    }
    fetchPatientBiosignal();
  },[idRecord, searchDateStart, searchDateEnd])

  const dataFake = [
    {
      BloodPressure: 0,
      HeartRate: 0,
      Temperature: 0,
      RespiratoryRate: 0,
      Date: "0",
      Weight: 0
    }
  ];


  const handleReadBloodPressure = (id) => {
    setIdRecord(id);
    setDataBiosignal(dataFake);
    setVisibleRead(true);
  }

  const handleSearchBloodPressure = () => {
    setSearchDateStart(dateStart);
    setSearchDataEnd(dateEnd);
  }

  const handleCancelRead = () => {
    setDateStart("");
    setDateEnd("");
    setSearchDateStart("");
    setSearchDataEnd("");
    setVisibleRead(false);
  }

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
  
  const columns = [
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
          <Button type="link" danger className="delete" onClick={() => handleDelete(records.Id)}>
            Xóa
          </Button>
          <Button type="link" className="blood" onClick={() => handleReadBloodPressure(records.Id)}>
            Sinh hiệu
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 items-center"  >
      <h1 className=" text-3xl font-rubik text-blue-700 mb-6 mt-28">Quản lý hồ sơ</h1>
      <button onClick={handleInsert} className="text-[15px] bg-cyan-400 h-9 text-white px-4 py-2 rounded-[5px] hover:bg-hoverColor transition duration-300 ease-in-out mb-4">
        Thêm hồ sơ
      </button>
      <Table 
        columns={columns}
        dataSource={data}
        pagination={false}
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
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem biểu đồ sinh hiệu</h1>}
        visible={visibleRead}
        onCancel={handleCancelRead}
        cancelText="Thoát"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={800}
      >
        <DatePicker
          className="w-60 mt-3 mr-3"
          placeholder="Chọn ngày bắt đầu"
          value={dateStart ? moment(dateStart, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateStart(dateString)}
        />
        <DatePicker
          className="w-60 mt-3 mr-3"
          placeholder="Chọn ngày kết thúc"
          value={dateEnd ? moment(dateEnd, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateEnd(dateString)}
        />
        <Button onClick={() => handleSearchBloodPressure()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tra cứu</Button>
        <ResponsiveContainer className="mt-6" width="100%" height={400}>
          <LineChart
            width={500}
            height={300}
            data={dataBiosignal}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" name="Ngày"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="BloodPressure" name="Huyết áp" stroke="#8884d8" />
            <Line type="monotone" dataKey="HeartRate" name="Nhịp tim" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Temperature" name="Nhiệt độ" stroke="#ffc658" />
            <Line type="monotone" dataKey="RespiratoryRate" name="Nhịp hô hấp" stroke="#ff7300" />
            <Line type="monotone" dataKey="Weight" name="Cân nặng" stroke="#387908" />
          </LineChart>
        </ResponsiveContainer>
      </Modal>
    </div>
  )
}

export default Records