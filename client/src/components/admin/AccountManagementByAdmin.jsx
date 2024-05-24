import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getAccount, lockunlockAcount, renewPassword, deleteAccount } from "../../Api";
import { message, Space, Button, Table, Input, Select, Modal, Form } from "antd";
import { useLocation } from "react-router-dom";
import {SearchOutlined} from "@ant-design/icons"


const AccountManagementByAdmin = () => {

  const location = useLocation();
  const [dataAccount, setDataAccounts] = useState([])
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("");
  const [idAccount, setIdAccount] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [formUpdate] = Form.useForm();
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");

  const fetchAccount = useCallback(async () => {
    try {
      const typeSearch = searchType || "";
      let response = await axios.get(getAccount(searchKeyword, typeSearch, page), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItems(response.data.Data.TotalItems);
        setDataAccounts(response.data.Data.Accounts);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  }, [searchKeyword, searchType, page]);

  useEffect(() => {
    fetchAccount();
  }, [location.pathname, fetchAccount]);

  const handleChangPage = (page) => {
    setPage(page-1);
  }

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchType(type);
    setPage(0);
  };

  const handleLock = async(id) => {
    try{
      let response = await axios.put(lockunlockAcount(id),{
        Active: false,
      }, {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        fetchAccount();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleUnlock = async(id) => {
    try{
      let response = await axios.put(lockunlockAcount(id),{
        Active: true,
      }, {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        fetchAccount();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleCancelUpdate = () => {
    setVisibleUpdate(false);
  };

  const handleUpdate = (account) => {
    setIdAccount(account.Id);
    setEmail(account.Email);
    formUpdate.setFieldsValue({
      email: account.Email,
    });
    setVisibleUpdate(true);
  }

  const handleRenewPassword = async() => {
    try {
      let response = await axios.put(renewPassword,{
        Id: idAccount,
        Email: email,
        Password: password1,
        ConfirmPassword: password2
      },{
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message)
        setVisibleUpdate(false)
        fetchAccount();
      }
    }catch(error){  
      message.error(error.response.data.Message)
    }
  }

  const handleDelete = async(id) => {
    try{
      let response = await axios.delete(deleteAccount(id),{
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        fetchAccount();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }


  const columnsAccounts = [
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
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, account) => (
        <Space size="middle">
          <Button type="link" className="renew" onClick={() => handleUpdate(account)}>
            Cấp lại MK
          </Button>
          {account.actived ? (
            <Button type="link" className="lock" onClick={() => handleLock(account.Id)}>
              Khóa 
            </Button>
          ) : (
            <Button type="link" className="unlock" onClick={() => handleUnlock(account.Id)}>
              Mở 
            </Button>
          )}
          <Button type="link" danger className="renew" onClick={() => handleDelete(account.Id)}>
            Xóa
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
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo tên"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo vai trò"
          value={type}
          onChange={(value) => setType(value)}
          allowClear
        >
          <Select.Option value="patient">Bệnh nhân</Select.Option>
          <Select.Option value="doctor">Bác sĩ</Select.Option>
          <Select.Option value="nurse">Điều dưỡng</Select.Option>
          <Select.Option value="receptionist">Tiếp nhận</Select.Option>
        </Select>
        <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
      <Table 
          columns={columnsAccounts} 
          dataSource={dataAccount}
          pagination={{
            total: totalItems,
            pageSize: 10,
            current: page + 1,
            onChange: handleChangPage,
          }}
      />
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Đặt lại mật khẩu</h1>}
        visible={visibleUpdate}
        onOk={() => formUpdate.submit()}
        okText="Đặt lại"
        onCancel={handleCancelUpdate}
        cancelText="Thoát"
        okButtonProps={{className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formUpdate} onFinish={handleRenewPassword}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập email"
              value={email}
              disabled={true}
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

export default AccountManagementByAdmin
