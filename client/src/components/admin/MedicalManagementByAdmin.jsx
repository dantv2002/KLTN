import { useState, useEffect, useCallback } from "react";
import { deleteAllEndMedical, deleteEndMedical, getEndMedical} from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select } from "antd";
import { useLocation } from "react-router-dom";
import { SearchOutlined, CloseSquareOutlined } from "@ant-design/icons"

const MedicalManagementByAdmin = () => {

  const location = useLocation();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("");
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");

  const columnsMedicals = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + page * 10,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'CreateDate',
      key: 'CreateDate',
    },
    {
      title: 'Kết quả',
      dataIndex: 'Result',
      key: 'Result',
    },
    {
      title: 'Loại bệnh án',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, medical) => (
        <Space size="middle">
          <Button type="link" danger className="delete" onClick={() => handleDeleteMedicals(medical.Id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const fetchMedical = useCallback(async () => {
    try {
      const typeSearch = searchType || "";
      let response = await axios.get(getEndMedical(searchKeyword, typeSearch, page), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItems(response.data.Data.TotalItems);
        setData(response.data.Data.Medicals);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  }, [searchKeyword, searchType, page]);

  useEffect(() => {
      fetchMedical();
  }, [location.pathname, fetchMedical]);

  const handleChangPage = (page) => {
    setPage(page-1);
  }

  const handleSearch = async() => {
    setSearchKeyword(keyword);
    setSearchType(type);
    setPage("0");
  };

  const handleDeleteMedicals = async(id) => {
    try {
      let response = await axios.delete(deleteEndMedical(id),{
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message)
        fetchMedical();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleDeleteAllMedicals = async() => {
    try {
      let response = await axios.delete(deleteAllEndMedical,{
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message)
        fetchMedical();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  return (
    <div>
       <Input
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo kết quả chẩn đoán"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select
          className="w-96 mt-3 mr-3"
          placeholder="Tìm theo loại bệnh án"
          value={type}
          onChange={(value) => setType(value)}
          allowClear
        >
          <Select.Option value="DEATH">Tử vong</Select.Option>
          <Select.Option value="ACCIDENT">Tai nạn</Select.Option>
          <Select.Option value="Khác">Khác</Select.Option>
        </Select>
        <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
        <Button onClick={() => handleDeleteAllMedicals()} className="bg-red-600 text-white mt-4 mb-3" htmlType="submit" icon={<CloseSquareOutlined />} >Xóa tất cả bệnh án hết hạn</Button>
        <Table 
            columns={columnsMedicals} 
            dataSource={data}
            pagination={{
              total: totalItems,
              pageSize: 10,
              current: page + 1,
              onChange: handleChangPage,
            }}
        />
    </div>
  )
}

export default MedicalManagementByAdmin
