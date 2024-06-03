import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import { message, Input, Button, Space, Table, Modal } from "antd"
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons"
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { callNext, getTicketByNurse, updateTicket } from "../../Api"
import Loading from "../../hook/Loading";

const ReceptionManagementByNurse = () => {

  const [clinic, setClinic] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [idConfirm, setIdConfirm] = useState("");
  const [nameConfirm, setNameConfirm] = useState("");
  const [numberConfirm, setNumberConfirm] = useState("");
  const [clinicConfirm, setClinicConfirm] = useState("");
  const [locationConfirm, setLocationConfirm] = useState("");
  const [departmentConfirm, setDepartmentConfirm] = useState("");
  const [callNumber, setCallNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCallPatient = async() => {
    try {
      setLoading(true);
      let response = await axios.get(callNext(clinic, location), {
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message);
        console.log(response.data.Data.Number);
        setCallNumber(response.data.Data.Number)
        localStorage.setItem("nextNumber", response.data.Data.Number);
        localStorage.setItem("dataUpdated", "true");
      }
    }catch(error){
      message.error(error.response.data.Message);
    } finally {
      setLoading(false)
    }
  }

  const fetchTicket = useCallback(async() => {
    try {
      let response = await axios.get(getTicketByNurse(searchKeyword, page), {
        withCredentials: true
      })
      if (response.status === 200) {
        message.success(response.data.Message)
        setTotalItems(response.data.Data.TotalItems);
        setData(response.data.Data.Tickets);
      }
    } catch(error) {
      message.error(error.response.data.Message)
    }
  },[searchKeyword, page]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSearch = () => {
    setSearchKeyword(keyword)
    setPage("0");
  }

  const handleChangPage = (page) => {
    setPage(page-1);
  }

  const handleConfirm = (ticket) => {
    setIdConfirm(ticket.Id);
    setNameConfirm(ticket.NamePatient);
    setNumberConfirm(ticket.Number);
    setClinicConfirm(ticket.Clinic);
    setLocationConfirm(ticket.Area);
    setDepartmentConfirm(ticket.Department);
    setVisibleConfirm(true);
  }

  const handleCancelConfirm = () => {
    setVisibleConfirm(false);
  }

  const handleConfirmCall = async() => {
    try {
      let response = await axios.put(updateTicket,{
        Id: idConfirm
      },{
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message);
      }
    }catch(error){
      message.error(error.response.data.Message);
    }
  }

  const speakVN = async (text) => {
    const apiKey = 'AIzaSyCxE5hnFq4PyUadpmniiY1mPjN4I9lrBbU';
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const data = {
      input: { text },
      voice: { 
        languageCode: 'vi-VN',
        name: 'vi-VN-Neural2-A', 
        ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' }
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const audioContent = response.data.audioContent;
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    } catch (error) {
      console.error('Lỗi khi đọc văn bản:', error);
    }
  };


  const handleTextToSpeechVN = () => {
    if (callNumber !== 0) {
      speakVN(`Xin mời bệnh nhân có số thứ tự tiếp theo là ${callNumber} vào khám bệnh xin nhắc lại bệnh nhân có số thứ tự tiếp theo là ${callNumber} vào khám bệnh`);
    }
  }

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'NamePatient',
      key: 'NamePatient',
      sorter: (a, b) => a.NamePatient.localeCompare(b.NamePatient),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Vị trí khám',
      dataIndex: 'Area',
      key: 'Area',
      sorter: (a, b) => a.Area.localeCompare(b.Area),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Phòng khám',
      dataIndex: 'Clinic',
      key: 'Clinic',
      sorter: (a, b) => a.Clinic.localeCompare(b.Clinic),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ngày khám',
      dataIndex: 'Date',
      key: 'Date',
    },
    {
      title: 'Số thứ tự',
      dataIndex: 'Number',
      key: 'Number',
      sorter: (a, b) => a.Number.localeCompare(b.Number),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Khoa',
      dataIndex: 'Department',
      key: 'Department',
      sorter: (a, b) => a.Department.localeCompare(b.Department),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_,ticket) => (
        <Space size="middle">
          <Button type="link" className="read" onClick={() => handleConfirm(ticket)}>
            Xác nhận gọi
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Hãy nhập thông tin phòng khám và vị trí khám</h1>
      <Input
        className="w-96 mt-3 mr-3"
        placeholder="Nhập phòng khám"
        value={clinic}
        onChange={(e) => setClinic(e.target.value)}
      />
      <br/>
      <Input
        className="w-96 mt-3 mr-3"
        placeholder="Nhập vị trí khám"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br/>
      <Button onClick={() => handleCallPatient()} className="bg-green-500 text-white mt-3" htmlType="submit" icon={<UserAddOutlined/>} >Gọi bệnh nhân</Button>
      <Button onClick={() => handleTextToSpeechVN()} className="bg-cyan-400 text-white mt-3 ml-5" htmlType="submit" icon={<HiMiniSpeakerWave/>} >Phát loa ngoài</Button>
      <hr className="my-8 border-gray-300"/>
      <Input
        className="w-96 mt-3 mr-3"
        placeholder="Tìm phiếu khám theo tên bệnh nhân"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
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
        title={<h1 className="text-3xl font-bold text-blue-700 text-center mb-4">Xác nhận gọi bệnh nhân</h1>}
        visible={visibleConfirm}
        onOk={() => handleConfirmCall()}
        okText="Xác nhận"
        onCancel={handleCancelConfirm}
        cancelText="Hủy"
        okButtonProps={{ className: "bg-blue-700"}}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={600}
      >
        <div className="text-center">
          <p className="text-black mb-4 text-xl">Bệnh nhân {nameConfirm} đã vào phòng {clinicConfirm} ở {locationConfirm} thuộc {departmentConfirm} với số thứ tự {numberConfirm}</p>
          <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn với thông báo trên không?</p>
        </div>
      </Modal>
    </div>
  )
}

export default ReceptionManagementByNurse
