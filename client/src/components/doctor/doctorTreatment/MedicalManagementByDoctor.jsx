import axios from "axios";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import { message, Table, Input, Space, Button, Modal, Select, DatePicker, Form, Collapse, InputNumber } from "antd";
import { getMedicalNurDoc, getRecordNurDoc, getDepartmentNurDoc, getMark, updateMedical, lockedMedical } from "../../../Api";
import { PlusOutlined, SearchOutlined, FunnelPlotOutlined } from '@ant-design/icons';
import Loading from "../../../hook/Loading";
import logo from "../../../assets/img/logo3.png"

const { Panel } = Collapse;

const MedicalManagementByDoctor = () => {

  const [keywordMedical, setKeywordMedical] = useState("");
  const [searchKeywordMedical, setSearchKeywordMedical] = useState("");
  const [markMedical, setMarkMedical] = useState("");
  const [searchMarkMedical, setSearchMarkMedical] = useState("");
  const [idRecord, setIdRecord] = useState("");
  const [searchIdRecord, setSearchIdRecord] = useState("");
  const [show, setShow] = useState(true);
  const [buttonShow, setButtonShow] = useState("Bệnh án của bác sĩ")
  const [dataMedical, setDataMedical] = useState([]);
  const [pageMedical, setPageMedical] = useState("0");
  const [totalItemsMedical, setTotalItemsMedical] = useState("0");
  const [name, setName] = useState("");
  const [keywordRecord, setKeywordRecord] = useState("");
  const [genderRecord, setGenderRecord] = useState(null);
  const [yearRecord, setYearRecord] = useState("");
  const [searchKeywordRecord, setSearchKeywordRecord] = useState("");
  const [searchGenderRecord, setSearchGenderRecord] = useState("");
  const [searchYearRecord, setSearchYearRecord] = useState("");
  const [dataRecord, setDataRecord] = useState("0");
  const [pageRecord, setPageRecord] = useState("0");
  const [totalItemsRecord, setTotalItemsRecord] = useState("0");
  const [listDepartment, setListDepartment] = useState([]);
  const [visibleReUpInpatient, setVisibleReUpInpatient] = useState(false);
  const [formUpdateInpatient] = Form.useForm();
  const [visibleReUpOutpatient, setVisibleReUpOutpatient] = useState(false);
  const [formUpdateOutpatient] = Form.useForm();
  const [visibleReadRecordMedical, setVisibleReadRecordMedical] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [visibleLocked, setVisibleLocked] = useState(false);
  const [idLocked, setIdLocked] = useState("");
  const [visibleTicket, setVisibleTicket] = useState(false);
  const [nameTicket, setNameTicket] = useState("");
  const [cccdTicket, setCccdTicket] = useState("");
  const [birthdayTicket, setBirthdayTicket] = useState("");
  const [genderTicket, setGenderTicket] = useState("");
  const [addressTicket, setAddressTicket] = useState("");
  const [phoneTicket, setPhoneTicket] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [visibleIdentificationCard, setVisibleIdentificationCard] = useState(false);
  const [method, setMethod] = useState("");
  const [content, setContent] = useState("");
  const [formCreateTicket] = Form.useForm();
  
  const [edittingOutpatient, setEdittingOutpatient] = useState(false);
  const [edittingInpatient, setEdittingInpatient] = useState(false);
  const [edittingUpdate, setEdittingUpdate] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  const columnsMedicals = [
    {
      title: 'STT',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageMedical * 10,
    },
    {
      title: 'ID bệnh án',
      dataIndex: 'Id',
      key: 'Id',
      sorter: (a, b) => a.Id.localeCompare(b.Id),
      sortDirections: ['ascend', 'descend'],
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
      title: 'Lí do khám',
      dataIndex: 'Reason',
      key: 'Reason',
      sorter: (a, b) => a.Reason.localeCompare(b.Reason),
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
          <Button type="link" className="reup" onClick={() => handleReadUpdate(medical)}>
            Xem
          </Button>
          <Button type="link" className="locked" disabled={medical.Locked} onClick={() => handleConfirmLocked(medical.Id)}>
            Lưu kho
          </Button>
          {medical.Mark === 'YES' ? (
            <Button type="link" className="mark text-green-500" onClick={() => handleMark(medical.Id)}>
              Đã đánh sao
            </Button>
          ) : (
            <Button type="link" className="mark text-red-500" onClick={() => handleMark(medical.Id)}>
              Chưa đánh sao
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const columnsRecordsMedical = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageRecord * 10,
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
      title: 'CCCD',
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
          <Button type="link" className="outpatient" onClick={() => handleSelectRecord(record)}>
            Chọn hồ sơ
          </Button>
        </Space>
      ),
    },
  ];

  const columnsRecordsTicket = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + pageRecord * 10,
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
      title: 'CCCD',
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
          <Button type="link" className="outpatient" onClick={() => handleSelectTicket(record)}>
            Chọn hồ sơ
          </Button>
        </Space>
      ),
    },
  ];

  const fetchMedical = useCallback(async () => {
    try {
      setLoading(true);
      const markSearch = searchMarkMedical || ""
      let response = await axios.get(getMedicalNurDoc(searchKeywordMedical, markSearch, searchIdRecord ,pageMedical, show), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItemsMedical(response.data.Data.TotalItems);
        setDataMedical(response.data.Data.Medicals);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    } finally {
      setLoading(false);
    }
  }, [searchKeywordMedical, searchMarkMedical, searchIdRecord, pageMedical, show]);

  useEffect(() => {
      fetchMedical();
  }, [fetchMedical]);

  const fetchRecord = useCallback(async () => {
    try {
      setLoading2(true);
      const genderSearch = searchGenderRecord || "";
      let response = await axios.get(getRecordNurDoc(genderSearch, searchKeywordRecord, searchYearRecord, pageRecord), {
        withCredentials: true
      });
      if (response.status === 200) {
        message.success(response.data.Message)
        setTotalItemsRecord(response.data.Data.TotalItems);
        setDataRecord(response.data.Data.Records);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    } finally {
      setLoading2(false);
    }
  },[searchKeywordRecord, searchGenderRecord, searchYearRecord, pageRecord]);

  useEffect(() => {
      fetchRecord();
  }, [fetchRecord]);

  useEffect(() => {
    const fetchDepartment = async () => {
        try {
          let response = await axios.get(getDepartmentNurDoc, {
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
    fetchDepartment();
  },[])  

  const handleSearchMedical = () => {
    setSearchKeywordMedical(keywordMedical);
    setSearchMarkMedical(markMedical);
    setSearchIdRecord(idRecord);
    setPageMedical("0");
  }

  const handleChangPageMedical = (page) => {
    setPageMedical(page-1);
  }

  const handleSearchRecord = () => {
    setSearchKeywordRecord(keywordRecord);
    setSearchGenderRecord(genderRecord);
    setSearchYearRecord(yearRecord);
    setPageRecord("0");
  };

  const handleReadRecordMedical = () => {
    setVisibleReadRecordMedical(true);
  }

  const handleCancelReadRecordMedical = () => {
    setVisibleReadRecordMedical(false);
    setKeywordRecord("");
    setGenderRecord(null);
    setYearRecord("");
    setSearchKeywordRecord("");
    setSearchGenderRecord("");
    setSearchYearRecord("");
    setPageRecord("0");
  }

  const handleSelectRecord = (record) => {
    setName(record.FullName);
    setIdRecord(record.Id);
    setVisibleReadRecordMedical(false);
    setKeywordRecord("");
    setGenderRecord(null);
    setYearRecord("");
    setSearchKeywordRecord("");
    setSearchGenderRecord("");
    setSearchYearRecord("");
    setPageRecord("0");
  }

  const handleSelectTicket = (record) => {
    setNameTicket(record.FullName);
    setCccdTicket(record.IdentityCard);
    setBirthdayTicket(record.DateOfBirth);
    setGenderTicket(record.Gender);
    setAddressTicket(record.Address);
    setPhoneTicket(record.NumberPhone);
    setVisibleIdentificationCard(true);
    setKeywordRecord("");
    setGenderRecord(null);
    setYearRecord("");
    setSearchKeywordRecord("");
    setSearchGenderRecord("");
    setSearchYearRecord("");
    setPageRecord("0");
  }
  
  const handleCancelTicket = () => {
    setVisibleTicket(false);
    setKeywordRecord("");
    setGenderRecord(null);
    setYearRecord("");
    setSearchKeywordRecord("");
    setSearchGenderRecord("");
    setSearchYearRecord("");
    setPageRecord("0");
  }

  const handleClearRecordMedical = () => {
    setName("");
    setIdRecord("");
  }

  const handleChangPageRecord = (page) => {
    setPageRecord(page-1);
  }

  const handleMark = async(id) => {
    try {
      let response = await axios.get(getMark(id), {
        withCredentials: true
      });
      if (response.status === 200) {
        message.success(response.data.Message);
        fetchMedical();
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  } 

  const handleConfirmLocked = (id) => {
    setIdLocked(id);
    setVisibleLocked(true);
  }

  const handleCancelLocked = () => {
    setIdLocked("");
    setVisibleLocked(false);
  }

  const handleLockedMedical = async() => {
    try {
      let response = await axios.get(lockedMedical(idLocked), {
        withCredentials: true
      });
      if (response.status === 200) {
        message.success(response.data.Message);
        setVisibleLocked(false);
        setIdLocked("");
        fetchMedical();
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  }

  const handleReadUpdate = (medical) => {
    console.log(medical);
    setEdittingUpdate(medical.Locked);
    if (medical.Type === "INPATIENT") {
      setVisibleReUpInpatient(true);
      formUpdateInpatient.setFieldsValue({
        Id: medical.Id,
        Reason: medical.Reason,
        PathologicalProcess: medical.PathologicalProcess,
        MedicalHistory: medical.MedicalHistory,
        HeartRate: medical.Biosignal.HeartRate,
        Temperature: medical.Biosignal.Temperature,
        BloodPressure: medical.Biosignal.BloodPressure,
        RespiratoryRate: medical.Biosignal.RespiratoryRate,
        Weight: medical.Biosignal.Weight,
        ExamineOrgans: medical.ExamineOrgans,
        TreatmentMethod: medical.TreatmentMethod,
        Result: medical.Result,
        SpecializedExamination: medical.SpecializedExamination,
        Prognosis: medical.Prognosis,
        DaysTreatment: medical.DaysTreatment,
        DiagnosisDischarge: medical.DiagnosisDischarge,
        Locked: medical.Locked,
        CreateDate: medical.CreateDate,
        SaveDate: medical.SaveDate, 
        DueDate: medical.DueDate,
        Mark: medical.Mark,
        Type: medical. Type,
        Summary: medical.Summary,
        DateAdmission: medical.DateAdmission ? moment(medical.DateAdmission, "HH:mm DD/MM/YYYY") : null,
        DepartmentAdmission: medical.DepartmentAdmission,
        DiagnosisAdmission: medical.DiagnosisAdmission,
        DateTransfer:  medical.DateTransfer ? moment(medical.DateTransfer, "HH:mm DD/MM/YYYY") : null,
        DepartmentTransfer: medical.DepartmentTransfer,
        DiagnosisTransfer: medical.DiagnosisTransfer,
        DoctorIdTreatment: medical.DoctorIdTreatment,
        DoctorNameTreatment: medical.DoctorNameTreatment,
        RecordId: medical.RecordId,
        PatientName: medical.PatientName,
        DiagnosisImage: medical.DiagnosisImage,
      });
    } else if (medical.Type === "OUTPATIENT") {
      setVisibleReUpOutpatient(true);
      console.log(medical.CreateDate);
      console.log(medical.Date);
      formUpdateOutpatient.setFieldsValue({
        Id: medical.Id,
        Reason: medical.Reason,
        PathologicalProcess: medical.PathologicalProcess,
        MedicalHistory: medical.MedicalHistory,
        HeartRate: medical.Biosignal.HeartRate,
        Temperature: medical.Biosignal.Temperature,
        BloodPressure: medical.Biosignal.BloodPressure,
        RespiratoryRate: medical.Biosignal.RespiratoryRate,
        Weight: medical.Biosignal.Weight,
        ExamineOrgans: medical.ExamineOrgans,
        TreatmentMethod: medical.TreatmentMethod,
        Result: medical.Result,
        InitialDiagnosis: medical.InitialDiagnosis,
        DiagnosisDischarge: medical.DiagnosisDischarge,
        Locked: medical.Locked,
        CreateDate: medical.CreateDate,
        SaveDate: medical.SaveDate, 
        DueDate: medical.DueDate,
        Mark: medical.Mark,
        Type: medical. Type,
        Summary: medical.Summary,
        DepartmentId: medical.DepartmentId,
        Date: moment(medical.Date, "HH:mm DD/MM/YYYY"),
        DoctorIdTreatment: medical.DoctorIdTreatment,
        DoctorNameTreatment: medical.DoctorNameTreatment,
        RecordId: medical.RecordId,
        PatientName: medical.PatientName,
        DiagnosisImage: medical.DiagnosisImage,
      });
    }
  }

  const handleCancelReupOutpatient = () => {
    formUpdateOutpatient.resetFields();
    setVisibleReUpOutpatient(false);
    setEdittingOutpatient(false);
    setCollapsed(false);
    setActiveKeys([]);
  }

  const handleOpenFormOutpatient = () => {
    setEdittingUpdate(true);
    setEdittingOutpatient(true);
    setCollapsed(true);
    setActiveKeys(['1', '2', '3']);
  }

  const handleCancelReupInpatient = () => {
    formUpdateInpatient.resetFields();
    setVisibleReUpInpatient(false);
    setEdittingInpatient(false);
    setCollapsed(false);
    setActiveKeys([]);
  }

  const handleOpenFormInpatient = () => {
    setEdittingUpdate(true);
    setEdittingInpatient(true);
    setCollapsed(true);
    setActiveKeys(['1', '2', '3', '4', '5']);
  }

  const handleUpdateOutpatient = async(values) => {
    const {
      Id,
      Reason, 
      PathologicalProcess, 
      MedicalHistory, 
      HeartRate, 
      Temperature, 
      BloodPressure, 
      RespiratoryRate, 
      Weight, 
      Summary,
      DiagnosisDischarge,
      Locked,
      CreateDate,
      Mark,
      Type,
      Date, 
      InitialDiagnosis,
      ExamineOrgans,
      TreatmentMethod,
      Result,
      RecordId,
    } = values;
    const data = {
      Id,
      Reason,
      PathologicalProcess,
      MedicalHistory,
      Biosignal: {
        HeartRate,
        Temperature,
        BloodPressure,
        RespiratoryRate,
        Weight
      },
      Summary,
      DiagnosisDischarge,
      Locked,
      CreateDate,
      Mark,
      Type,
      Date: Date.format("HH:mm DD/MM/YYYY"),
      InitialDiagnosis,
      RecordId,
      ExamineOrgans,
      TreatmentMethod,
      Result
    };
    
    try {
      const response = await axios.put(updateMedical, data, { withCredentials: true });
      if (response.status === 200) {
        fetchMedical();
        message.success(response.data.Message);
        setVisibleReUpOutpatient(false);
        setEdittingOutpatient(false);
        formUpdateOutpatient.resetFields();
      }
    } catch (error) {
      message.error(error.response.data.Message);
    }
  }

  const handleUpdateInpatient = async(values) => {
    console.log(values);
    const {
      Id,
      Reason, 
      PathologicalProcess, 
      MedicalHistory, 
      HeartRate, 
      Temperature, 
      BloodPressure, 
      RespiratoryRate, 
      Weight, 
      Summary,
      DiagnosisDischarge,
      Locked,
      CreateDate,
      Mark,
      Type,
      DateAdmission,
      DepartmentAdmission,
      DiagnosisAdmission,
      DateTransfer,
      DepartmentTransfer,
      DiagnosisTransfer,
      Prognosis,
      RecordId,
      ExamineOrgans,
      TreatmentMethod,
      Result,
      SpecializedExamination,
      DateDischarge
    } = values;
    const data = {
      Id,
      Reason,
      PathologicalProcess,
      MedicalHistory,
      Biosignal: {
        HeartRate,
        Temperature,
        BloodPressure,
        RespiratoryRate,
        Weight
      },
      Summary,
      DiagnosisDischarge,
      Locked,
      CreateDate,
      Mark,
      Type,
      DateAdmission: DateAdmission ? DateAdmission.format("HH:mm DD/MM/YYYY") : "",
      DepartmentAdmission,
      DiagnosisAdmission,
      DateTransfer: DateTransfer ? DateTransfer.format("HH:mm DD/MM/YYYY") : "",
      DepartmentTransfer,
      DiagnosisTransfer,
      Prognosis,
      RecordId,
      ExamineOrgans,
      TreatmentMethod,
      Result,
      SpecializedExamination,
      DateDischarge: DateDischarge ? DateDischarge.format("HH:mm DD/MM/YYYY") : "",
    };
    
    try {
      const response = await axios.put(updateMedical, data, { withCredentials: true });
      if (response.status === 200) {
        fetchMedical();
        message.success(response.data.Message);
        setVisibleReUpInpatient(false);
        setEdittingInpatient(false);
        formUpdateInpatient.resetFields();
      }
    } catch (error) {
      message.error(error.response.data.Message);
    }
  }

  const handleCreateTicket = () => {
    setVisibleTicket(true);

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    setCurrentDay(`${day}/${month}/${year}`);
  }

  const handleCancelCard = () => {
    setVisibleIdentificationCard(false);
    formCreateTicket.resetFields();
    setMethod("");
    setContent("");
  }

  const handleCreateCard = () => {
    const ticketTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Phiếu Chỉ Định Khám Bệnh</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  box-sizing: border-box;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #000;
                  border-radius: 5px;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .header p {
                  text-align: center;
                  margin-top: 10px;
                  font-size: 16px;
                  font-weight: bold;
                  text-transform: uppercase;
              }
              .header p span {
                  font-weight: normal;
                  text-transform: lowercase;
              } 
              .section {
                  margin-bottom: 20px;
              }
              .section h2 {
                  margin: 0;
                  margin-bottom: 10px;
                  font-size: 20px;
                  text-decoration: underline;
              }
              .section p {
                  margin: 5px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
              }
              .footer p {
                  margin: 0;
                  font-size: 16px;
              }
              .field {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
              }
              .field label {
                  width: 30%;
                  font-weight: bold;
              }
              .field div {
                  width: 70%;
              }
              .signature {
                  margin-top: 50px;
                  margin-bottom: 70px;
                  text-align: right;
              }
              .signature p {
                  margin: 5px 0;
                  font-size: 14px;
                  padding-right: 20px;
              }
              .signature .doctor {
                  text-transform: uppercase;
                  font-size: 17px;
                  font-weight: bold;
                  padding-right: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>PHIẾU CHỈ ĐỊNH KHÁM BỆNH</h1>
                  <img src="${logo}" alt="Logo" style="height: 30px;">
                  BỆNH VIỆN X
                  <p>Ngày lập phiếu: <span>${currentDay}</span></p>
              </div>
              <div class="section">
                  <h2>Thông Tin Bệnh Nhân</h2>
                  <div class="field">
                      <label>Họ và Tên:</label>
                      <div id="patient_name">${nameTicket}</div>
                  </div>
                  <div class="field">
                      <label>CCCD:</label>
                      <div id="patient_cccd">${cccdTicket}</div>
                  </div>
                  <div class="field">
                      <label>Ngày Sinh:</label>
                      <div id="patient_dob">${birthdayTicket}</div>
                  </div>
                  <div class="field">
                      <label>Giới Tính:</label>
                      <div id="patient_gender">${genderTicket}</div>
                  </div>
                  <div class="field">
                      <label>Địa Chỉ:</label>
                      <div id="patient_address">${addressTicket}</div>
                  </div>
                  <div class="field">
                      <label>Số Điện Thoại:</label>
                      <div id="patient_phone">${phoneTicket}</div>
                  </div>
              </div>

              <div class="section">
                  <h2>Phương Pháp Chẩn Đoán Hình Ảnh</h2>
                  <div class="field">
                      <label>Nội dung:</label>
                      <div id="xray_instructions">${content}</div>
                  </div>
                  <div class="field">
                      <label>Phương pháp:</label>
                      <div id="ultrasound_instructions">${method}</div>
                  </div>
              </div>

              <div class="footer">
                  <div class="signature">
                      <p class="doctor">Bác sĩ chỉ định</p>
                      <p>(Ký, ghi rõ họ tên)</p>
                  </div>
              </div>
          </div>
          <script>
            window.onload = function() {
                window.print();
            }
          </script>
      </body>
      </html>
    `;
    const newWindow = window.open(`${nameTicket}`, '_blank');
    newWindow.document.write(ticketTemplate);
    newWindow.document.close();
  }
  
  const handleSetShow = () => {
    if (show) {
      setShow(false);
      setButtonShow("Tất cả bệnh án");
    } else {
      setShow(true);
      setButtonShow("Bệnh án của bác sĩ");
    } 
  }

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
      <Input
        className="w-60 mt-3 mr-3"
        placeholder="Tìm theo lý do khám, chẩn đoán"
        value={keywordMedical}
        onChange={(e) => setKeywordMedical(e.target.value)}
      />
      <Select
        className="w-60 mt-3 mr-3"
        placeholder="Trạng thái hồ sơ"
        onChange={(value) => setMarkMedical(value)}
        allowClear
      >
        <Select.Option value="YES">Có đánh sao</Select.Option>
        <Select.Option value="NO">Không đánh sao</Select.Option>
      </Select>
      <Input
        className="w-60 mt-3 mr-3"
        placeholder="Họ tên bệnh nhân"
        disabled={true}
        value={name}
      />
      <Button onClick={() => handleClearRecordMedical()} className="bg-red-600 text-white" htmlType="submit">Clear</Button>
      <Button onClick={() => handleReadRecordMedical()} className="bg-blue-700 text-white" htmlType="submit">Chọn hồ sơ</Button>
      <br/>
      <Button onClick={() => handleSearchMedical()} className="bg-blue-700 text-white mt-4" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
      <Button onClick={() => handleSetShow()} className="bg-green-500 text-white mt-4 ml-3" htmlType="submit" icon={<FunnelPlotOutlined />} >{buttonShow}</Button>
      <br/>
      <Button onClick={() => handleCreateTicket()} className="bg-cyan-500 text-white mt-4" htmlType="submit" icon={<PlusOutlined />} >Tạo phiếu chỉ định</Button>
      <Table 
        columns={columnsMedicals} 
        dataSource={dataMedical}
        loading={{ indicator: <Loading/>, spinning: loading }}
        pagination={{
          total: totalItemsMedical,
          pageSize: 10,
          current: pageMedical + 1,
          onChange: handleChangPageMedical,
        }}
      />
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem và cập nhật hồ sơ ngoại trú</h1>}
        visible={visibleReUpOutpatient}
        onCancel={handleCancelReupOutpatient}
        footer={[
          <Button key="custom" disabled={edittingUpdate} className="bg-green-500 text-white" onClick={handleOpenFormOutpatient}>
              Cập nhật
          </Button>,
          <Button key="submit" disabled={!edittingOutpatient} className="bg-blue-700" onClick={() => formUpdateOutpatient.submit()}>
            Lưu
          </Button>,
          <Button key="cancel" className="bg-red-600" onClick={handleCancelReupOutpatient}>
              Thoát
          </Button>
        ]}
        width={800}
      >
        <Form 
          {...formLayout} 
          form={formUpdateOutpatient} 
          onFinish={handleUpdateOutpatient} 
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              formUpdateOutpatient.submit();
            }
          }}
        >
          <Collapse className="w-full" activeKey={edittingOutpatient ? activeKeys : collapsed ? ['1'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin chung" key="1">
              <Form.Item name="Id" label="Id bệnh án" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="Reason" label="Lý do khám" rules={[{ required: true, message: 'Vui lòng lý do khám' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="PathologicalProcess" label="Quá trình bệnh lý" rules={[{ required: true, message: 'Vui lòng quá trình bệnh lý' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="MedicalHistory" label="Tiền sử bệnh" rules={[{ required: true, message: 'Vui lòng nhập tiền sử bệnh' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="InitialDiagnosis" label="Chẩn đoán ban đầu" rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán ban đầu' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="ExamineOrgans" label="Kết quả khám các cơ quan" className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="DiagnosisDischarge" label="Chẩn đoán ra viện" className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="TreatmentMethod" label="Phương pháp điều trị" className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="Result" label="Kết quả điều trị" className="w-full">
                <Select placeholder="Chọn kết quả" disabled={!edittingOutpatient}>
                  <Select.Option value="CURED">Khỏi bệnh</Select.Option>
                  <Select.Option value="RELIEVED">Giảm bớt</Select.Option>
                  <Select.Option value="UNCHANGED">Không đổi</Select.Option>
                  <Select.Option value="WORSENED">Nặng hơn</Select.Option>
                  <Select.Option value="DEATH">Tử vong</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="DepartmentId" label="Khoa khám" className="w-full">
                <Select placeholder="Chọn khoa" disabled={!edittingOutpatient}>
                  {listDepartment.map(department => (
                    <Select.Option key={department.id} value={department.id}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="Date" label="Thời gian đến khám" rules={[{ required: true, message: 'Vui lòng chọn thời gian đến khám' }]} className="w-full">
                <DatePicker disabled={!edittingOutpatient} className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>   
              <Form.Item name="CreateDate" label="Ngày tạo bệnh án" className="w-full">
                <Input className="w-full" disabled={true}/>
              </Form.Item>
              <Form.Item name="SaveDate" label="Ngày lưu trữ" className="w-full">
                <Input className="w-full" disabled={true}/>
              </Form.Item>
              <Form.Item name="DueDate" label="Ngày thanh lý" className="w-full">
                <Input className="w-full" disabled={true}/>
              </Form.Item>  
              <Form.Item name="Locked" label="Lưu kho" className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value={false}>Chưa lưu</Select.Option>
                  <Select.Option value={true}>Đã lưu</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Mark" label="Đánh dấu sao" className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value="NO">Không</Select.Option>
                  <Select.Option value="YES">Có</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Type" label="Loại bệnh án" className="w-full">
                <Select placeholder="Chọn trạng thái" disabled = {true}>
                  <Select.Option value="OUTPATIENT">Ngoại trú</Select.Option>
                  <Select.Option value="INPATIENT">Nội trú</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="DoctorIdTreatment" label="ID Bác sĩ điều trị" className="w-full" hidden={true}>
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="DoctorNameTreatment" label="Bác sĩ điều trị" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="RecordId" label="Id bệnh nhân" className="w-full" hidden={true}>
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="PatientName" label="Bệnh nhân" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
            </Panel>
          </Collapse> 
          <Collapse className="w-full" activeKey={edittingOutpatient ? activeKeys : collapsed ? ['2'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin hình ảnh" key="2">
              {formUpdateOutpatient.getFieldValue('DiagnosisImage')?.length > 0 ? (
                <>
                  {formUpdateOutpatient.getFieldValue('DiagnosisImage').map((image, index) => (
                    <div key={index} className="mb-4">
                      <Form.Item name={['DiagnosisImage', index, 'UrlImage']} label={`Hình ảnh ${index + 1}`} className="w-full">
                        <img src={image.UrlImage} alt={`Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Method']} label="Phương pháp" className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Content']} label="Nội dung" className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Conclude']} label="Kết luận" className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'DoctorIdPerform']} label="ID Bác sĩ thực hiện" className="w-full" hidden={true}>
                        <Input disabled={true} />
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'DoctorNamePerform']} label="Bác sĩ thực hiện" className="w-full">
                        <Input disabled={true} />
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item name="Summary" label="Kết luận cuối cùng" className="w-full">
                    <Input disabled={!edittingOutpatient}/>
                  </Form.Item>
                </>
              ) : (
                <p>Không có thông tin hình ảnh</p>
              )}
            </Panel>
          </Collapse>
          <Collapse className="w-full" activeKey={edittingOutpatient ? activeKeys : collapsed ? ['3'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin sinh hiệu" key="3">
              <Form.Item name="HeartRate" label="Mạch đập (nhịp/phút)" rules={[{ required: true, message: 'Vui lòng nhập mạch đập' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="Temperature" label="Nhiệt độ (°C)" rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="BloodPressure" label="Huyết áp (mmHg)" rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="RespiratoryRate" label="Nhịp thở (lần/phút)" rules={[{ required: true, message: 'Vui lòng nhập nhịp thở' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
              <Form.Item name="Weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]} className="w-full">
                <Input disabled={!edittingOutpatient}/>
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xem và cập nhật hồ sơ nội trú</h1>}
        visible={visibleReUpInpatient}
        onCancel={handleCancelReupInpatient}
        footer={[
          <Button key="custom" disabled={edittingUpdate} className="bg-green-500 text-white" onClick={handleOpenFormInpatient}>
              Cập nhật
          </Button>,
          <Button key="submit" disabled={!edittingInpatient} className="bg-blue-700" onClick={() => formUpdateInpatient.submit()}>
            Lưu
          </Button>,
          <Button key="cancel" className="bg-red-600" onClick={handleCancelReupInpatient}>
              Thoát
          </Button>
        ]}
        width={850}
      >
        <Form 
          {...formLayout} 
          form={formUpdateInpatient} 
          onFinish={handleUpdateInpatient} 
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              formUpdateInpatient.submit();
            }
          }}
        >
          <Collapse className="w-full" activeKey={edittingInpatient ? activeKeys : collapsed ? ['1'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin chung" key="1">
              <Form.Item name="Id" label="Id bệnh án" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="Reason" label="Lý do khám" rules={[{ required: true, message: 'Vui lòng lý do khám' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="PathologicalProcess" label="Quá trình bệnh lý" rules={[{ required: true, message: 'Vui lòng quá trình bệnh lý' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="MedicalHistory" label="Tiền sử bệnh" rules={[{ required: true, message: 'Vui lòng nhập tiền sử bệnh' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="TreatmentMethod" label="Phương pháp điều trị" className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="ExamineOrgans" label="Kết quả khám các cơ quan" className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="SpecializedExamination" label="Kết quả khám chuyên khoa" className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="Prognosis" label="Tiên lượng" rules={[{ required: true, message: 'Vui lòng nhập tiên lượng' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="DiagnosisDischarge" label="Chẩn đoán ra viện" className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="DateDischarge" label="Ngày ra viện" className="w-full">
                <DatePicker disabled={!edittingInpatient} placeholder="Chọn ngày ra viện" className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>
              <Form.Item name="DaysTreatment" label="Thời gian ra viện" className="w-full">
                <InputNumber disabled={true}/>
              </Form.Item>
              <Form.Item name="Result" label="Kết quả điều trị" className="w-full">
                <Select disabled={!edittingInpatient}>
                  <Select.Option value="CURED">Khỏi bệnh</Select.Option>
                  <Select.Option value="RELIEVED">Giảm bớt</Select.Option>
                  <Select.Option value="UNCHANGED">Không đổi</Select.Option>
                  <Select.Option value="WORSENED">Nặng hơn</Select.Option>
                  <Select.Option value="DEATH">Tử vong</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="CreateDate" label="Ngày tạo bệnh án" className="w-full">
                <Input className="w-full" disabled={true}/>
              </Form.Item>
              <Form.Item name="SaveDate" label="Ngày lưu trữ" className="w-full">
                <Input className="w-full" disabled={true}/>
              </Form.Item>
              <Form.Item name="DueDate" label="Ngày thanh lý" className="w-full">
                <Input className="w-full" disabled={true}/>
              </Form.Item>  
              <Form.Item name="Locked" label="Lưu kho" className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value={false}>Chưa lưu</Select.Option>
                  <Select.Option value={true}>Đã lưu</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Mark" label="Đánh dấu sao" className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value="NO">Không</Select.Option>
                  <Select.Option value="YES">Có</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Type" label="Loại bệnh án" className="w-full">
                <Select placeholder="Chọn trạng thái" disabled = {true}>
                  <Select.Option value="OUTPATIENT">Ngoại trú</Select.Option>
                  <Select.Option value="INPATIENT">Nội trú</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="DoctorIdTreatment" label="Id Bác sĩ điều trị" className="w-full" hidden={true}>
                <Input disabled={true}/>
              </Form.Item>              
              <Form.Item name="DoctorNameTreatment" label="Bác sĩ điều trị" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="RecordId" label="Id bệnh nhân" className="w-full" hidden={true}>
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="PatientName" label="Bệnh nhân" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
            </Panel>
          </Collapse> 
          <Collapse className="w-full" activeKey={edittingInpatient ? activeKeys : collapsed ? ['2'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin nhập viện" key="2">
              <Form.Item name="DateAdmission" label="Thời gian" rules={[{ required: true, message: 'Vui lòng chọn ngày nhập viện' }]} className="w-full">
                <DatePicker disabled={!edittingInpatient} placeholder="Chọn ngày nhập viện" className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>  
              <Form.Item name="DepartmentAdmission" label="Khoa" rules={[{ required: true, message: 'Vui lòng chọn khoa' }]} className="w-full">
                <Select placeholder="Chọn khoa" disabled={!edittingInpatient}>
                  {listDepartment.map(department => (
                    <Select.Option key={department.id} value={department.id}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="DiagnosisAdmission" label="Chẩn đoán" rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
            </Panel>
          </Collapse>
          <Collapse className="w-full" activeKey={edittingInpatient ? activeKeys : collapsed ? ['3'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin chuyển khoa" key="3">
              <Form.Item name="DateTransfer" label="Thời gian" className="w-full">
                <DatePicker disabled={!edittingInpatient} placeholder="Chọn ngày chuyển khoa" className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>  
              <Form.Item name="DepartmentTransfer" label="Khoa" className="w-full">
              <Select placeholder="Chọn khoa" disabled={!edittingInpatient}>
                  {listDepartment.map(department => (
                    <Select.Option key={department.id} value={department.id}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="DiagnosisTransfer" label="Chẩn đoán" className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
            </Panel>
          </Collapse>
          <Collapse className="w-full" activeKey={edittingInpatient ? activeKeys : collapsed ? ['4'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin hình ảnh" key="4">
              {formUpdateInpatient.getFieldValue('DiagnosisImage')?.length > 0 ? (
                <>
                  {formUpdateInpatient.getFieldValue('DiagnosisImage').map((image, index) => (
                    <div key={index} className="mb-4">
                      <Form.Item name={['DiagnosisImage', index, 'UrlImage']} label={`Hình ảnh ${index + 1}`} className="w-full">
                        <img src={image.UrlImage} alt={`Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Method']} label="Phương pháp" className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Content']} label="Nội dung" className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Conclude']} label="Kết luận" className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'DoctorIdPerform']} label="ID Bác sĩ thực hiện" className="w-full" hidden={true}>
                        <Input disabled={true} />
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'DoctorNamePerform']} label="Bác sĩ thực hiện" className="w-full">
                        <Input disabled={true} />
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item name="Summary" label="Kết luận cuối cùng" className="w-full">
                    <Input disabled={!edittingInpatient}/>
                  </Form.Item>
                </>
              ) : (
                <p>Không có thông tin hình ảnh</p>
              )}
            </Panel>
          </Collapse>
          <Collapse className="w-full" activeKey={edittingInpatient ? activeKeys : collapsed ? ['5'] : undefined} onChange={(keys) => setActiveKeys(keys)}>
            <Panel header="Thông tin sinh hiệu" key="5">
              <Form.Item name="HeartRate" label="Mạch đập (nhịp/phút)" rules={[{ required: true, message: 'Vui lòng nhập mạch đập' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="Temperature" label="Nhiệt độ (°C)" rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="BloodPressure" label="Huyết áp (mmHg)" rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="RespiratoryRate" label="Nhịp thở (lần/phút)" rules={[{ required: true, message: 'Vui lòng nhập nhịp thở' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
              <Form.Item name="Weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]} className="w-full">
                <Input disabled={!edittingInpatient}/>
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tìm kiếm hồ sơ bệnh nhân</h1>}
        visible={visibleReadRecordMedical}
        onCancel={handleCancelReadRecordMedical}
        cancelText="Thoát"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={900}
      >
        <Select
        className="w-48 mt-3 mr-3"
        placeholder="Tìm theo giới tính"
        value={genderRecord}
        onChange={(value) => setGenderRecord(value)}
        allowClear
        >
          <Select.Option value="Nam">Nam</Select.Option>
          <Select.Option value="Nữ">Nữ</Select.Option>
          <Select.Option value="Khác">Khác</Select.Option>
        </Select>
        <Input
          className="w-48 mt-3 mr-3"
          placeholder="Tìm theo tên"
          value={keywordRecord}
          onChange={(e) => setKeywordRecord(e.target.value)}
        />
        <DatePicker
          className="w-48 mt-3 mr-3"
          placeholder="Tìm theo năm sinh"
          picker="year"
          onChange={(date, dateString) => setYearRecord(dateString)}
        />
        <Button onClick={() => handleSearchRecord()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
        <Table 
          columns={columnsRecordsMedical} 
          dataSource={dataRecord}
          loading={{ indicator: <Loading/>, spinning: loading2 }}
          pagination={{
            total: totalItemsRecord,
            pageSize: 10,
            current: pageRecord + 1,
            onChange: handleChangPageRecord,
          }}
        />
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Chọn hồ sơ bệnh nhân</h1>}
        visible={visibleTicket}
        onCancel={handleCancelTicket}
        cancelText="Thoát"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={900}
      >
        <Select
        className="w-48 mt-3 mr-3"
        placeholder="Tìm theo giới tính"
        value={genderRecord}
        onChange={(value) => setGenderRecord(value)}
        allowClear
        >
          <Select.Option value="Nam">Nam</Select.Option>
          <Select.Option value="Nữ">Nữ</Select.Option>
          <Select.Option value="Khác">Khác</Select.Option>
        </Select>
        <Input
          className="w-48 mt-3 mr-3"
          placeholder="Tìm theo tên"
          value={keywordRecord}
          onChange={(e) => setKeywordRecord(e.target.value)}
        />
        <DatePicker
          className="w-48 mt-3 mr-3"
          placeholder="Tìm theo năm sinh"
          picker="year"
          onChange={(date, dateString) => setYearRecord(dateString)}
        />
        <Button onClick={() => handleSearchRecord()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
        <Table 
          columns={columnsRecordsTicket} 
          dataSource={dataRecord}
          loading={{ indicator: <Loading/>, spinning: loading2 }}
          pagination={{
            total: totalItemsRecord,
            pageSize: 10,
            current: pageRecord + 1,
            onChange: handleChangPageRecord,
          }}
        />
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xác nhận lưu kho</h1>}
        visible={visibleLocked}
        onOk={() => handleLockedMedical()}
        okText="Xác nhận"
        onCancel={handleCancelLocked}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4 text-[17px]">Bạn có chắc chắn muốn lưu kho bệnh án này không?</p>
        </div>
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tạo phiếu chỉ định</h1>}
        visible={visibleIdentificationCard}
        onOk={() => formCreateTicket.submit()}
        okText="In phiếu"
        onCancel={handleCancelCard}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form 
          {...formLayout} 
          form={formCreateTicket}
          onFinish={handleCreateCard}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              formCreateTicket.submit();
            }
          }}
        >
          <Form.Item className="relative" name="content" label="Nôi dung" rules={[{ required: true, message: 'Nội dung không được để trống!' }]}>
              <Input
                type="text"
                placeholder="Nhập nội dung"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
          </Form.Item>
          <Form.Item className="relative" name="method" label="Phương pháp" rules={[{ required: true, message: 'Phương pháp không được để trống!' }]}>
              <Input 
                type="text"
                placeholder="Nhập phương pháp"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MedicalManagementByDoctor
