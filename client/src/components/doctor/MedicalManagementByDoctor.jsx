import axios from "axios";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import { message, Table, Input, Space, Button, Modal, Select, DatePicker, Form, Collapse, InputNumber } from "antd";
import { getMedicalNurDoc, getRecordNurDoc, getDepartmentNurDoc, getMark, updateMedical, lockedMedical } from "../../Api";
import { SearchOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const MedicalManagementByDoctor = () => {

  const [keywordMedical, setKeywordMedical] = useState("");
  const [searchKeywordMedical, setSearchKeywordMedical] = useState("");
  const [markMedical, setMarkMedical] = useState("");
  const [searchMarkMedical, setSearchMarkMedical] = useState("");
  const [idRecord, setIdRecord] = useState("");
  const [searchIdRecord, setSearchIdRecord] = useState("");
  const [dataMedical, setDataMedical] = useState([]);
  const [pageMedical, setPageMedical] = useState("0");
  const [totalItemsMedical, setTotalItemsMedical] = useState("0");
  const [name, setName] = useState("");
  const [keywordRecord, setKeywordRecord] = useState("");
  const [genderRecord, setGenderRecord] = useState("");
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

  const columnsMedicals = [
    {
      title: 'STT',
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
    },
    {
      title: 'Lưu kho',
      dataIndex: 'Locked',
      key: 'Locked',
      render: (text, record) => (record.Locked ? 'Đã lưu' : 'Chưa lưu'),
    },
    {
      title: 'Đánh dấu sao',
      dataIndex: 'Mark',
      key: 'Mark',
      render: (text) => {
        if (text === 'YES') return 'Có';
        if (text === 'NO') return 'Không';
        return text;
      }
    },
    {
      title: 'Kết quả xuất viện',
      dataIndex: 'DiagnosisDischarge',
      key: 'DiagnosisDischarge',
      render: (text) => text ? text : 'Chưa xuất viện',
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
          <Button type="link" className="reup" onClick={() => handleReadUpdate(medical)}>
            Xem
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
          <Button type="link" className="locked" disabled={medical.Locked} onClick={() => handleLockedMedical(medical.Id)}>
            Lưu kho
          </Button>
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
          <Button type="link" className="outpatient" onClick={() => handleSelectRecord(record)}>
            Chọn hồ sơ
          </Button>
        </Space>
      ),
    },
  ];

  const fetchMedical = useCallback(async () => {
    try {
      const markSearch = searchMarkMedical || ""
      let response = await axios.get(getMedicalNurDoc(searchKeywordMedical, markSearch, searchIdRecord ,pageMedical), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItemsMedical(response.data.Data.TotalItems);
        setDataMedical(response.data.Data.Medicals);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    }
  }, [searchKeywordMedical, searchMarkMedical, searchIdRecord, pageMedical]);

  useEffect(() => {
      fetchMedical();
  }, [fetchMedical]);

  const fetchRecord = useCallback(async () => {
    try {
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
    setGenderRecord("");
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
    setGenderRecord("");
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

  const handleLockedMedical = async(id) => {
    try {
      let response = await axios.get(lockedMedical(id), {
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

  const handleReadUpdate = (medical) => {
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
        DaysTreatment: parseInt(medical.DaysTreatment),
        DiagnosisDischarge: medical.DiagnosisDischarge,
        Locked: medical.Locked,
        CreateDate: medical.CreateDate,
        SaveDate: medical.SaveDate, 
        DueDate: medical.DueDate,
        Mark: medical.Mark,
        Type: medical. Type,
        Summary: medical.Summary,
        DateAdmission: moment(medical.DateAdmission, "HH:mm DD/MM/YYYY"),
        DepartmentAdmission: medical.DepartmentAdmission,
        DiagnosisAdmission: medical.DiagnosisAdmission,
        DateTransfer: moment(medical.DateTransfer, "HH:mm DD/MM/YYYY"),
        DepartmentTransfer: medical.DepartmentTransfer,
        DiagnosisTransfer: medical.DiagnosisTransfer,
        DoctorIdTreatment: medical.DoctorIdTreatment,
        RecordId: medical.RecordId,
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
        RecordId: medical.RecordId,
        DiagnosisImage: medical.DiagnosisImage,
      });
    }
  }

  const handleCancelReupOutpatient = () => {
    formUpdateOutpatient.resetFields();
    setVisibleReUpOutpatient(false);
  }

  const handleCancelReupInpatient = () => {
    formUpdateInpatient.resetFields();
    setVisibleReUpInpatient(false);
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
        message.success(response.data.Message);
        setVisibleReUpOutpatient(false);
        formUpdateOutpatient.resetFields();
        fetchMedical();
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
      DateAdmission: DateAdmission.format("HH:mm DD/MM/YYYY"),
      DepartmentAdmission,
      DiagnosisAdmission,
      DateTransfer: DateTransfer.format("HH:mm DD/MM/YYYY"),
      DepartmentTransfer,
      DiagnosisTransfer,
      Prognosis,
      RecordId,
      ExamineOrgans,
      TreatmentMethod,
      Result,
      SpecializedExamination,
      DateDischarge: DateDischarge.format("HH:mm DD/MM/YYYY"),
    };
    
    try {
      const response = await axios.put(updateMedical, data, { withCredentials: true });
      if (response.status === 200) {
        message.success(response.data.Message);
        setVisibleReUpInpatient(false);
        formUpdateInpatient.resetFields();
        fetchMedical();
      }
    } catch (error) {
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
        className="w-60 mt-3 mr-3"
        placeholder="Tìm theo chẩn đoán"
        value={keywordMedical}
        onChange={(e) => setKeywordMedical(e.target.value)}
      />
      <Select
        className="w-60 mt-3 mr-3"
        placeholder="Trạng thái hồ sơ"
        onChange={(value) => setMarkMedical(value)}
        allowClear
      >
        <Select.Option value="YES">Có</Select.Option>
        <Select.Option value="NO">Không</Select.Option>
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
      <Table 
        columns={columnsMedicals} 
        dataSource={dataMedical}
        pagination={{
          total: totalItemsMedical,
          pageSize: 10,
          current: pageMedical + 1,
          onChange: handleChangPageMedical,
        }}
      />
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Cập nhật hồ sơ ngoại trú</h1>}
        visible={visibleReUpOutpatient}
        onOk={() => formUpdateOutpatient.submit()}
        okText="Cập nhật"
        onCancel={handleCancelReupOutpatient}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={800}
      >
        <Form {...formLayout} form={formUpdateOutpatient} onFinish={handleUpdateOutpatient} className="space-y-4">
          <Collapse className="w-full">
            <Panel header="Thông tin chung" key="1">
              <Form.Item name="Id" label="Id bệnh án" rules={[{ required: true, message: 'Vui lòng nhập id bệnh án' }]} className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="Reason" label="Lý do khám" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="PathologicalProcess" label="Quá trình bệnh lý" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="MedicalHistory" label="Tiền sử bệnh" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="InitialDiagnosis" label="Chẩn đoán ban đầu" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="ExamineOrgans" label="Kết quả khám các cơ quan" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="DiagnosisDischarge" label="Chẩn đoán ra viện" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="TreatmentMethod" label="Phương pháp điều trị" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Result" label="Kết quả điều trị" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="DepartmentId" label="Khoa khám" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Date" label="Thời gian đến khám" rules={[{ required: true, message: 'Vui lòng chọn thời gian đến khám' }]} className="w-full">
                <DatePicker className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
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
              <Form.Item name="Locked" label="Lưu kho" rules={[{ required: true, message: 'Vui lòng chọn trạng thái lưu kho' }]} className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value={false}>Chưa lưu</Select.Option>
                  <Select.Option value={true}>Đã lưu</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Mark" label="Đánh dấu sao" rules={[{ required: true, message: 'Vui lòng chọn trạng thái đánh dấu sao' }]} className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value="NO">Không</Select.Option>
                  <Select.Option value="YES">Có</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Type" label="Loại bệnh án" rules={[{ required: true, message: 'Vui lòng chọn loại bệnh án' }]} className="w-full">
                <Select placeholder="Chọn trạng thái" disabled = {true}>
                  <Select.Option value="OUTPATIENT">Ngoại trú</Select.Option>
                  <Select.Option value="INPATIENT">Nội trú</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="DoctorIdTreatment" label="Bác sĩ điều trị" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="RecordId" label="Id bệnh nhân" rules={[{ required: true, message: 'Vui lòng nhập id bệnh nhân' }]} className="w-full">
                <Input disabled={true}/>
              </Form.Item>
            </Panel>
          </Collapse> 
          <Collapse className="w-full">
            <Panel header="Thông tin hình ảnh" key="2">
              {formUpdateOutpatient.getFieldValue('DiagnosisImage')?.length > 0 ? (
                <>
                  {formUpdateOutpatient.getFieldValue('DiagnosisImage').map((image, index) => (
                    <div key={index} className="mb-4">
                      <Form.Item name={['DiagnosisImage', index, 'UrlImage']} label={`Hình ảnh ${index + 1}`} className="w-full">
                        <img src={image.UrlImage} alt={`Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Method']} label="Phương pháp" rules={[{ required: true, message: 'Vui lòng nhập phương pháp' }]} className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Content']} label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]} className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Conclude']} label="Kết luận" rules={[{ required: true, message: 'Vui lòng nhập kết luận' }]} className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'DoctorIdPerform']} label="ID Bác sĩ thực hiện" rules={[{ required: true, message: 'Vui lòng nhập id bác sĩ thực hiện' }]} className="w-full">
                        <Input disabled={true} />
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item name="Summary" label="Kết luận cuối cùng" className="w-full">
                    <Input />
                  </Form.Item>
                </>
              ) : (
                <p>Không có thông tin hình ảnh</p>
              )}
            </Panel>
          </Collapse>
          <Collapse className="w-full">
            <Panel header="Thông tin sinh hiệu" key="3">
              <Form.Item name="HeartRate" label="Mạch đập" rules={[{ required: true, message: 'Vui lòng nhập mạch đập' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Temperature" label="Nhiệt độ" rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="BloodPressure" label="Huyết áp" rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="RespiratoryRate" label="Nhịp thở" rules={[{ required: true, message: 'Vui lòng nhập nhịp thở' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Weight" label="Cân nặng" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]} className="w-full">
                <Input />
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Cập nhật hồ sơ nội trú</h1>}
        visible={visibleReUpInpatient}
        onOk={() => formUpdateInpatient.submit()}
        okText="Cập nhật"
        onCancel={handleCancelReupInpatient}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={850}
      >
        <Form {...formLayout} form={formUpdateInpatient} onFinish={handleUpdateInpatient} className="space-y-4">
          <Collapse className="w-full">
            <Panel header="Thông tin chung" key="1">
              <Form.Item name="Id" label="Id bệnh án" rules={[{ required: true, message: 'Vui lòng nhập id bệnh án' }]} className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="Reason" label="Lý do khám" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="PathologicalProcess" label="Quá trình bệnh lý" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="MedicalHistory" label="Tiền sử bệnh" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="TreatmentMethod" label="Phương pháp điều trị" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="ExamineOrgans" label="Kết quả khám các cơ quan" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="SpecializedExamination" label="Kết quả khám chuyên khoa" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Prognosis" label="Tiên lượng" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="DiagnosisDischarge" label="Chẩn đoán ra viện" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="DateDischarge" label="Ngày ra viện" className="w-full">
                <DatePicker className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>
              <Form.Item name="DaysTreatment" label="Thời gian ra viện" className="w-full">
                <InputNumber disabled={true}/>
              </Form.Item>
              <Form.Item name="Result" label="Kết quả điều trị" className="w-full">
                <Input />
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
              <Form.Item name="Locked" label="Lưu kho" rules={[{ required: true, message: 'Vui lòng chọn trạng thái lưu kho' }]} className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value={false}>Chưa lưu</Select.Option>
                  <Select.Option value={true}>Đã lưu</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Mark" label="Đánh dấu sao" rules={[{ required: true, message: 'Vui lòng chọn trạng thái đánh dấu sao' }]} className="w-full">
                <Select placeholder="Chọn trạng thái" disabled={true}>
                  <Select.Option value="NO">Không</Select.Option>
                  <Select.Option value="YES">Có</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Type" label="Loại bệnh án" rules={[{ required: true, message: 'Vui lòng chọn loại bệnh án' }]} className="w-full">
                <Select placeholder="Chọn trạng thái" disabled = {true}>
                  <Select.Option value="OUTPATIENT">Ngoại trú</Select.Option>
                  <Select.Option value="INPATIENT">Nội trú</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="DoctorIdTreatment" label="Bác sĩ điều trị" className="w-full">
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item name="RecordId" label="Id bệnh nhân" rules={[{ required: true, message: 'Vui lòng nhập id bệnh nhân' }]} className="w-full">
                <Input disabled={true}/>
              </Form.Item>
            </Panel>
          </Collapse> 
          <Collapse className="w-full">
            <Panel header="Thông tin nhập viện" key="2">
              <Form.Item name="DateAdmission" label="Thời gian"  className="w-full">
                <DatePicker className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>  
              <Form.Item name="DepartmentAdmission" label="Khoa" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="DiagnosisAdmission" label="Chẩn đoán" className="w-full">
                <Input />
              </Form.Item>
            </Panel>
          </Collapse>
          <Collapse className="w-full">
            <Panel header="Thông tin chuyển khoa" key="3">
              <Form.Item name="DateTransfer" label="Thời gian" className="w-full">
                <DatePicker className="w-full" showTime format="HH:mm DD/MM/YYYY"/>
              </Form.Item>  
              <Form.Item name="DepartmentTransfer" label="Khoa" className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="DiagnosisTransfer" label="Chẩn đoán" className="w-full">
                <Input />
              </Form.Item>
            </Panel>
          </Collapse>
          <Collapse className="w-full">
            <Panel header="Thông tin hình ảnh" key="4">
              {formUpdateInpatient.getFieldValue('DiagnosisImage')?.length > 0 ? (
                <>
                  {formUpdateInpatient.getFieldValue('DiagnosisImage').map((image, index) => (
                    <div key={index} className="mb-4">
                      <Form.Item name={['DiagnosisImage', index, 'UrlImage']} label={`Hình ảnh ${index + 1}`} className="w-full">
                        <img src={image.UrlImage} alt={`Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Method']} label="Phương pháp" rules={[{ required: true, message: 'Vui lòng nhập phương pháp' }]} className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Content']} label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]} className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'Conclude']} label="Kết luận" rules={[{ required: true, message: 'Vui lòng nhập kết luận' }]} className="w-full">
                        <Input disabled={true}/>
                      </Form.Item>
                      <Form.Item name={['DiagnosisImage', index, 'DoctorIdPerform']} label="ID Bác sĩ thực hiện" rules={[{ required: true, message: 'Vui lòng nhập id bác sĩ thực hiện' }]} className="w-full">
                        <Input disabled={true} />
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item name="Summary" label="Kết luận cuối cùng" className="w-full">
                    <Input />
                  </Form.Item>
                </>
              ) : (
                <p>Không có thông tin hình ảnh</p>
              )}
            </Panel>
          </Collapse>
          <Collapse className="w-full">
            <Panel header="Thông tin sinh hiệu" key="5">
              <Form.Item name="HeartRate" label="Mạch đập" rules={[{ required: true, message: 'Vui lòng nhập mạch đập' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Temperature" label="Nhiệt độ" rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="BloodPressure" label="Huyết áp" rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="RespiratoryRate" label="Nhịp thở" rules={[{ required: true, message: 'Vui lòng nhập nhịp thở' }]} className="w-full">
                <Input />
              </Form.Item>
              <Form.Item name="Weight" label="Cân nặng" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]} className="w-full">
                <Input />
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
          pagination={{
            total: totalItemsRecord,
            pageSize: 10,
            current: pageRecord + 1,
            onChange: handleChangPageRecord,
          }}
        />
      </Modal>
    </div>
  )
}

export default MedicalManagementByDoctor