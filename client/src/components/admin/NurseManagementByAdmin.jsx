import { useState, useEffect, useCallback } from "react";
import { createStaff, getNurse, deleteStaff, updateStaff, getDepartmentAdmin} from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Form, Modal, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import Loading from "../../hook/Loading";

const NurseManagementByAdmin = () => {

    const location = useLocation();
    const [fullnameInsert, setFullNameInsert] = useState("");
    const [birthdayInsert, setBirthdayInsert] = useState("");
    const [genderInsert, setGenderInsert] = useState("");
    const [phoneInsert, setPhoneInsert] = useState("");
    const [identityInsert, setIdentityInsert] = useState("");
    const [addressInsert, setAddressInsert] = useState("");
    const [levelInsert, setLevelInsert] = useState("");
    const [departmentInsert, setDepartmentInsert] = useState("");
    const [visibleInsert, setVisibleInsert] = useState(false);
    const [formInsert] = Form.useForm();
    const [idNurse, setIdNurse] = useState("");
    const [fullnameUpdate, setFullNameUpdate] = useState("");
    const [birthdayUpdate, setBirthdayUpdate] = useState("");
    const [genderUpdate, setGenderUpdate] = useState("");
    const [phoneUpdate, setPhoneUpdate] = useState("");
    const [identityUpdate, setIdentityUpdate] = useState("");
    const [addressUpdate, setAddressUpdate] = useState("");
    const [levelUpdate, setLevelUpdate] = useState("");
    const [departmentUpdate, setDepartmentUpdate] = useState("");
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [formUpdate] = Form.useForm();
    const [dataNurses, setDataNurses] = useState([]);
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

    const columnsNurses = [
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
          title: 'Cấp bậc',
          dataIndex: 'Level',
          key: 'Level',
          render: (text) => {
            if (text === 'LEVEL2') return 'Level 2';
            if (text === 'LEVEL3') return 'Level 3';
            if (text === 'LEVEL4') return 'Level 4';
            return text;
          },
          sorter: (a, b) => {
            const renderLevel = (level) => {
              if (level === 'LEVEL2') return 'Level 2';
              if (level === 'LEVEL3') return 'Level 3';
              if (level === 'LEVEL4') return 'Level 4';
              return level;
            };
      
            const textA = renderLevel(a.Level);
            const textB = renderLevel(b.Level);
            return textA.localeCompare(textB);
          },
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
          render: (_, nurse) => (
            <Space size="middle">
              <Button type="link" className="readupdate" onClick={() => handleReadUpdate(nurse)}>
                Xem
              </Button>
              <Button type="link" danger className="delete" onClick={() => handleConfirmDelete(nurse.Id)}>
                Xóa
              </Button>
            </Space>
          ),
        },
    ];

    const fetchNurse = useCallback(async () => {
        try {
          setLoading(true)
          let response = await axios.get(getNurse(searchKeyword, page), {
            withCredentials: true
          });
          if (response.status === 200) {
            setTotalItems(response.data.Data.TotalItems);
            setDataNurses(response.data.Data.HealthCareStaffs);
          }
        } catch(error) {
          message.error(error.response.data.Message);
        } finally {
          setLoading(false);
        }
    },[searchKeyword, page]);

    const fetchDepartment = async () => {
      try {
        let response = await axios.get(getDepartmentAdmin("", ""), {
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
        fetchNurse();
        fetchDepartment();
    }, [location.pathname, fetchNurse]);

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

    const handleCreateNurse = async() => {
        let dateofbirth = moment(birthdayInsert).format("DD/MM/YYYY");
        try{
            let response = await axios.post(createStaff, {
                FullName: fullnameInsert,
                DateOfBirth: dateofbirth,
                Gender: genderInsert,
                NumberPhone: phoneInsert,
                IdentityCard: identityInsert,
                Address: addressInsert,
                StaffType: "NURSE",
                Level: levelInsert,
                DepartmentId: departmentInsert,
            }, {
                withCredentials: true
            })
            if (response.status === 200){
                message.success(response.data.Message);
                formInsert.resetFields();
                setVisibleInsert(false)
                fetchNurse();
            }
        }catch(error){
            message.error(error.response.data.Message);
        }
    }

    const handleDeleteNurse = async() => {
        try {
            let response = await axios.delete(deleteStaff(idDelete),{
              withCredentials: true,
            })
            if (response.status === 200){
              message.success(response.data.Message);
              setIdDelete("");
              setVisibleDelete(false);
              fetchNurse();
            }
        }catch(error){
          message.error(error.response.data.Message);
        }
    }

    const handleReadUpdate = (nurse) => {
      console.log(nurse)
      setIdNurse(nurse.Id);
      setFullNameUpdate(nurse.FullName);
      setBirthdayUpdate(moment(nurse.DateOfBirth, "DD/MM/YYYY"));
      setGenderUpdate(nurse.Gender);
      setPhoneUpdate(nurse.NumberPhone);
      setIdentityUpdate(nurse.IdentityCard);
      setAddressUpdate(nurse.Address);
      setLevelUpdate(nurse.Level);
      setDepartmentUpdate(nurse.DepartmentId);
      formUpdate.setFieldsValue({
        reupfullname: nurse.FullName,
        reupdayofbirth: moment(nurse.DateOfBirth, "DD/MM/YYYY"),
        reupgender: nurse.Gender,
        reupphone: nurse.NumberPhone,
        reupidentity: nurse.IdentityCard,
        reupaddress: nurse.Address,
        reuplevel: nurse.Level,
        reupdepartment: nurse.DepartmentId,
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

    const handleUpdateNurse = async() => {
      let dateofbirth = moment(birthdayUpdate).format("DD/MM/YYYY");
      try{
          let response = await axios.put(updateStaff, {
              Id: idNurse,
              FullName: fullnameUpdate,
              DateOfBirth: dateofbirth,
              Gender: genderUpdate,
              NumberPhone: phoneUpdate,
              IdentityCard: identityUpdate,
              Address: addressUpdate,
              StaffType: "NURSE",
              Level: levelUpdate,
              DepartmentId: departmentUpdate,
          }, {
              withCredentials: true
          })
          if (response.status === 200){
              message.success(response.data.Message);
              setVisibleUpdate(false);
              setEditing(false);
              fetchNurse();
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
            <Button onClick={handleInsert} className="bg-cyan-400 text-black mt-6 mb-3" htmlType="submit" icon={<PlusOutlined />} >Tạo thông tin điều dưỡng</Button>
            <Table 
                columns={columnsNurses} 
                dataSource={dataNurses}
                loading={{ indicator: <Loading/>, spinning: loading }}
                pagination={{
                  total: totalItems,
                  pageSize: 10,
                  current: page + 1,
                  onChange: handleChangPage,
                }}
            />
            <Modal 
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Thêm thông tin điều dưỡng</h1>}
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
                onFinish={handleCreateNurse}
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
                <Form.Item name="insertlevel" label="Cấp bậc" rules={[{ required: true, message: 'Cấp bậc không được để trống!' }]}>
                    <Select
                      placeholder="Chọn cấp bậc"
                      value={levelInsert}
                      onChange={(value) => setLevelInsert(value)}
                    >
                      <Select.Option value="LEVEL2">Level 2</Select.Option>
                      <Select.Option value="LEVEL3">Level 3</Select.Option>
                      <Select.Option value="LEVEL4">Level 4</Select.Option>
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
                onFinish={handleUpdateNurse}
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
                      className="w-full"
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
                      className="w-full"
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
                      className="w-full"
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupidentity" label="CCCD" rules={[{ required: true, message: 'CCCD không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập CCCD"
                      value={identityUpdate}
                      onChange={(e) => setIdentityUpdate(e.target.value)}
                      disabled={!editing}
                      className="w-full"
                    />
                </Form.Item>
                <Form.Item className="relative" name="reupaddress" label="Địa chỉ" rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ"
                      value={addressUpdate}
                      onChange={(value) => setAddressUpdate(value)}
                      disabled={!editing}
                      className="w-full"
                    />
                </Form.Item>
                <Form.Item className="relative" name="reuplevel" label="Cấp bậc" rules={[{ required: true, message: 'Cấp bậc không được để trống!' }]}>
                    <Select
                      placeholder="Chọn cấp bậc"
                      value={levelUpdate}
                      onChange={(value) => setLevelUpdate(value)}
                      disabled={!editing}
                      className="w-full"
                    >
                      <Select.Option value="LEVEL2">Level 2</Select.Option>
                      <Select.Option value="LEVEL3">Level 3</Select.Option>
                      <Select.Option value="LEVEL4">Level 4</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item className="relative" name="reupdepartment" label="Khoa" rules={[{ required: true, message: 'Khoa không được để trống!' }]}>
                    <Select
                      placeholder="Chọn khoa"
                      value={departmentUpdate}
                      onChange={(value) => setDepartmentUpdate(value)}
                      className="w-full"
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
              onOk={() => handleDeleteNurse()}
              okText="Xác nhận"
              onCancel={handleCancelDelete}
              cancelText="Thoát"
              okButtonProps={{ className: "bg-blue-700" }}
              cancelButtonProps={{ className: "bg-red-600" }}
            >
              <div className="text-center">
                <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa thông tin điều dưỡng này không?</p>
              </div>
            </Modal>
        </div>
    )
}

export default NurseManagementByAdmin
