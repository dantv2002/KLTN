import { useState, useEffect, useCallback } from 'react';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import { Upload, Button, message, Modal, Form, Input, Table, Select, Space, DatePicker } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { deleteImage, diagnosticByDoctor, getMedicalNurDoc, getRecordNurDoc, saveDiagnostic } from '../../Api';
import moment from 'moment';
import Loading from '../../hook/Loading';

const DiagnosisManagementByDoctor = () => {
  const [image, setImage] = useState("");
  const [publicId, setPublicId] = useState("");
  const [result, setResult] = useState([]);
  const [idMedical, setIdMedical] = useState("");
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [formInsert] = Form.useForm();
  const [visibleReadMedical, setVisibleReadMedical] = useState(false);
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
  const [visibleReadRecordMedical, setVisibleReadRecordMedical] = useState(false);
  const [keywordRecord, setKeywordRecord] = useState("");
  const [genderRecord, setGenderRecord] = useState("");
  const [yearRecord, setYearRecord] = useState("");
  const [searchKeywordRecord, setSearchKeywordRecord] = useState("");
  const [searchGenderRecord, setSearchGenderRecord] = useState("");
  const [searchYearRecord, setSearchYearRecord] = useState("");
  const [dataRecordMedical, setDataRecordMedical] = useState("0");
  const [pageRecordMedical, setPageRecordMedical] = useState("0");
  const [totalItemsRecordMedical, setTotalItemsRecordMedical] = useState("0");
  const [visibleUserManual, setVisibleUserManual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  const handleImageUpload = (info) => {
    setIsLoading(true);
    if (info.file.status === 'done') {
      console.log('Upload success:', info.file.response);
      setImage(info.file.response.secure_url);
      setPublicId(info.file.response.public_id);
      message.success("Tải ảnh lên thành công")
    } else if (info.file.status === 'error') {
      console.error('Upload error:', info.file.error);
      message.error("Tải ảnh lên thất bại")
    }
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleImageRemove = async() => {
    try {
      let response = await axios.delete(deleteImage(publicId),{
        withCredentials: true,
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setImage("");
        setPublicId("");
      }
    }catch(error){
      message.error(error.response.data.Message);
    }
  }

  const handleDiagnostic = async() => {
    try{
      setEventLoading(true);
      let response = await axios.post(diagnosticByDoctor, {
        Image: image
      }, {
          withCredentials: true
      })
      if (response.status === 200){
        message.success(response.data.Message);
        setResult(response.data.Data);
      }
    }catch(error){
        message.error(error.response.data.Message);
    } finally {
      setEventLoading(false);
    }
  }

  const fetchMedical = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false)
    }
  }, [searchKeywordMedical, searchMarkMedical, searchIdRecord, pageMedical]);

  const fetchRecord = useCallback(async () => {
    try {
      setLoading(true);
      const genderSearch = searchGenderRecord || "";
      let response = await axios.get(getRecordNurDoc(genderSearch, searchKeywordRecord, searchYearRecord, pageRecordMedical), {
        withCredentials: true
      });
      if (response.status === 200) {
        setTotalItemsRecordMedical(response.data.Data.TotalItems);
        setDataRecordMedical(response.data.Data.Records);
      }
    } catch(error) {
      message.error(error.response.data.Message);
    } finally {
      setLoading(false);
    }
  },[searchKeywordRecord, searchGenderRecord, searchYearRecord, pageRecordMedical]);

  useEffect(() => {
    fetchMedical();
    fetchRecord()
}, [fetchMedical, fetchRecord]);

  const handleSave = () => {
    setVisibleInsert(true);
  }

  const handleCancelInsert = () => {
    setVisibleInsert(false);
  }

  const handleSaveDiagnostic = async(values) => {
    const { 
      Method,
      Content,
      Conclude
      } = values;
    const data = {
      Method: Method,
      Content: Content,
      UrlImage: image,
      Conclude: Conclude,
      MedicalId: idMedical,
    }

    try {
      const response = await axios.post(saveDiagnostic, data, { withCredentials: true });
      if (response.status === 200) {
        message.success(response.data.Message);
        setVisibleInsert(false);
        fetchMedical();
      }
    } catch (error) {
      message.error(error.response.data.Message);
    }
  }

  const handleReadMedical = () => {
    setVisibleReadMedical(true);
  }

  const handleCancelReadMedical = () => {
    setVisibleReadMedical(false);
    setKeywordMedical("");
    setMarkMedical("");
    setIdRecord("");
    setSearchKeywordMedical("");
    setSearchMarkMedical("");
    setSearchIdRecord("");
    setName("");
    setPageMedical("0");
  }

  const handleClearRecordMedical = () => {
    setName("");
    setIdRecord("");
  }

  const handleReadRecordMedical = () => {
    setVisibleReadRecordMedical(true);
  }

  const handleSearchMedical = () => {
    setSearchKeywordMedical(keywordMedical);
    setSearchMarkMedical(markMedical);
    setSearchIdRecord(idRecord);
    setPageMedical("0");
  }

  const handleChangPageMedical = (page) => {
    setPageMedical(page-1);
  }

  const handleSelectMedical = (medical) => {
    setIdMedical(medical.Id);
    setVisibleReadMedical(false);
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
    setPageRecordMedical("0");
  }

  const handleCancelReadRecordMedical = () => {
    setVisibleReadRecordMedical(false);
    setKeywordRecord("");
    setGenderRecord("");
    setYearRecord("");
    setSearchKeywordRecord("");
    setSearchGenderRecord("");
    setSearchYearRecord("");
    setPageRecordMedical("0");
  }

  const handleSearchRecordMedical = () => {
    setSearchKeywordRecord(keywordRecord);
    setSearchGenderRecord(genderRecord);
    setSearchYearRecord(yearRecord);
    setPageRecordMedical("0");
  };

  const handleChangPageRecordMedical = (page) => {
    setPageRecordMedical(page-1);
  }

  const handleCancelUserManual = () => {
    setVisibleUserManual(false);
  }

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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="w-full md:w-64 p-2">
          <DatePicker
            placeholder="Chọn thời gian khám"
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
        const date = moment(record.Date, 'DD/MM/YYYY');
        const filterValue = moment(value, 'DD/MM/YYYY');
        return date.isSame(filterValue, 'day');
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
      title: 'Đánh dấu sao',
      dataIndex: 'Mark',
      key: 'Mark',
      render: (text) => {
        if (text === 'YES') return 'Có';
        if (text === 'NO') return 'Không';
        return text;
      },
      sorter: (a, b) => {
        const textA = a.Mark === 'YES' ? 'Có' : (a.Mark === 'NO' ? 'Không' : a.Mark);
        const textB = b.Mark === 'YES' ? 'Có' : (b.Mark === 'NO' ? 'Không' : b.Mark);
        return textA.localeCompare(textB);
      },
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
          <Button type="link" className="reup" onClick={() => handleSelectMedical(medical)}>
            Chọn bệnh án
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
      render: (_, __, index) => index + 1 + pageRecordMedical * 10,
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
          <Button type="link" className="outpatient" onClick={() => handleSelectRecord(record)}>
            Chọn hồ sơ
          </Button>
        </Space>
      ),
    },
  ];

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3">
          <div className="w-full">
            <Upload
              className="mt-3 mb-3"
              name="file"
              action="https://api.cloudinary.com/v1_1/successntd/image/upload"
              data={{ upload_preset: 'projectemr', cloud_name: 'successntd' }}
              listType="picture"
              onChange={handleImageUpload}
              onRemove={handleImageRemove}
            >
              <Button className="mt-3 mb-3" icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            {image && (
              <div className="mt-3 mb-3">
                <h2 className="mt-3 mb-3 text-xl text-blue-700 font-semibold">Hình ảnh được tải lên:</h2>
                {isLoading ? (
                  <Loading/>
                ) : (
                  <div>
                    <CloudinaryContext cloudName="successntd">
                      <Image publicId={publicId}>
                        <Transformation width="500" crop="scale" />
                      </Image>
                    </CloudinaryContext>
                    <Button className="mt-3 mb-3 bg-green-600 text-white" onClick={handleDiagnostic}>
                      Chẩn đoán
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <h1 className="mt-3 mb-3 text-2xl font-semibold text-red-600">Kết quả:</h1>
          {eventLoading ? (
            <Loading/>
          ) : (
            <div>
              <ul>
              {result.length > 0 && Object.keys(result[0])
                .sort((a, b) => result[0][b] - result[0][a])
                .map((disease) => (
                  <li key={disease} className="mb-2">
                    <span className="font-normal text-black">Bệnh {disease}:</span>{' '}
                    <span className="font-bold text-blue-500">
                      {result[0][disease].toFixed(2)}%
                    </span>
                  </li>
              ))}
              </ul>
              {result.length > 0 && (
                <Button className="mt-3 mb-3" onClick={() => handleSave()}>
                  Lưu chẩn đoán
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Lưu kết quả chẩn đoán</h1>}
        visible={visibleInsert}
        onOk={() => formInsert.submit()}
        okText="Lưu"
        onCancel={handleCancelInsert}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form {...formLayout} form={formInsert} onFinish={handleSaveDiagnostic} className="space-y-4">
          <Form.Item name="UrlImage" label="Hình ảnh" className="w-full">
            <img src={image} alt="Image" style={{ width: '100%', height: 'auto' }} />
          </Form.Item>
          <Form.Item name="Method" label="Phương pháp" rules={[{ required: true, message: 'Vui lòng nhập phương pháp' }]} className="w-full">
            <Input />
          </Form.Item>
          <Form.Item name="Content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]} className="w-full">
            <Input />
          </Form.Item>
          <Form.Item name="Conclude" label="Chẩn đoán" rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]} className="w-full">
            <Input />
          </Form.Item>
          <Form.Item name="MedicalId" label="Id bệnh án" rules={[{ required: true, message: 'Vui lòng chọn id bệnh án' }]} className="w-full">
            <Input disabled={true} value={idMedical}/>
            <Button className='mt-2 bg-cyan-400' onClick={() => handleReadMedical()}>
              Chọn bệnh án
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tìm bệnh án</h1>}
        visible={visibleReadMedical}
        onCancel={handleCancelReadMedical}
        cancelText="Thoát"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={900}
      >
        <Input
          className="w-52 mt-3 mr-3"
          placeholder="Tìm theo chẩn đoán"
          value={keywordMedical}
          onChange={(e) => setKeywordMedical(e.target.value)}
        />
        <Select
          className="w-52 mt-3 mr-3"
          placeholder="Trạng thái hồ sơ"
          onChange={(value) => setMarkMedical(value)}
          allowClear
        >
          <Select.Option value="YES">Có</Select.Option>
          <Select.Option value="NO">Không</Select.Option>
        </Select>
        <Input
          className="w-52 mt-3 mr-3"
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
          loading={{ indicator: <Loading/>, spinning: loading }}
          pagination={{
            total: totalItemsMedical,
            pageSize: 10,
            current: pageMedical + 1,
            onChange: handleChangPageMedical,
          }}
        />
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Tìm hồ sơ</h1>}
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
        <Button onClick={() => handleSearchRecordMedical()} className="bg-blue-700 text-white" htmlType="submit" icon={<SearchOutlined />} >Tìm kiếm</Button>
        <Table 
          columns={columnsRecordsMedical} 
          dataSource={dataRecordMedical}
          loading={{ indicator: <Loading/>, spinning: loading }}
          pagination={{
            total: totalItemsRecordMedical,
            pageSize: 10,
            current: pageRecordMedical + 1,
            onChange: handleChangPageRecordMedical,
          }}
        />
      </Modal>
      <Modal
        title={<h1 className="text-2xl font-bold text-green-500 text-center mb-4">Hướng dẫn sử dụng</h1>}
        visible={visibleUserManual}
        onCancel={handleCancelUserManual}
        cancelText="Thoát"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ className: "bg-red-600" }}
        width={900}
      >
        <div>
          <p><b>Bước 1:</b> Bấm nút tải ảnh lên và chọn ảnh từ máy</p>
          <p><b>Bước 2:</b> Sau khi tải ảnh lên ảnh sẽ được hiển thị và xuất hiện nút chẩn đoán</p>
          <p><b>Bước 3:</b> Bấm nút chẩn đoán và đợi hệ thống phản hồi, kết quả sẽ hiển thị phía bên phải</p>
          <p><b>Bước 4:</b> Kết quả sau khi trả về sẽ xuất hiện thêm nút lưu kết quả</p>
          <p><b>Bước 5</b> Bấm nút lưu kết quả sẽ hiện ra giao diện để nhập thông tin về hình ảnh</p>
          <p><b>Bước 6</b> Chọn hồ sơ bệnh án và điền đầy đủ thông tin sau đó bấm lưu</p>
        </div>
      </Modal>
    </div>
  );
}

export default DiagnosisManagementByDoctor;
