import { useState, useEffect, useCallback } from "react";
import { createStaff, getReceptionist, deleteStaff, updateStaff, showDepartmentAdmin} from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import Loading from "../../hook/Loading";

const ReceptionistManagementByAdmin = () => {

    const location = useLocation();
    const [fullnameInsert, setFullNameInsert] = useState("");
    const [birthdayInsert, setBirthdayInsert] = useState("");
    const [genderInsert, setGenderInsert] = useState("");
    const [phoneInsert, setPhoneInsert] = useState("");
    const [identityInsert, setIdentityInsert] = useState("");
    const [addressInsert, setAddressInsert] = useState("");
    const [computerLiteracyInsert, setComputerLiteracyInsert] = useState("");
    const [departmentInsert, setDepartmentInsert] = useState("");
    const [visibleInsert, setVisibleInsert] = useState(false);
    const [formInsert] = Form.useForm();
    const [idReceptionist, setIdReceptionist] = useState("");
    const [fullnameUpdate, setFullNameUpdate] = useState("");
    const [birthdayUpdate, setBirthdayUpdate] = useState("");
    const [genderUpdate, setGenderUpdate] = useState("");
    const [phoneUpdate, setPhoneUpdate] = useState("");
    const [identityUpdate, setIdentityUpdate] = useState("");
    const [addressUpdate, setAddressUpdate] = useState("");
    const [computerLiteracyUpdate, setComputerLiteracyUpdate] = useState("");
    const [departmentUpdate, setDepartmentUpdate] = useState("");
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [formUpdate] = Form.useForm();
    const [dataReceptionists, setDataReceptionists] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [listDepartment, setListDepartment] = useState([]);
    const [page, setPage] = useState("0");
    const [totalItems, setTotalItems] = useState("0");
    const [loading, setLoading] = useState(false);
    const [idDelete, setIdDelete] = useState("");
    const [visibleDelete, setVisibleDelete] = useState(false);

      // Enable/disable update
    const [editing, setEditing] = useState(false);

    const columnsReceptionists = [
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
          title: 'Trình độ tin học',
          dataIndex: 'ComputerLiteracy',
          key: 'ComputerLiteracy',
          sorter: (a, b) => a.ComputerLiteracy.localeCompare(b.ComputerLiteracy),
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
          render: (_, receptionist) => (
            <Space size="middle">
              <Button type="link" className="readupdate" onClick={() => handleReadUpdate(receptionist)}>
                Xem
              </Button>
              <Button type="link" danger className="delete" onClick={() => handleConfirmDelete(receptionist.Id)}>
                Xóa
              </Button>
            </Space>
          ),
        },
    ];

    const fetchReceptionist = useCallback(async () => {
        try {
          setLoading(true);
          let response = await axios.get(getReceptionist(searchKeyword, page), {
            withCredentials: true
          });
          if (response.status === 200) {
            setTotalItems(response.data.Data.TotalItems);
            setDataReceptionists(response.data.Data.HealthCareStaffs);
          }
        } catch(error) {
          message.error(error.response.data.Message);
        } finally {
          setLoading(false);
        }
    },[searchKeyword, page]);

    const fetchDepartment = async () => {
      try {
        let response = await axios.get(showDepartmentAdmin, {
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
        fetchReceptionist();
        fetchDepartment();
    }, [location.pathname, fetchReceptionist]);

    const handleChangPage = (page) => {
      setPage(page-1);
    }

    const handleSearch = () => {
      setSearchKeyword(keyword);
      setPage("0");
    };

    const handleInsert = () => {
        setVisibleInsert(true);
    };

    const handleCancelInsert = () => {
      formInsert.resetFields();
      setVisibleInsert(false);
    };

    const handleConfirmDelete = (id) => {
      setIdDelete(id);
      setVisibleDelete(true);
    }

    const handleCancelDelete = () => {
      setIdDelete("");
      setVisibleDelete(false);
    }

    const handleCreateReceptionist = async() => {
        let dateofbirth = moment(birthdayInsert).format("DD/MM/YYYY");
        try{
            let response = await axios.post(createStaff, {
                FullName: fullnameInsert,
                DateOfBirth: dateofbirth,
                Gender: genderInsert,
                NumberPhone: phoneInsert,
                IdentityCard: identityInsert,
                Address: addressInsert,
                StaffType: "RECEPTIONIST",
                ComputerLiteracy: computerLiteracyInsert,
                DepartmentId: departmentInsert,
            }, {
                withCredentials: true
            })
            if (response.status === 200){
                message.success(response.data.Message);
                formInsert.resetFields();
                setVisibleInsert(false);
                fetchReceptionist();
            }
        }catch(error){
            message.error(error.response.data.Message);
        }
    }

    const handleDeleteReceptionist = async() => {
        try {
            let response = await axios.delete(deleteStaff(idDelete),{
              withCredentials: true,
            })
            if (response.status === 200){
              message.success(response.data.Message);
              setIdDelete("");
              setVisibleDelete(true);
              fetchReceptionist();
            }
        }catch(error){
          message.error(error.response.data.Message);
        }
    }

    const handleReadUpdate = (receptionist) => {
      console.log(receptionist)
      setIdReceptionist(receptionist.Id);
      setFullNameUpdate(receptionist.FullName);
      setBirthdayUpdate(moment(receptionist.DateOfBirth, "DD/MM/YYYY"));
      setGenderUpdate(receptionist.Gender);
      setPhoneUpdate(receptionist.NumberPhone);
      setIdentityUpdate(receptionist.IdentityCard);
      setAddressUpdate(receptionist.Address);
      setComputerLiteracyUpdate(receptionist.ComputerLiteracy);
      setDepartmentUpdate(receptionist.DepartmentId);
      formUpdate.setFieldsValue({
        reupfullname: receptionist.FullName,
        reupdayofbirth: moment(receptionist.DateOfBirth, "DD/MM/YYYY"),
        reupgender: receptionist.Gender,
        reupphone: receptionist.NumberPhone,
        reupidentity: receptionist.IdentityCard,
        reupaddress: receptionist.Address,
        reupcomputerliteracy: receptionist.ComputerLiteracy,
        reupdepartment: receptionist.DepartmentId,
      });
      setVisibleUpdate(true);
    };

    const handleOpenForm = () => {
      setEditing(true);
    }

    const handleCancelUpdate = () => {
      setVisibleUpdate(false);
      setEditing(false);
    };

    const handleUpdateReceptionist = async() => {
      let dateofbirth = moment(birthdayUpdate).format("DD/MM/YYYY");
      try{
          let response = await axios.put(updateStaff, {
              Id: idReceptionist,
              FullName: fullnameUpdate,
              DateOfBirth: dateofbirth,
              Gender: genderUpdate,
              NumberPhone: phoneUpdate,
              IdentityCard: identityUpdate,
              Address: addressUpdate,
              StaffType: "RECEPTIONIST",
              ComputerLiteracy: computerLiteracyUpdate,
              DepartmentId: departmentUpdate,
          }, {
              withCredentials: true
          })
          if (response.status === 200){
              message.success(response.data.Message);
              setVisibleUpdate(false);
              setVisibleInsert(false);
              setEditing(false);
              fetchReceptionist();
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
              placeholder="Tìm theo tên"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
            <br/>
            <Button onClick={handleInsert} className="bg-cyan-400 text-black mt-6 mb-3" htmlType="submit" icon={<PlusOutlined />} >Tạo thông tin nhân viên tiếp nhận</Button>
            <Table 
                columns={columnsReceptionists} 
                dataSource={dataReceptionists}
                loading={{ indicator: <Loading/>, spinning: loading }}
                pagination={{
                  total: totalItems,
                  pageSize: 10,
                  current: page + 1,
                  onChange: handleChangPage,
                }}
            />
            <Modal 
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Thêm thông tin nhân viên tiếp nhận</h1>}
                visible={visibleInsert}
                onOk={() => formInsert.submit()}
                okText="Tạo"
                onCancel={handleCancelInsert}
                cancelText="Thoát"
                okButtonProps={{ className: "bg-blue-700" }}
                cancelButtonProps={{ className: "bg-red-600" }}
            >
              <Form {...formLayout} form={formInsert} onFinish={handleCreateReceptionist}>
                <Form.Item name="insertfullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
                    <Input 
                      type="text"
                      placeholder="Nhập họ tên"
                      value={fullnameInsert}
                      onChange={(e) => setFullNameInsert(e.target.value)}
                    />
                </Form.Item>
                <Form.Item name="insertdayofbirth" label="Ngày sinh" rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}>
                    <DatePicker
                      type="text"
                      className="w-full"
                      placeholder="Chọn ngày sinh"
                      value={birthdayInsert ? moment(birthdayInsert, 'DD/MM/YYYY') : null}
                      onChange={(date, dateString) => setBirthdayInsert(dateString)}
                    />
                </Form.Item>
                <Form.Item name="insertgender" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
                    <Select
                      placeholder="Chọn giới tính"
                      value={genderInsert}
                      onChange={(value) => setGenderInsert(value)}
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
                      value={phoneInsert}
                      onChange={(e) => setPhoneInsert(e.target.value)}
                    />
                </Form.Item>
                <Form.Item name="insertidentity" label="CMND/CCCD" rules={[{ required: true, message: 'CMND/CCCD không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập CCCD/CMND"
                      value={identityInsert}
                      onChange={(e) => setIdentityInsert(e.target.value)}
                    />
                </Form.Item>
                <Form.Item name="insertaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ"
                      value={addressInsert}
                      onChange={(e) => setAddressInsert(e.target.value)}
                    />
                </Form.Item>
                <Form.Item name="insertcomputerliteracy" label="Trình độ tin học" rules={[{ required: true, message: 'Trình độ tin học không được để trống!' }]}>
                    <Input
                      placeholder="Nhập trình độ tin học"
                      value={computerLiteracyInsert}
                      onChange={(e) => setComputerLiteracyInsert(e.target.value)}
                    />
                </Form.Item>
                <Form.Item name="insertdepartment" label="Khoa" rules={[{ required: true, message: 'Khoa không được để trống!' }]}>
                    <Select
                      placeholder="Chọn khoa"
                      value={departmentInsert}
                      onChange={(value) => setDepartmentInsert(value)}
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
                </Form.Item>
              </Form>
            </Modal>
            <Modal 
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem và cập nhật thông tin</h1>}
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
              <Form {...formLayout} form={formUpdate} onFinish={handleUpdateReceptionist}>
                <Form.Item className="relative" name="reupfullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
                    <Input 
                      type="text"
                      placeholder="Nhập họ tên"
                      value={fullnameUpdate}
                      onChange={(e) => setFullNameUpdate(e.target.value)}
                      disabled={!editing}
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupdayofbirth" label="Ngày sinh" rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}>
                    <DatePicker
                      type="text"
                      className="w-full"
                      placeholder="Chọn ngày sinh"
                      value={birthdayUpdate ? moment(birthdayUpdate, 'DD/MM/YYYY') : null}
                      onChange={(date, dateString) => setBirthdayUpdate(dateString)}
                      disabled={!editing}
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupgender" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
                    <Select
                      placeholder="Chọn giới tính"
                      value={genderUpdate}
                      onChange={(value) => setGenderUpdate(value)}
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
                      value={phoneUpdate}
                      onChange={(e) => setPhoneUpdate(e.target.value)}
                      disabled={!editing}
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupidentity" label="CMND/CCCD" rules={[{ required: true, message: 'CMND/CCCD không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập CCCD/CMND"
                      value={identityUpdate}
                      onChange={(e) => setIdentityUpdate(e.target.value)}
                      disabled={!editing}
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ"
                      value={addressUpdate}
                      onChange={(value) => setAddressUpdate(value)}
                      disabled={!editing}
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupcomputerliteracy" label="Trình độ tin học" rules={[{ required: true, message: 'Trình độ tin học không được để trống!' }]}>
                    <Input
                      placeholder="Nhập trình độ tin học"
                      value={computerLiteracyUpdate}
                      onChange={(e) => setComputerLiteracyUpdate(e.target.value)}
                      disabled={!editing}
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupdepartment" label="Khoa" rules={[{ required: true, message: 'Khoa không được để trống!' }]}>
                <Select
                      placeholder="Chọn khoa"
                      value={departmentUpdate}
                      onChange={(value) => setDepartmentUpdate(value)}
                      disabled={!editing}
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
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận xóa thông tin</h1>}
              visible={visibleDelete}
              onOk={() => handleDeleteReceptionist()}
              okText="Xác nhận"
              onCancel={handleCancelDelete}
              cancelText="Thoát"
              okButtonProps={{ className: "bg-blue-700" }}
              cancelButtonProps={{ className: "bg-red-600" }}
            >
              <div className="text-center">
                <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa thông tin nhân viên tiếp nhận này không?</p>
              </div>
            </Modal>
        </div>
    )
}

export default ReceptionistManagementByAdmin
