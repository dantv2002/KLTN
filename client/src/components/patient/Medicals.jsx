import { getAllRecordsPatient, getMedicalPatient } from "../../Api";
import axios from "axios";
import { message, Button, Space, Table, Modal, Input, Collapse, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons"
import Loading from "../../hook/Loading";
import moment from "moment";

const { Panel } = Collapse;

const Medicals = () => {

  const [dataRecords, setDataRecords] = useState([]);
  const [idRecord, setIdRecord] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dataMedicals, setDataMedicals] = useState([]);
  const [pageMedical, setPageMedical] = useState("0");
  const [totalItemsMedical, setTotalItemsMedical] = useState("0");
  const [visibleMedical, setVisibleMedical] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatientRecords = async() => {
      try {
        setLoading(true);
        let response = await axios.get(getAllRecordsPatient, {
          withCredentials: true
        })
        if (response.status === 200) {
          setDataRecords(response.data.Data.Records)
        }
      } catch(error) {
        message.error(error.response.data.Message)
      } finally {
        setLoading(false);
      }
    }
    fetchPatientRecords();
  },[])

  useEffect(() => {
    const fetchPatientMedical = async() => {
      if (idRecord) {
        try {
          setLoading(true);
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
        } finally {
          setLoading(false);
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

  const renderMedicalDetails = (medical) => {
    const {
      Reason,
      PathologicalProcess,
      MedicalHistory,
      Biosignal,
      ExamineOrgans,
      TreatmentMethod,
      Result,
      InitialDiagnosis,
      DiagnosisDischarge,
      Type,
      Summary,
      DepartmentName,
      Date,
      DoctorNameTreatment,
      DiagnosisImage,
      SpecializedExamination,
      Prognosis,
      DaysTreatment,
      DateDischarge,
      DateAdmission,
      DepartmentAdmissionName,
      DiagnosisAdmission,
      DateTransfer,
      DepartmentTransferName,
      DiagnosisTransfer
    } = medical;
  
    // Render Biosignal data
    const renderBiosignal = () => {
      if (Biosignal) {
        return (
          <div>
            <p className="text-base font-rubik"><b>Nhịp tim:</b> {Biosignal.HeartRate} nhịp/phút</p>
            <p className="text-base font-rubik"><b>Nhiệt độ:</b> {Biosignal.Temperature} °C</p>
            <p className="text-base font-rubik"><b>Huyết áp:</b> {Biosignal.BloodPressure} mmHg</p>
            <p className="text-base font-rubik"><b>Nhịp thở:</b> {Biosignal.RespiratoryRate} lần/phút</p>
            <p className="text-base font-rubik"><b>Cân nặng:</b> {Biosignal.Weight} kg</p>
          </div>
        );
      }
      return null;
    };

    const renderDiagnostic = () => {
      if (DiagnosisImage && DiagnosisImage.length > 0){
        return (
          <div>
            {DiagnosisImage.map(image => (
              <div key={image.Id}>
                <img src={image.UrlImage} alt={image.Content} />
                <p className="text-base font-rubik"><b>Phương pháp:</b> {image.Method}</p>
                <p className="text-base font-rubik"><b>Nội dung:</b> {image.Content}</p>
                <p className="text-base font-rubik"><b>Chẩn đoán:</b> {image.Conclude}</p>
                <p className="text-base font-rubik"><b>Bác sĩ thực hiện:</b> {image.DoctorNamePerform}</p>
                <hr className="my-8 border-gray-300"/>
              </div>
            ))}
          <p className="text-base font-rubik"><b>Kết quả hình ảnh:</b> {Summary}</p>
          </div>
        )
      } else {
        return (
          <div>
            Không có thông tin hình ảnh
          </div>
        )
      }
    }

    const changeType = (type) => {
      if (type === "OUTPATIENT") {
        return "Ngoại trú"
      } else {
        return "Nội trú"
      }
    }

    const changResult = (result) => {
      if (result === "CURED"){
        return "Đã khỏi"
      }
      if (result === "RELIEVED"){
        return "Giảm bớt"
      }
      if (result === "UNCHANGED"){
        return "Không đổi"
      }
      if (result === "WORSENED"){
        return "Nặng hơn"
      }
      if (result === "DEATH"){
        return "Tử vong"
      }
      if (result === "ACCIDENT"){
        return "Tai nạn"
      }
    }
  
    return (
      <div>
        {Type === "OUTPATIENT" ? (
          <div>
            <Collapse className="w-full text-lg font-rubik">
              <Panel header="Thông tin chung" key="1">
                <p className="text-base font-rubik"><b>Ngày khám:</b> {Date}</p>
                <p className="text-base font-rubik"><b>Lí do khám:</b> {Reason}</p>
                <p className="text-base font-rubik"><b>Quá trình bệnh lý:</b> {PathologicalProcess}</p>
                <p className="text-base font-rubik"><b>Tiền sử bệnh:</b> {MedicalHistory}</p>
                <p className="text-base font-rubik"><b>Kết quả các cơ quan:</b> {ExamineOrgans}</p>
                <p className="text-base font-rubik"><b>Phương pháp điều trị:</b> {TreatmentMethod}</p>
                <p className="text-base font-rubik"><b>Chẩn đoán ban đầu:</b> {InitialDiagnosis}</p>
                <p className="text-base font-rubik"><b>Chẩn đoán khi ra viện:</b> {DiagnosisDischarge}</p>
                <p className="text-base font-rubik"><b>Kết quả:</b> {changResult(Result)}</p>
                <p className="text-base font-rubik"><b>Loại bệnh án:</b> {changeType(Type)}</p>
                <p className="text-base font-rubik"><b>Khoa:</b> {DepartmentName}</p>
                <p className="text-base font-rubik"><b>Bác sĩ khám:</b> {DoctorNameTreatment}</p>
              </Panel>
            </Collapse>
            <Collapse className="w-full mt-2 text-lg font-rubik">
              <Panel header="Thông tin sinh hiệu" key="2">
                {renderBiosignal()}
              </Panel>
            </Collapse>
            <Collapse className="w-full mt-2 text-lg font-rubik">
              <Panel header="Thông tin hình ảnh" key="3">
                {renderDiagnostic()}
              </Panel>
            </Collapse>
          </div>
        ) : (
          <div>
            <Collapse className="w-full text-lg font-rubik">
              <Panel header="Thông tin chung" key="1">
                <p className="text-base font-rubik"><b>Ngày khám:</b> {Date}</p>
                <p className="text-base font-rubik"><b>Lí do khám:</b> {Reason}</p>
                <p className="text-base font-rubik"><b>Quá trình bệnh lý:</b> {PathologicalProcess}</p>
                <p className="text-base font-rubik"><b>Tiền sử bệnh:</b> {MedicalHistory}</p>
                <p className="text-base font-rubik"><b>Kết quả các cơ quan:</b> {ExamineOrgans}</p>
                <p className="text-base font-rubik"><b>Phương pháp điều trị:</b> {TreatmentMethod}</p>
                <p className="text-base font-rubik"><b>Tiên lượng:</b> {Prognosis}</p>
                <p className="text-base font-rubik"><b>Kết quả khám chuyên khoa:</b> {SpecializedExamination}</p>
                <p className="text-base font-rubik"><b>Ngày ra viện:</b> {DateDischarge}</p>
                <p className="text-base font-rubik"><b>Số ngày nội trú:</b> {DaysTreatment}</p>
                <p className="text-base font-rubik"><b>Chẩn đoán khi ra viện:</b> {DiagnosisDischarge}</p>
                <p className="text-base font-rubik"><b>Kết quả:</b> {changResult(Result)}</p>
                <p className="text-base font-rubik"><b>Loại bệnh án:</b> {changeType(Type)}</p>
                <p className="text-base font-rubik"><b>Bác sĩ khám:</b> {DoctorNameTreatment}</p>
              </Panel>
            </Collapse>
            <Collapse className="w-full mt-2 text-lg font-rubik">
              <Panel header="Thông tin nhập viện" key="2">
                <p className="text-base font-rubik"><b>Ngày nhập viện:</b> {DateAdmission}</p>
                <p className="text-base font-rubik"><b>Khoa nhập viện:</b> {DepartmentAdmissionName}</p>
                <p className="text-base font-rubik"><b>Chẩn đoán nhập viện:</b> {DiagnosisAdmission}</p>
              </Panel>
            </Collapse>
            <Collapse className="w-full mt-2 text-lg font-rubik">
              <Panel header="Thông tin chuyển khoa" key="3">
                <p className="text-base font-rubik"><b>Ngày chuyển khoa:</b> {DateTransfer}</p>
                <p className="text-base font-rubik"><b>Khoa chuyển sang:</b> {DepartmentTransferName}</p>
                <p className="text-base font-rubik"><b>Chẩn đoán của khoa:</b> {DiagnosisTransfer}</p>
              </Panel>
            </Collapse>
            <Collapse className="w-full mt-2 text-lg font-rubik">
              <Panel header="Thông tin sinh hiệu" key="4">
                {renderBiosignal()}
              </Panel>
            </Collapse>
            <Collapse className="w-full mt-2 text-lg font-rubik">
              <Panel header="Thông tin hình ảnh" key="5">
                {renderDiagnostic()}
              </Panel>
            </Collapse>
          </div>
        )}
      </div>
    );
  };

  const handleDetailMedical = (medical) => {
    Modal.info({
      title: <h1 className="text-xl font-rubik mb-3 text-blue-700">Thông tin bệnh án</h1>,
      content: renderMedicalDetails(medical),
      onOk() {},
      okButtonProps: {
        className: 'bg-blue-700 border-none'
      },
        width: 500,
        maskClosable: true,
        maskStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      sorter: (a, b) => a.Email.localeCompare(b.Email),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
      sorter: (a, b) => a.FullName.localeCompare(b.FullName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <Input
            placeholder="Nhập năm sinh"
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
        const yearOfBirth = moment(record.DateOfBirth, 'DD/MM/YYYY').year();
        return yearOfBirth.toString() === value;
      },
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'IdentityCard',
      key: 'IdentityCard',
      sorter: (a, b) => a.IdentityCard.localeCompare(b.IdentityCard),
      sortDirections: ['ascend', 'descend'],
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
      title: 'Thời gian khám/nhập viện',
      key: 'Date',
      render: (text, record) => {
        if (record.Type === 'OUTPATIENT') {
          return <span>{record.Date}</span>;
        } else if (record.Type === 'INPATIENT' && record.DateAdmission) {
          return <span>{record.DateAdmission}</span>;
        } else {
          return <span>N/A</span>;
        }
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <DatePicker
            placeholder="Chọn thời gian khám"
            format="DD/MM/YYYY"
            value={selectedKeys[0] ? moment(selectedKeys[0], 'DD/MM/YYYY') : null}
            onChange={(date) => setSelectedKeys(date ? [date.format('DD/MM/YYYY')] : [])}
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
        const filterValue = moment(value, 'DD/MM/YYYY');
        const dateOutpatient = moment(record.Date, 'HH:mm DD/MM/YYYY', true);
        const dateInpatient = moment(record.DateAdmission, 'HH:mm DD/MM/YYYY', true);
        return (record.Type === 'OUTPATIENT' && dateOutpatient.isSame(filterValue, 'day')) ||
               (record.Type === 'INPATIENT' && dateInpatient.isSame(filterValue, 'day'));
      },
    },    
    {
      title: 'Lí do',
      dataIndex: 'Reason',
      key: 'Reason',
      sorter: (a, b) => a.Reason.localeCompare(b.Reason),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Kết quả khám các cơ quan',
      dataIndex: 'ExamineOrgans',
      key: 'ExamineOrgans',
      sorter: (a, b) => a.ExamineOrgans.localeCompare(b.ReasonExamineOrgans),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Kết quả xuất viện',
      dataIndex: 'DiagnosisDischarge',
      key: 'DiagnosisDischarge',
      render: (text) => text ? text : 'Chưa xuất viện',
      sorter: (a, b) => {
        const textA = a.DiagnosisDischarge ? a.DiagnosisDischarge : 'Chưa xuất viện';
        const textB = b.DiagnosisDischarge ? b.DiagnosisDischarge : 'Chưa xuất viện';
        return textA.localeCompare(textB);
      },
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
          <Button type="link" className="read" onClick={() => handleDetailMedical(medical)}>
            Xem bệnh án
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 items-center">
        <h1 className=" text-3xl font-rubik text-blue-700 mb-6 mt-28 font-bold">Quản lý bệnh án</h1>
        <Table 
        columns={columnsRecords}
        loading={{ indicator: <Loading/>, spinning: loading }}
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
            loading={{ indicator: <Loading/>, spinning: loading }}
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
