import { useState, useEffect, useCallback } from "react"
import { message, Space, Button, Table, Input, Modal, Select, Form } from "antd";
import axios from "axios";
import { createDepartment, deleteDepartment, getDepartment, updateDepartment } from "../../Api";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons"


const DepartmentManagementByAdmin = () => {

  const [nameInsert, setNameInsert] = useState("");
  const [idUpdate, setIdUpdate] = useState("");
  const [deletedUpdate, setDeletedUpdate] = useState();
  const [nameUpdate, setNameUpdate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");
  const [data, setData] = useState([]);
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [formInsert] = Form.useForm();
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [formUpdate] = Form.useForm();

  // Enable/disable update
  const [editingDeleted, setEditingDeleted] = useState(false);
  const [editingName, setEditingName] = useState(false);


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
    },
    {
      title: 'Tên khoa',
      dataIndex: 'NameDepartment',
      key: 'NameDepartment',
    },
    {
      title: 'Tình trạng',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (deleted) => (deleted ? 'Không tồn tại' : 'Tồn tại'),
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
          <Button type="link" danger className="delete" onClick={() => handleDeleteDepartment(department.Id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const fetchDepartment = useCallback(async () => {
    try {
      let response = await axios.get(getDepartment(searchKeyword, page), {
        withCredentials: true
      });
      if (response.status === 200) {
        message.success(response.data.Message);
        setTotalItems(response.data.Data.TotalItems);
        setData(response.data.Data.Departments);
      }
    } catch(error) {
      message.error(error.response.data.Message);
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
    setVisibleInsert(false);
  }

  const handleCreateDepartment = async() => {
      try{
        let response = await axios.post(createDepartment, {
          NameDepartment: nameInsert,
        }, {
          withCredentials: true
        })
        if (response.status === 200){
          message.success(response.data.Message);
          setKeyword("");
          setSearchKeyword("");
          setPage("0");
          setVisibleInsert(false);
          fetchDepartment();
        }
      }catch(error){
        message.error(error.response.data.Message);
      }
  }

  const handleDeleteDepartment = async(id) => {
    try{
      let response = await axios.delete(deleteDepartment(id), {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setKeyword("");
        setSearchKeyword("");
        setPage("0");
        setVisibleInsert(false);
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
    formUpdate.setFieldsValue({
      reupid: department.Id,
      reupname: department.NameDepartment,
      reupdeleted: department.deleted,
    });
    setVisibleUpdate(true);
  }; 

  const handleCancelReadUpdate = () => {
    setVisibleUpdate(false);
    setEditingName(false);
    setEditingDeleted(false);
  };

  const handleEditName = () => {
    setEditingName(true);
  }

  const handleEditDeleted = () => {
    setEditingDeleted(true);
  }

  const handleUpdateDepartment = async() => {
    try{
      let response = await axios.put(updateDepartment, {
        deleted: deletedUpdate,
        Id: idUpdate,
        NameDepartment: nameUpdate,
      }, {
        withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setEditingName(false);
        setEditingDeleted(false);
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
        pagination={{
          total: totalItems,
          pageSize: 10,
          current: page + 1,
          onChange: handleChangPage,
        }}
      />
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Thêm thông tin bác sĩ</h1>}
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
        </Form>
      </Modal>
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem thông tin khoa</h1>}
        visible={visibleUpdate}
        onOk={() => formUpdate.submit()}
        okText="Cập nhật"
        onCancel={handleCancelReadUpdate}
        cancelText="Thoát"
        okButtonProps={{ disabled: !(editingDeleted || editingName) , className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formUpdate} onFinish={handleUpdateDepartment}>
          <Form.Item className="relative" name="reupid" label="ID khoa" rules={[{ required: true, message: 'Id khoa không được để trống!' }]}>
            <Input 
              type="text"
              placeholder="Nhập ID khoa"
              value={idUpdate}
              disabled={true}
              className="pl-10"
            />
          </Form.Item>
          <Form.Item className="relative" name="reupname" label="Tên khoa" rules={[{ required: true, message: 'Tên khoa không được để trống!' }]}>
            <Input
              type="text"
              className="w-full pl-10"
              placeholder="Nhập tên khoa"
              value={nameUpdate}
              onChange={(e) => setNameUpdate(e.target.value)}
              disabled={!editingName}
            />
            <EditOutlined onClick={handleEditName} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
          <Form.Item className="relative" name="reupdeleted" label="Tình trạng" rules={[{ required: true, message: 'Tình trạng không được để trống!' }]}>
            <Select
              placeholder="Chọn tình trạng"
              value={deletedUpdate}
              onChange={(value) => setDeletedUpdate(value)}
              disabled={!editingDeleted}
              className="pl-10"
            >
              <Select.Option value={true}>Không tồn tại</Select.Option>
              <Select.Option value={false}>Tồn tại</Select.Option>
            </Select>
            <EditOutlined onClick={handleEditDeleted} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
          </Form.Item>
        </Form>
      </Modal>    
    </div>
  )
}

export default DepartmentManagementByAdmin
