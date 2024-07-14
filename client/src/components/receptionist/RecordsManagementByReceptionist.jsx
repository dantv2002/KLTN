import axios from "axios";
import moment from "moment"
import { message, Button, Table, Form, Modal, Space, Input, DatePicker, Select } from "antd";
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from "react";
import { createRecordReception, getDepartmentReceptionist, getListSchedule, getRecordReceptionist, registerNumberSchedule, updateRecordReception } from "../../Api";
import { useLocation } from "react-router-dom";
import Loading from "../../hook/Loading";
import logo from "../../assets/img/logo3.png"

const RecordsManagementByReceptionist = () => {

  const location = useLocation();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [gender, setGender] = useState(null);
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
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState([]);
  const [visibleTicket, setVisibleTicket] = useState(false);
  const [nameDepartment, setNameDepartment] = useState("");
  const [namePatient, setNamePatient] = useState("");
  const [nameLocation, setNameLocation] = useState("");

  // Enable/disable update
  const [editing, setEditing] = useState(false);

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
      sorter: (a, b) => a.FullName.localeCompare(b.FullName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <Input
            placeholder="Nhập năm sinh"
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
        const yearOfBirth = moment(record.DateOfBirth, 'DD/MM/YYYY').year();
        return yearOfBirth.toString() === value;
      },
    },
    {
      title: 'CCCD',
      dataIndex: 'IdentityCard',
      key: 'IdentityCard',
       sorter: (a, b) => a.IdentityCard.localeCompare(b.IdentityCard),
      sortDirections: ['ascend', 'descend'],
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
          <Button type="link" className="register" onClick={() => handleReadDepartment(records)} >
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
      sorter: (a, b) => a.NameDepartment.localeCompare(b.NameDepartment),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, deparments) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleReadSchedules(deparments)}>
            Xem lịch khám
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
      render: (_, __, index) => index + 1,
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
      title: 'Số',
      dataIndex: 'Number',
      key: 'Number',
      sorter: (a, b) => a.Number.localeCompare(b.Number),
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
          <Button type="link" onClick={() => handleRegisterSchedule(schedules.Id)}>
            Đăng ký
          </Button>
        </Space>
      ),
    },
  ];

  const fetchRecord = useCallback(async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false);
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
        setEditing(false);
        fetchRecord();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleOpenForm = () => {
    setEditing(true);
  }

  const handleCancelUpdate = () => {
    setVisibleUpdate(false);
    setEditing(false);
  };

  const handleReadSchedules = async(department) => {
    try{
      setNameDepartment(department.NameDepartment);
      setNameLocation(department.Location);
      setLoading(true);
      let response = await axios.get(getListSchedule(department.Id),{
        withCredentials: true
      })
      if (response.status === 200){
        setVisibleRead(true);
        setDataSchedules(response.data.Data.Schedules)
        message.success(response.data.Message)
      }
    }catch(error){
      message.error(error.response.data.Message)
    } finally {
      setLoading(false)
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
        setTicket(response.data.Data.Schedule)
        setVisibleTicket(true);
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
      setLoading(true);
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
    } finally {
      setLoading(false)
    }
  },[searchDepartment, pageDepartment]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const handleSearchDeparment = () => {
    setSearchDepartment(department);
    setPageDepartment("0");
  };

  const handleReadDepartment = (record) => {
    setVisibleDepartment(true);
    setNamePatient(record.FullName);
  }

  const handleChangPageDepartment = (page) => {
    setPageRecord(page-1);
  }

  const handleCancelTicket = () => {
    setVisibleTicket(false);
    setVisibleRead(false);
    setVisibleDepartment(false);
  }

  const tranferTime = (value) => {
    if (value === "MORNING"){
      return "Buổi sáng"
    }
    if (value === "AFTERNOON"){
      return "Buổi chiều"
    }
  }

  const handlePrintTicket = () => {
    const ticketTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Phiếu Đợi Khám Bệnh</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  width: 400px;
                  margin: 0 auto;
                  border: 1px solid #000;
                  padding: 20px;
                  text-align: center;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
              }
              .header {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
              }
              .header img {
                  margin-right: 10px;
              }
              .underline {
                  width: 100%;
                  border-bottom: 2px dashed #000;
                  position: absolute;
                  bottom: -10px;
                  left: 50%;
                  transform: translateX(-50%);
              }
              .title {
                  font-size: 24px;
                  font-weight: bold;
                  margin: 30px 0 10px;
              }
              .field {
                  margin-bottom: 7px;
                  font-size: 12px;
              }
              .flex-container {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
              }
              .separator {
                  width: 60%;
                  align-items: center;
                  border-top: 2px solid #000;
                  margin: 20px auto;
              }
              .label {
                  font-weight: bold;
              }
              .footer {
                  margin-top: 10px;
                  font-size: 12px;
                  text-align: left;
              }
              .number {
                  font-size: 100px;
                  color: #007bff;
              }
              .name {
                  font-size: 15px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="${logo}" alt="Logo" style="height: 30px;">
                  BỆNH VIỆN X
                  <div class="underline"></div>
              </div>
              <div class="title">PHIẾU ĐỢI KHÁM BỆNH</div>
              <div class="field">
                  <span class="label">Ngày khám:</span> ${ticket.Date}
              </div>
              <div class="field">
                  <span class="label">Buổi khám:</span> ${tranferTime(ticket.Time)}
              </div>
              <div class="separator"></div>
              <div class="field">
                  <span class="label">Số thứ tự của bạn:</span><br> <span class="number">${ticket.Number}</span>
              </div>
              <div class="field">
                  <span class="label">Số thứ tự đang phục vụ:</span> ${ticket.CallNumber}
              </div>
              <div class="field">
                  <span class="label">Bệnh nhân:</span> <span class="name">${namePatient}</span>
              </div>
              <div class="separator"></div>
              <div class="flex-container">
                  <div class="field">
                      <span class="label">Khoa:</span> ${nameDepartment}
                  </div>
                  <div class="field">
                      <span class="label">Tầng:</span> ${nameLocation}
                  </div>
                  <div class="field">
                      <span class="label">Phòng:</span> ${ticket.Clinic}
                  </div>
              </div>
              <div class="footer">
                  <p>Lưu ý:</p>
                  <ul>
                      <li>Vui lòng giữ gìn phiếu đợi để được phục vụ tốt nhất.</li>
                      <li>Khi đến lượt, vui lòng di chuyển đến phòng khám đúng giờ.</li>
                      <li>Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ nhân viên y tế.</li>
                  </ul>
              </div>
          </div>
          <script>
            window.onload = function() {
                window.print();
            }
          </script>
      </body>
      </html>
    `;
    const newWindow = window.open(`${ticket.Id}`, '_blank');
    newWindow.document.write(ticketTemplate);
    newWindow.document.close();
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
        loading={{ indicator: <Loading/>, spinning: loading }}
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
        <Form 
          {...formLayout} 
          form={formInsert} 
          onFinish={handleNewRecord}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              formInsert.submit();
            }
          }}
        >
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
          <Form.Item name="insertidentity" label="CCCD" rules={[{ required: true, message: 'CCCD không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập CCCD"
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
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem và cập nhật hồ sơ</h1>}
        visible={visibleUpdate}
        onCancel={handleCancelUpdate}
        footer={[
          <Button key="custom" disabled={editing} className="bg-green-500 text-white" onClick={handleOpenForm}>
              Cập nhật
          </Button>,
          <Button key="submit" disabled={!editing} className="bg-blue-700" onClick={() => formUpdate.submit()}>
            Lưu
          </Button>,
          <Button key="cancel" className="bg-red-600" onClick={handleCancelUpdate}>
              Thoát
          </Button>
        ]}
      >
        <Form 
          {...formLayout} 
          form={formUpdate} 
          onFinish={handleReadUpdateRecord}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              formUpdate.submit();
            }
          }}
        >
          <Form.Item className="relative" name="reupemail" label="Email" rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupfullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập họ tên"
              value={updateFullName}
              onChange={(e) => setUpdateFullName(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupdayofbirth" label="Ngày sinh" rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}>
            <DatePicker
              type="text"
              className="w-full"
              placeholder="Chọn ngày sinh"
              value={updateBirthday ? moment(updateBirthday, 'DD/MM/YYYY') : null}
              onChange={(date, dateString) => setUpdateBirthday(dateString)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupgender" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
            <Select
              placeholder="Chọn giới tính"
              value={updateGender}
              onChange={(value) => setUpdateGender(value)}
              disabled={!editing}
            >
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="relative" name="reupphone" label="Điện thoại" rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập số điện thoại"
              value={updatePhone}
              onChange={(e) => setUpdatePhone(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupidentity" label="CCCD" rules={[{ required: true, message: 'CCCD không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập CCCD"
              value={updateIdentity}
              onChange={(e) => setUpdateIdentity(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              value={updateAddress}
              onChange={(e) => setUpdateAddress(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reuphealth" label="Số BHYT" rules={[{ required: true, message: 'Số BHYT không được để trống!' }]}>
            <Input
              type="text"
              placeholder="Nhập số BHYT"
              value={updateHealth}
              onChange={(e) => setUpdateHealth(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem khoa khám</h1>}
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
          loading={{ indicator: <Loading/>, spinning: loading }}
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
          width={700}
        >
          <Table 
            columns={columnsSchedules} 
            dataSource={dataSchedules}
            loading={{ indicator: <Loading/>, spinning: loading }}
          />
        </Modal>
        <Modal
          title={<h1 className="text-2xl font-bold text-green-500 text-center mb-4">In phiếu đợi khám bệnh</h1>}
          visible={visibleTicket}
          onOk={handlePrintTicket}
          okText="In phiếu"
          onCancel={handleCancelTicket}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
          width={700}
        >
          <div className="text-center">
            <p className="text-blue-700 mb-4 text-[17px]">Hệ thống sẽ thực hiện in phiếu đợi khám bệnh này cho bệnh nhân. Hãy nhấn in phiếu</p>
          </div>
        </Modal>
    </div>
  )
}

export default RecordsManagementByReceptionist
