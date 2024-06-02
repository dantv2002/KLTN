import { useState, useEffect, useCallback } from "react";
import { deleteAllEndMedical, deleteEndMedical, getEndMedical} from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Input, Select, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { SearchOutlined, CloseSquareOutlined } from "@ant-design/icons"
import moment from "moment";
import Loading from "../../hook/Loading";

const MedicalManagementByAdmin = () => {

  const location = useLocation();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("");
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");
  const [loading, setLoading] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDeleteAll, setVisibleDeleteAll] = useState(false);

  const columnsMedicals = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + page * 10,
    },
    {
      title: 'Ngày lưu kho',
      dataIndex: 'SaveDate',
      key: 'SaveDate',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <Input
            placeholder="Nhập ngày tạo"
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
        const date = moment(record.SaveDate, 'DD/MM/YYYY').date().toString().padStart(2, '0');
        const filterValue = value.toString().padStart(2, '0');
        return date === filterValue || date === value;
      },
    },
    {
      title: 'Ngày thanh lý',
      dataIndex: 'DueDate',
      key: 'DueDate',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <Input
            placeholder="Nhập ngày tạo"
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
        const date = moment(record.DueDate, 'DD/MM/YYYY').date().toString().padStart(2, '0');
        const filterValue = value.toString().padStart(2, '0');
        return date === filterValue || date === value;
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'Result',
      key: 'Result',
      render: (text) => {
        if (text === 'CURED') return 'Đã khỏi';
        if (text === 'RELIEVED') return 'Giảm bớt';
        if (text === 'UNCHANGED') return 'Không đổi';
        if (text === 'WORSENED') return 'Nặng hơn';
        if (text === 'DEATH') return 'Tử vong';
        if (text === 'ACCIDENT') return 'Tai nạn';
        return text;
      },
      sorter: (a, b) => {
        const renderResult = (result) => {
          if (result === 'CURED') return 'Đã khỏi';
          if (result === 'RELIEVED') return 'Giảm bớt';
          if (result === 'UNCHANGED') return 'Không đổi';
          if (result === 'WORSENED') return 'Nặng hơn';
          if (result === 'DEATH') return 'Tử vong';
          if (result === 'ACCIDENT') return 'Tai nạn';
          return result;
        };
  
        const textA = renderResult(a.Result);
        const textB = renderResult(b.Result);
        return textA.localeCompare(textB);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Chẩn đoán ra viện',
      dataIndex: 'DiagnosisDischarge',
      key: 'DiagnosisDischarge',
      sorter: (a, b) => a.DiagnosisDischarge.localeCompare(b.DiagnosisDischarge),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Loại bệnh án',
      dataIndex: 'Type',
      key: 'Type',
      render: (text) => {
        if (text === 'OUTPATIENT') return 'Ngoại trú';
        if (text === 'INPATIENT') return 'Nội trú';
        return text;
      },
      sorter: (a, b) => {
        const textA = a.Type === 'OUTPATIENT' ? 'Ngoại trú' : (a.Type === 'INPATIENT' ? 'Nội trú' : a.Type);
        const textB = b.Type === 'OUTPATIENT' ? 'Ngoại trú' : (b.Type === 'INPATIENT' ? 'Nội trú' : b.Type);
        return textA.localeCompare(textB);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, medical) => (
        <Space size="middle">
          <Button type="link" danger className="delete" onClick={() => handleConfirmDelete(medical.Id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const fetchMedical = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  const handleConfirmDelete = (id) => {
    setIdDelete(id);
    setVisibleDelete(true);
  }

  const handleCancelDelete = () => {
    setIdDelete("");
    setVisibleDelete(false);
  }

  const handleDeleteMedical = async() => {
    try {
      let response = await axios.delete(deleteEndMedical(idDelete),{
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setIdDelete("");
        setVisibleDelete(false);
        fetchMedical();
      }
    }catch(error){
      message.error(error.response.data.Message)
    }
  }

  const handleDeleteAll = () => {
    setVisibleDeleteAll(true);
  }

  const handleCancelDeleteAll = () => {
    setVisibleDeleteAll(false);
  }

  const handleDeleteAllMedicals = async() => {
    try {
      let response = await axios.delete(deleteAllEndMedical,{
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message)
        setVisibleDeleteAll(false);
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
        <Button onClick={() => handleDeleteAll()} className="bg-red-600 text-white mt-4 mb-3" htmlType="submit" icon={<CloseSquareOutlined />} >Xóa tất cả bệnh án hết hạn</Button>
        <Table 
          columns={columnsMedicals} 
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
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận xóa bệnh án</h1>}
          visible={visibleDelete}
          onOk={() => handleDeleteMedical()}
          okText="Xác nhận"
          onCancel={handleCancelDelete}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          <div className="text-center">
            <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa bệnh án này không?</p>
          </div>
        </Modal>
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận xóa bệnh án</h1>}
          visible={visibleDeleteAll}
          onOk={() => handleDeleteAllMedicals()}
          okText="Xác nhận"
          onCancel={handleCancelDeleteAll}
          cancelText="Thoát"
          okButtonProps={{ className: "bg-blue-700" }}
          cancelButtonProps={{ className: "bg-red-600" }}
        >
          <div className="text-center">
            <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn xóa tất cả bệnh án không?</p>
          </div>
        </Modal>
    </div>
  )
}

export default MedicalManagementByAdmin
