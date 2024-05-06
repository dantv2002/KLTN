import axios from "axios";
import moment from "moment"
import { message, Button, Table } from "antd";
import { useState, useEffect } from "react";
import { getAllRecordsPatient } from "../../Api";

const Records = () => {

  const [data, setData] = useState([]);
  const [currentpage, setCurrentPage] = useState("");
  const [totalpage, setTotalPage] = useState("");


  useEffect(() => {
    const fetchPatientRecords = async() => {
      try {
        let response = await axios.get(getAllRecordsPatient, {
          withCredentials: true
        })
        if (response.status === 200) {
          console.log(response.data.Data)
          setData(response.data.Data.Records)
          setCurrentPage(response.data.Data.CurrentPage)
          setTotalPage(response.data.Data.TotalPages)
        }
      } catch(error) {
        message.error(error.response.data.Message)
      }
    }
    fetchPatientRecords();
  },[])

  const handleNewRecord = async() => {

  }
  const handleReadRecord = async() => {

  }

  const handleReadBloodPressure = async() => {
    
  }

  const handlePageChange = () => {
    
  };

  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + currentpage * 5,
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
      render: (DateOfBirth) => {
        return moment(DateOfBirth).format('DD-MM-YYYY');
      }
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'IdentityCard',
      key: 'IdentityCard',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, records) => (
        <>
          <Button className="read" onClick={() => handleReadRecord(records.id)}>
            Xem
          </Button>
          <Button className="" onClick={() => handleReadBloodPressure(records.id)}>
            Huyết áp
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 items-center"  >
      <h1 className=" text-3xl font-rubik text-blue-700">Quản lý hồ sơ</h1>
      <button onClick={handleNewRecord} className="bg-cyan-400 h-10 text-white px-4 py-2 rounded-[20px] hover:bg-hoverColor transition duration-300 ease-in-out">
        Thêm hồ sơ
      </button>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{
          total: totalpage * 5,
          pageSize: 5,
          current: currentpage + 1,
          onChange: handlePageChange,
        }}
      />
    </div>
  )
}

export default Records
