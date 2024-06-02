import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { unregisteredAccount, createAccount} from "../../Api";
import { message, Space, Button, Table, Input, Select, Modal, Form } from "antd";
import { useLocation } from "react-router-dom";
import {SearchOutlined} from "@ant-design/icons"
import moment from "moment";
import Loading from "../../hook/Loading";


const UnregisteredManagementByAdmin = () => {

  const location = useLocation();
  const [data, setData] = useState([])
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("");
  const [id, setId] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [formInsert] = Form.useForm();
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const typeSearch = searchType || "";
      let response = await axios.get(unregisteredAccount(searchKeyword, typeSearch, page), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItems(response.data.Data.TotalItems);
        setData(response.data.Data.HealthCareStaffs);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    } finally {
      setLoading(false);
    }
  },[searchKeyword, searchType, page]);
  
  useEffect(() => {
    fetchData();
  }, [location.pathname, fetchData]);

  const handleChangPage = (page) => {
    setPage(page-1);
  }

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchType(type);
    setPage(0);
  };


  const handleCancelInsert = () => {
    formInsert.resetFields();
    setVisibleInsert(false);
  };

  const handleInsert = (staff) => {
    setId(staff.Id);
    setVisibleInsert(true);
  }

  const handleCreateAccount = async() => {
    try {
        console.log(fullname);
        console.log(email);
        console.log(password1);
        console.log(password2);
        let response = await axios.post(createAccount(id),{
            FullName: fullname,
            Email: email,
            Password: password1,
            ConfirmPassword: password2,
      },{
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        formInsert.resetFields();
        setVisibleInsert(false);
        fetchData();
      }
    }catch(error){  
      message.error(error.response.data.Message)
    }
  }


  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + page * 10,
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
      title: 'Vai trò',
      dataIndex: 'StaffType',
      key: 'StaffType',
      render: (text) => {
        if (text === 'RECEPTIONIST') return 'Tiếp nhận';
        if (text === 'NURSE') return 'Điều dưỡng';
        if (text === 'DOCTOR') return 'Bác sĩ';
        return text;
      },
      sorter: (a, b) => {
        const renderRole = (role) => {
          if (role === 'RECEPTIONIST') return 'Tiếp nhận';
          if (role === 'NURSE') return 'Điều dưỡng';
          if (role === 'DOCTOR') return 'Bác sĩ';
          return role;
        };
  
        const textA = renderRole(a.StaffType);
        const textB = renderRole(b.StaffType);
        return textA.localeCompare(textB);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, staff) => (
        <Space size="middle">
          <Button type="link" className="renew" onClick={() => handleInsert(staff)}>
            Tạo tài khoản
          </Button>
        </Space>
      ),
    },
  ];

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
        <Input
          className="w-96 mt-3 mr-3 mb-2"
          placeholder="Tìm theo tên"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select
          className="w-96 mt-3 mr-3 mb-2"
          placeholder="Tìm theo vai trò"
          value={type}
          onChange={(value) => setType(value)}
          allowClear
        >
          <Select.Option value="doctor">Bác sĩ</Select.Option>
          <Select.Option value="nurse">Điều dưỡng</Select.Option>
          <Select.Option value="receptionist">Tiếp nhận</Select.Option>
        </Select>
        <Button onClick={() => handleSearch()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
      <Table 
          columns={columns} 
          dataSource={data}
          loading={{ indicator: <Loading/>, spinning: loading }}
          pagination={{
            total: totalItems,
            pageSize: 10,
            current: page + 1,
            onChange: handleChangPage,
          }}
      />
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tạo tài khoản</h1>}
        visible={visibleInsert}
        onOk={() => formInsert.submit()}
        okText="Tạo"
        onCancel={handleCancelInsert}
        cancelText="Thoát"
        okButtonProps={{className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formInsert} onFinish={handleCreateAccount}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="fullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập họ tên"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="pass1" label="Mật khẩu mới" rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}>
            <Input.Password 
              type="text"
              placeholder="Nhập mật khẩu mới"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="pass2" label="Nhập lại" rules={[{ required: true, message: 'Nhập lại không được để trống!' }]}>
            <Input.Password 
              type="text"
              placeholder="Nhập lại mật khẩu mới"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UnregisteredManagementByAdmin
