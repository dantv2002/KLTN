import { useState, useEffect, useCallback } from "react";
import { createStaff, getDoctor, deleteStaff, updateStaff, showDepartmentAdmin} from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import Loading from "../../hook/Loading";

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
    const [title, setTitle] = useState(null);
    const [department, setDepartment] = useState(null);
    const [gender, setGender] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchTitle, setSearchTitle] = useState("");
    const [searchDepartment, setSearchDepartment] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const [listDepartment, setListDepartment] = useState([]);
    const [page, setPage] = useState("0");
    const [totalItems, setTotalItems] = useState("0");
    const [loading, setLoading] = useState(false)
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [idDelete, setIdDelete] = useState("");
  

      // Enable/disable update
    const [editing, setEditing] = useState(false);

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
              <Button type="link" className="readupdate" onClick={() => handleReadUpdate(doctor)}>
                Xem
              </Button>
              <Button type="link" danger className="delete" onClick={() => handleConfirmDelete(doctor.Id)}>
                Xóa
              </Button>
            </Space>
          ),
        },
    ];

    const fetchDoctor = useCallback(async () => {
        try {
          setLoading(true);
          const titleSearch = searchTitle || "";
          const departmentSearch = searchDepartment || "";
          const genderSearch = searchGender || "";
          let response = await axios.get(getDoctor(searchKeyword, titleSearch, departmentSearch, genderSearch, page), {
            withCredentials: true
          });
          if (response.status === 200) {
            setTotalItems(response.data.Data.TotalItems);
            setDataDoctors(response.data.Data.HealthCareStaffs);
          }
        } catch(error) {
          message.error(error.response.data.Message);
        } finally {
          setLoading(false);
        }
    }, [searchKeyword, searchTitle, searchDepartment, searchGender, page]);

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
                formInsert.resetFields();
                setVisibleInsert(false)
                fetchDoctor();
            }
        }catch(error){
            message.error(error.response.data.Message);
        }
    }

    const handleDeleteDoctor = async() => {
        try {
            let response = await axios.delete(deleteStaff(idDelete),{
              withCredentials: true,
            })
            if (response.status === 200){
              message.success(response.data.Message);
              setIdDelete("");
              setVisibleDelete(false);
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

    const handleOpenForm = () => {
      setEditing(true);
    }

    const handleCancelUpdate = () => {
      setVisibleUpdate(false);
      setEditing(false);
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
              setEditing(false);
              fetchDoctor();
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
            <Select
              className="w-96 mt-3 mr-3"
              placeholder="Tìm theo chức danh"
              value={title}
              onChange={(value) => setTitle(value)}
              allowClear
            >
              <Select.Option value="Ths">Ths</Select.Option>
              <Select.Option value="TS">TS</Select.Option>
              <Select.Option value="BS">BS</Select.Option>
              <Select.Option value="BSCKI">BSCKI</Select.Option>
              <Select.Option value="BSCKII">BSCKII</Select.Option>
            </Select>
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
            <br/>
            <Button onClick={handleInsert} className="bg-cyan-400 text-black mt-6 mb-3" htmlType="submit" icon={<PlusOutlined />} >Tạo thông tin bác sĩ</Button>
            <Table 
                columns={columnsDoctors} 
                dataSource={dataDoctors}
                loading={{ indicator: <Loading/>, spinning: loading }}
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
              <Form 
                {...formLayout} 
                form={formInsert} 
                onFinish={handleCreateDoctor}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    formInsert.submit();
                  }
                }}
              >
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
                <Form.Item name="insertidentity" label="CCCD" rules={[{ required: true, message: 'CCCD không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập CCCD"
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
                    <Select
                      type="text"
                      placeholder="Chọn chức danh"
                      value={titleInsert}
                      onChange={(value) => setTitleInsert(value)}
                    >
                      <Select.Option value="Ths">Ths</Select.Option>
                      <Select.Option value="TS">TS</Select.Option>
                      <Select.Option value="BS">BS</Select.Option>
                      <Select.Option value="BSCKI">BSCKI</Select.Option>
                      <Select.Option value="BSCKII">BSCKII</Select.Option>
                    </Select>
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
              <Form 
                {...formLayout} 
                form={formUpdate}
                onFinish={handleUpdateDoctor}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    formUpdate.submit();
                  }
                }}
              >
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
                <Form.Item className="relative" name="reupidentity" label="CCCD" rules={[{ required: true, message: 'CCCD không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập CCCD"
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
                      onChange={(e) => setAddressUpdate(e.target.value)}
                      disabled={!editing}

                    />
                </Form.Item>
                <Form.Item className="relative" name="reuptitle" label="Chức danh" rules={[{ required: true, message: 'Chức danh không được để trống!' }]}>
                    <Select
                      type="text"
                      placeholder="Chọn chức danh"
                      value={titleUpdate}
                      onChange={(value) => setTitleUpdate(value)}
                      disabled={!editing}
                    >
                      <Select.Option value="Ths">Ths</Select.Option>
                      <Select.Option value="TS">TS</Select.Option>
                      <Select.Option value="BS">BS</Select.Option>
                      <Select.Option value="BSCKI">BSCKI</Select.Option>
                      <Select.Option value="BSCKII">BSCKII</Select.Option>
                    </Select>
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
              onOk={() => handleDeleteDoctor()}
              okText="Xác nhận"
              onCancel={handleCancelDelete}
              cancelText="Thoát"
              okButtonProps={{ className: "bg-blue-700" }}
              cancelButtonProps={{ className: "bg-red-600" }}
            >
              <div className="text-center">
                <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa thông tin bác sĩ này không?</p>
              </div>
            </Modal>
        </div>
    )
}

export default DoctorManagementByAdmin
