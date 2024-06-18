import { useState, useEffect, useCallback } from "react"
import { message, Space, Button, Table, Input, Modal, Form, Select } from "antd";
import axios from "axios";
import { createDepartment, deleteDepartment, getDepartmentAdmin, updateDepartment } from "../../Api";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import Loading from "../../hook/Loading";

const DepartmentManagementByAdmin = () => {

  const [nameInsert, setNameInsert] = useState("");
  const [allowInsert, setAllowInsert] = useState(null);
  const [idUpdate, setIdUpdate] = useState("");
  const [deletedUpdate, setDeletedUpdate] = useState();
  const [nameUpdate, setNameUpdate] = useState("");
  const [allowUpdate, setAllowUpdate] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");
  const [data, setData] = useState([]);
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [formInsert] = Form.useForm();
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [formUpdate] = Form.useForm();
  const [idDelete, setIdDelete] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Enable/disable update
  const [editing, setEditing] = useState(false);

  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + page * 10,
    },
    {
      title: 'ID khoa',
      dataIndex: 'Id',
      key: 'Id',
      sorter: (a, b) => a.Id.localeCompare(b.Id),
      sortDirections: ['ascend', 'descend'],
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
      render: (_, department) => (
        <Space size="middle">
          <Button type="link" className="readupdate" onClick={() => handleReadUpdate(department)}>
            Xem
          </Button>
          <Button type="link" danger className="delete" onClick={() => handleConfirmDelete(department.Id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const fetchDepartment = useCallback(async () => {
    try {
      setLoading(true);
      let response = await axios.get(getDepartmentAdmin(searchKeyword, page), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItems(response.data.Data.TotalItems);
        setData(response.data.Data.Departments);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, page]);

  useEffect(() => {
    fetchDepartment();
  },[fetchDepartment])

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage("0");
  }

  const handleChangPage = (page) => {
    setPage(page-1);
  }

  const handleInsert = () => {
    setVisibleInsert(true);
  };

  const handleCancelInsert = () => {
    formInsert.resetFields()
    setVisibleInsert(false);
  }

  const handleConfirmDelete = (id) => {
    setIdDelete(id);
    setVisibleDelete(true);
  }

  const handleCancelDelete = () => {
    setIdDelete("");
    setVisibleDelete(false);
  }

  const handleCreateDepartment = async() => {
      try{
        let response = await axios.post(createDepartment, {
          NameDepartment: nameInsert,
          AllowBooking: allowInsert,
        }, {
          withCredentials: true
        })
        if (response.status === 200){
          message.success(response.data.Message);
          formInsert.resetFields()
          setVisibleInsert(false);
          fetchDepartment();
        }
      }catch(error){
        message.error(error.response.data.Message);
      }
  }

  const handleDeleteDepartment = async() => {
    try{
      let response = await axios.delete(deleteDepartment(idDelete), {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setVisibleDelete(false);
        fetchDepartment();
      }
    }catch(error){
      message.error(error.response.data.Message);
    }
  }

  const handleReadUpdate = (department) => {
    setIdUpdate(department.Id);
    setNameUpdate(department.NameDepartment);
    setDeletedUpdate(department.deleted);
    setAllowUpdate(department.AllowBooking);
    formUpdate.setFieldsValue({
      reupid: department.Id,
      reupname: department.NameDepartment,
      reupallow: department.AllowBooking,
    });
    setVisibleUpdate(true);
  }; 

  const handleOpenForm = () => {
    setEditing(true);
  }

  const handleCancelReadUpdate = () => {
    setVisibleUpdate(false);
    setEditing(false);
  };

  const handleUpdateDepartment = async() => {
    try{
      let response = await axios.put(updateDepartment, {
        deleted: deletedUpdate,
        Id: idUpdate,
        NameDepartment: nameUpdate,
        AllowBooking: allowUpdate,
      }, {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setEditing(false);
        setVisibleUpdate(false);
        fetchDepartment();
      }
    }catch(error){
      message.error(error.response.data.Message);
    }
  }

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
      <Input
        className="w-96 mt-3 mr-3"
        placeholder="Tìm theo tên khoa"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
      <br/>
      <Button onClick={handleInsert} className="bg-cyan-400 text-black mt-6 mb-3" htmlType="submit" icon={<PlusOutlined />} >Tạo khoa mới</Button>
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
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Thêm khoa mới</h1>}
        visible={visibleInsert}
        onOk={() => formInsert.submit()}
        okText="Tạo"
        onCancel={handleCancelInsert}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formInsert} onFinish={handleCreateDepartment}>
          <Form.Item name="insertname" label="Tên khoa" rules={[{ required: true, message: 'Tên khoa không được để trống!' }]}>
              <Input 
                type="text"
                placeholder="Nhập tên khoa"
                value={nameInsert}
                onChange={(e) => setNameInsert(e.target.value)}
              />
          </Form.Item>
          <Form.Item name="insertallow" label="Đặt lịch" rules={[{ required: true, message: 'Cho phép đặt lịch hay không!' }]}>
              <Select 
                placeholder="Cho phép đặt lịch"
                value={allowInsert}
                onChange={(value) => setAllowInsert(value)}
              >
                <Select.Option value={true}>Cho phép</Select.Option>
                <Select.Option value={false}>Không cho phép</Select.Option>
              </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem và cập nhật thông tin khoa</h1>}
        visible={visibleUpdate}
        onCancel={handleCancelReadUpdate}
        footer={[
          <Button key="custom" disabled={editing} className="bg-green-500 text-white" onClick={handleOpenForm}>
              Cập nhật
          </Button>,
          <Button key="submit" disabled={!editing} className="bg-blue-700" onClick={() => formUpdate.submit()}>
            Lưu
          </Button>,
          <Button key="cancel" className="bg-red-600" onClick={handleCancelReadUpdate}>
              Thoát
          </Button>
        ]}
      >
        <Form {...formLayout} form={formUpdate} onFinish={handleUpdateDepartment}>
          <Form.Item className="relative" name="reupid" label="ID khoa" rules={[{ required: true, message: 'Id khoa không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập ID khoa"
              value={idUpdate}
              disabled={true}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupname" label="Tên khoa" rules={[{ required: true, message: 'Tên khoa không được để trống!' }]}>
            <Input
              type="text"
              className="w-full"
              placeholder="Nhập tên khoa"
              value={nameUpdate}
              onChange={(e) => setNameUpdate(e.target.value)}
              disabled={!editing}
            />
          </Form.Item>
          <Form.Item className="relative" name="reupallow" label="Đặt lịch" rules={[{ required: true, message: 'Cho phép đặt lịch hay không!' }]}>
              <Select 
                placeholder="Cho phép đặt lịch"
                value={allowUpdate}
                onChange={(value) => setAllowUpdate(value)}
                disabled={!editing}
              >
                <Select.Option value={true}>Cho phép</Select.Option>
                <Select.Option value={false}>Không cho phép</Select.Option>
              </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận xóa khoa</h1>}
        visible={visibleDelete}
        onOk={() => handleDeleteDepartment()}
        okText="Xác nhận"
        onCancel={handleCancelDelete}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa khoa này không?</p>
        </div>
      </Modal>
    </div>
  )
}

export default DepartmentManagementByAdmin
