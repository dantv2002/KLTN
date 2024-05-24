import { useState, useEffect, useCallback } from "react";
import { createStaff, getDoctor, deleteStaff, updateStaff, getDepartment} from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons"

const DoctorManagementByAdmin = () => {

    const location = useLocation();
    const [fullnameInsert, setFullNameInsert] = useState("");
    const [birthdayInsert, setBirthdayInsert] = useState("");
    const [genderInsert, setGenderInsert] = useState("");
    const [phoneInsert, setPhoneInsert] = useState("");
    const [identityInsert, setIdentityInsert] = useState("");
    const [addressInsert, setAddressInsert] = useState("");
    const [titleInsert, setTitleInsert] = useState("");
    const [departmentInsert, setDepartmentInsert] = useState("");
    const [visibleInsert, setVisibleInsert] = useState(false);
    const [formInsert] = Form.useForm();
    const [idDoctor, setIdDoctor] = useState("");
    const [fullnameUpdate, setFullNameUpdate] = useState("");
    const [birthdayUpdate, setBirthdayUpdate] = useState("");
    const [genderUpdate, setGenderUpdate] = useState("");
    const [phoneUpdate, setPhoneUpdate] = useState("");
    const [identityUpdate, setIdentityUpdate] = useState("");
    const [addressUpdate, setAddressUpdate] = useState("");
    const [titleUpdate, setTitleUpdate] = useState("");
    const [departmentUpdate, setDepartmentUpdate] = useState("");
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [formUpdate] = Form.useForm();
    const [dataDoctors, setDataDoctors] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [gender, setGender] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchTitle, setSearchTitle] = useState("");
    const [searchDepartment, setSearchDepartment] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const [listDepartment, setListDepartment] = useState([]);
    const [page, setPage] = useState("0");
    const [totalItems, setTotalItems] = useState("0");

      // Enable/disable update
    const [editingFullName, setEditingFullName] = useState(false);
    const [editingBirthday, setEditingBirthday] = useState(false);
    const [editingGender, setEditingGender] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [editingIdentity, setEditingIdentity] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(false);


    const columnsDoctors = [
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
          title: 'Chức danh',
          dataIndex: 'Title',
          key: 'Title',
        },
        {
          title: 'Khoa',
          dataIndex: 'DepartmentName',
          key: 'DepartmentName',
        },
        {
          title: 'Tùy chọn',
          dataIndex: 'options',
          key: 'options',
          render: (_, doctor) => (
            <Space size="middle">
              <Button type="link" className="readupdate" onClick={() => handleReadUpdate(doctor)}>
                Xem
              </Button>
              <Button type="link" danger className="delete" onClick={() => handleDeleteDoctor(doctor.Id)}>
                Xóa
              </Button>
            </Space>
          ),
        },
    ];

    const fetchDoctor = useCallback(async () => {
        try {
          const departmentSearch = searchDepartment || "";
          const genderSearch = searchGender || "";
          let response = await axios.get(getDoctor(searchKeyword, searchTitle, departmentSearch, genderSearch, page), {
            withCredentials: true
          });
          if (response.status === 200) {
            setTotalItems(response.data.Data.TotalItems);
            setDataDoctors(response.data.Data.HealthCareStaffs);
          }
        } catch(error) {
          message.error(error.response.data.Message);
        }
    }, [searchKeyword, searchTitle, searchDepartment, searchGender, page]);

    const fetchDepartment = async () => {
      try {
        let response = await axios.get(getDepartment("", ""), {
          withCredentials: true
        });
        if (response.status === 200) {
          const departmentsData = response.data.Data.Departments;
          const departmentsArray = departmentsData
            .filter(department => !department.deleted)
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

    const handleChangPage = (page) => {
      setPage(page-1);
    }

    const handleSearch = () => {
      setSearchKeyword(keyword);
      setSearchTitle(title);
      setSearchDepartment(department);
      setSearchGender(gender);
      setPage("0");
    };

    const handleInsert = () => {
        setVisibleInsert(true);
    };

    const handleCancelInsert = () => {
        setVisibleInsert(false);
    };

    const handleCreateDoctor = async() => {
        let dateofbirth = moment(birthdayInsert).format("DD/MM/YYYY");
        try{
            let response = await axios.post(createStaff, {
                FullName: fullnameInsert,
                DateOfBirth: dateofbirth,
                Gender: genderInsert,
                NumberPhone: phoneInsert,
                IdentityCard: identityInsert,
                Address: addressInsert,
                StaffType: "DOCTOR",
                Title: titleInsert,
                DepartmentId: departmentInsert,
            }, {
                withCredentials: true
            })
            if (response.status === 200){
                message.success(response.data.Message);
                setVisibleInsert(false)
                fetchDoctor();
            }
        }catch(error){
            message.error(error.response.data.Message);
        }
    }

    const handleDeleteDoctor = async(id) => {
        try {
            let response = await axios.delete(deleteStaff(id),{
              withCredentials: true,
            })
            if (response.status === 200){
              message.success(response.data.Message);
              fetchDoctor();
            }
        }catch(error){
          message.error(error.response.data.Message);
        }
    }

    const handleReadUpdate = (doctor) => {
      console.log(doctor)
      setIdDoctor(doctor.Id);
      setFullNameUpdate(doctor.FullName);
      setBirthdayUpdate(moment(doctor.DateOfBirth, "DD/MM/YYYY"));
      setGenderUpdate(doctor.Gender);
      setPhoneUpdate(doctor.NumberPhone);
      setIdentityUpdate(doctor.IdentityCard);
      setAddressUpdate(doctor.Address);
      setTitleUpdate(doctor.Title);
      setDepartmentUpdate(doctor.DepartmentId);
      formUpdate.setFieldsValue({
        reupfullname: doctor.FullName,
        reupdayofbirth: moment(doctor.DateOfBirth, "DD/MM/YYYY"),
        reupgender: doctor.Gender,
        reupphone: doctor.NumberPhone,
        reupidentity: doctor.IdentityCard,
        reupaddress: doctor.Address,
        reuptitle: doctor.Title,
        reupdepartment: doctor.DepartmentId,
      });
      setVisibleUpdate(true);
    };

    

    const handleCancelUpdate = () => {
      setVisibleUpdate(false);
      setEditingFullName(false);
      setEditingBirthday(false);
      setEditingGender(false);
      setEditingPhone(false);
      setEditingIdentity(false);
      setEditingAddress(false);
      setEditingTitle(false);
      setEditingDepartment(false);
    };

    const handleUpdateDoctor = async() => {
      let dateofbirth = moment(birthdayUpdate).format("DD/MM/YYYY");
      try{
          let response = await axios.put(updateStaff, {
              Id: idDoctor,
              FullName: fullnameUpdate,
              DateOfBirth: dateofbirth,
              Gender: genderUpdate,
              NumberPhone: phoneUpdate,
              IdentityCard: identityUpdate,
              Address: addressUpdate,
              StaffType: "DOCTOR",
              Title: titleUpdate,
              DepartmentId: departmentUpdate,
          }, {
              withCredentials: true
          })
          if (response.status === 200){
              message.success(response.data.Message);
              setVisibleUpdate(false);
              setEditingFullName(false);
              setEditingBirthday(false);
              setEditingGender(false);
              setEditingPhone(false);
              setEditingIdentity(false);
              setEditingAddress(false);
              setEditingTitle(false);
              setEditingDepartment(false);
              fetchDoctor();
          }
      }catch(error){
          message.error(error.response.data.Message);
      }
    }

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
    const handleEditTitle = () => {
      setEditingTitle(true);
    };
    const handleEditDepartment = () => {
      setEditingDepartment(true);
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
            <Button onClick={handleInsert} className="bg-cyan-400 text-black mt-6 mb-3" htmlType="submit" icon={<PlusOutlined />} >Tạo thông tin bác sĩ</Button>
            <Table 
                columns={columnsDoctors} 
                dataSource={dataDoctors}
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
              <Form {...formLayout} form={formInsert} onFinish={handleCreateDoctor}>
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
                <Form.Item name="inserttitle" label="Chức danh" rules={[{ required: true, message: 'Chức danh không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập chức danh"
                      value={titleInsert}
                      onChange={(e) => setTitleInsert(e.target.value)}
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
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem thông tin bác sĩ</h1>}
                visible={visibleUpdate}
                onOk={() => formUpdate.submit()}
                okText="Cập nhật"
                onCancel={handleCancelUpdate}
                cancelText="Thoát"
                okButtonProps={{ disabled: !(editingFullName || editingBirthday || editingGender || editingPhone || editingIdentity || editingAddress || editingTitle || editingDepartment), className: "bg-blue-700" }}
                cancelButtonProps={{ className: "bg-red-600" }}
            >
              <Form {...formLayout} form={formUpdate} onFinish={handleUpdateDoctor}>
                <Form.Item className="relative" name="reupfullname" label="Họ tên" rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
                    <Input 
                      type="text"
                      placeholder="Nhập họ tên"
                      value={fullnameUpdate}
                      onChange={(e) => setFullNameUpdate(e.target.value)}
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
                      value={birthdayUpdate ? moment(birthdayUpdate, 'DD/MM/YYYY') : null}
                      onChange={(date, dateString) => setBirthdayUpdate(dateString)}
                      disabled={!editingBirthday}
                    />
                    <EditOutlined onClick={handleEditBirthday} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
                </Form.Item>
                <Form.Item className="relative" name="reupgender" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
                    <Select
                      placeholder="Chọn giới tính"
                      value={genderUpdate}
                      onChange={(value) => setGenderUpdate(value)}
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
                      value={phoneUpdate}
                      onChange={(e) => setPhoneUpdate(e.target.value)}
                      disabled={!editingPhone}
                      className="pl-10"
                    />
                    <EditOutlined onClick={handleEditPhone} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
                </Form.Item>
                <Form.Item className="relative" name="reupidentity" label="CMND/CCCD" rules={[{ required: true, message: 'CMND/CCCD không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập CCCD/CMND"
                      value={identityUpdate}
                      onChange={(e) => setIdentityUpdate(e.target.value)}
                      disabled={!editingIdentity}
                      className="pl-10"
                    />
                    <EditOutlined onClick={handleEditIdentity} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
                </Form.Item>
                <Form.Item className="relative" name="reupaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ"
                      value={addressUpdate}
                      onChange={(e) => setAddressUpdate(e.target.value)}
                      disabled={!editingAddress}
                      className="pl-10"
                    />
                    <EditOutlined onClick={handleEditAddress} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
                </Form.Item>
                <Form.Item className="relative" name="reuptitle" label="Chức danh" rules={[{ required: true, message: 'Chức danh không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập chức danh"
                      value={titleUpdate}
                      onChange={(e) => setTitleUpdate(e.target.value)}
                      disabled={!editingTitle}
                      className="pl-10"
                    />
                    <EditOutlined onClick={handleEditTitle} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
                </Form.Item>
                <Form.Item className="relative" name="reupdepartment" label="Khoa" rules={[{ required: true, message: 'Khoa không được để trống!' }]}>
                    <Select
                      placeholder="Chọn khoa"
                      value={departmentUpdate}
                      onChange={(value) => setDepartmentUpdate(value)}
                      className="pl-10"
                      disabled={!editingDepartment}
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
                    <EditOutlined onClick={handleEditDepartment} className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
                </Form.Item>
              </Form>
            </Modal>
        </div>
    )
}

export default DoctorManagementByAdmin
