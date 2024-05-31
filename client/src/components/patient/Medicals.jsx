import { getAllRecordsPatient, getMedicalPatient } from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons"

const Medicals = () => {

  const [dataRecords, setDataRecords] = useState([]);
  const [idRecord, setIdRecord] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dataMedicals, setDataMedicals] = useState([]);
  const [pageMedical, setPageMedical] = useState("0");
  const [totalItemsMedical, setTotalItemsMedical] = useState("0");
  const [visibleMedical, setVisibleMedical] = useState(false);

  useEffect(() => {
    const fetchPatientRecords = async() => {
      try {
        let response = await axios.get(getAllRecordsPatient, {
          withCredentials: true
        })
        if (response.status === 200) {
          setDataRecords(response.data.Data.Records)
        }
      } catch(error) {
        message.error(error.response.data.Message)
      }
    }
    fetchPatientRecords();
  },[])

  useEffect(() => {
    const fetchPatientMedical = async() => {
      if (idRecord) {
        try {
          let response = await axios.get(getMedicalPatient(idRecord, searchKeyword, pageMedical), {
            withCredentials: true
          })
          if (response.status === 200) {
            message.success(response.data.Message)
            setTotalItemsMedical(response.data.Data.TotalItems);
            setDataMedicals(response.data.Data.Medicals)
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }
      }
    }
    fetchPatientMedical();
  },[idRecord, searchKeyword, pageMedical])

  const handleReadMedicals = (id) => {
    setIdRecord(id);
    setVisibleMedical(true);
  }

  const handleCancelMedical = () => {
    setIdRecord("");
    setVisibleMedical(false);
    setKeyword("");
    setSearchKeyword("");
    setPageMedical("0");
  }

  const handleChangPageMedical = (page) => {
    setPageMedical(page-1);
  }

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPageMedical("0");
  }

  const handleDetailMedical = (medical) => {
    Modal.info({
      title: medical.Id,
      content: (
        <div>
          <p><b>Ngày khám:</b> {medical.Date}</p>
          <p><b>Lí do:</b> {medical.Reason}</p>
          <p><b>Tiến trình bệnh lý:</b> {medical.PathologicalProcess}</p>
          <p><b>Tiền sử bệnh:</b> {medical.MedicalHistory}</p>
          <p><b>Chẩn đoán ban đầu:</b> {medical.InitialDiagnosis}</p>
          <p><b>Chỉ số sinh học:</b></p>
          <p className="ml-6"><b>Nhịp tim:</b> {medical.Biosignal.HeartRate}</p>
          <p className="ml-6"><b>Nhiệt độ:</b> {medical.Biosignal.Temperature}</p>
          <p className="ml-6"><b>Huyết áp:</b> {medical.Biosignal.BloodPressure}</p>
          <p className="ml-6"><b>Nhịp hô hấp:</b> {medical.Biosignal.RespiratoryRate}</p>
          <p className="ml-6"><b>Cân nặng:</b> {medical.Biosignal.Weight}kg</p>
          <p><b>Các cơ quan:</b> {medical.ExamineOrgans}</p>
          <p><b>Phương pháp điều trị:</b> {medical.TreatmentMethod}</p>
          <p><b>Kết quả xuất viện:</b> {medical.DiagnosisDischarge}</p>
        </div>
      ),
      onOk() {},
      okButtonProps: {
        className: 'bg-blue-700 border-none'
      },
    });
  };

  const columnsRecords = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1,
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
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" className="read" onClick={() => handleReadMedicals(record.Id)}>
            Xem bệnh án
          </Button>
        </Space>
      ),
    },
  ];

  const columnsMedicals = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageMedical * 10,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'Date',
      key: 'Date',
    },
    {
      title: 'Lí do',
      dataIndex: 'Reason',
      key: 'Reason',
    },
    {
      title: 'Các cơ quan',
      dataIndex: 'ExamineOrgans',
      key: 'ExamineOrgans',
    },
    {
      title: 'Chẩn đoán ban đầu',
      dataIndex: 'InitialDiagnosis',
      key: 'InitialDiagnosis',
    },
    {
      title: 'Chẩn đoán xuất viện',
      dataIndex: 'DiagnosisDischarge',
      key: 'DiagnosisDischarge',
    },
    {
      title: 'Loại bệnh án',
      dataIndex: 'Type',
      key: 'Type',
      render: (text) => {
        if (text === 'OUTPATIENT') return 'Ngoại trú';
        if (text === 'INPATIENT') return 'Nội trú';
        return text;
      }
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_, medical) => (
        <Space size="middle">
          <Button type="link" className="read" onClick={() => handleDetailMedical(medical)}>
            Xem bệnh án
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 items-center">
        <h1 className=" text-3xl font-rubik text-blue-700 mb-6 mt-28">Quản lý bệnh án</h1>
        <Table 
        columns={columnsRecords}
        dataSource={dataRecords}
        pagination={false}
        />
        <Modal
          title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Danh sách bệnh án</h1>}
          visible={visibleMedical}
          onCancel={handleCancelMedical}
          cancelText="Thoát"
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ className: "bg-red-600" }}
          width={1200}
        >
          <Input
            className="w-96 mt-3 mr-3"
            placeholder="Tìm theo chẩn đoán"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={() => handleSearch()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
          <Table 
            columns={columnsMedicals} 
            dataSource={dataMedicals}
            pagination={{
              total: totalItemsMedical,
              pageSize: 10,
              current: pageMedical + 1,
              onChange: handleChangPageMedical,
            }}
          />
        </Modal>
    </div>
  )
}

export default Medicals
