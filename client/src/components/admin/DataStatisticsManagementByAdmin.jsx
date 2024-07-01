import { useState, useEffect } from "react"
import { getDataStatistics } from "../../Api";
import moment from "moment";
import axios from "axios";
import { message, DatePicker, Button, Spin, Modal, Form} from "antd";
import {SearchOutlined, SaveOutlined} from "@ant-design/icons"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUser,  FaFileAlt, FaFileMedical } from 'react-icons/fa';
import { IoTicket } from "react-icons/io5";
import { VscNewFile } from "react-icons/vsc";
import { BsFileEarmarkLock } from "react-icons/bs";
import { LuFileX } from "react-icons/lu";
import ExportToExcel from "../../hook/ExportToExcel";

const DataStatisticsManagementByAdmin = () => {

  const [totalAccount, setTotalAccount] = useState(0);
  const [statisticalAccount, setStatisticalAccount] = useState([]);
  const [totalTicket, setTotalTicket] = useState(0);
  const [statisticalTicket, setStatisticalTicket] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [statisticalRecord, setStatisticalRecord] = useState([]);
  const [totalMedical, setTotalMedical] = useState(0);
  const [newMedical, setNewMedical] = useState(0);
  const [lockedMedical, setLockedMedical] = useState(0);
  const [expiredMedical, setExpiredMedical] = useState(0);
  const [statisticalMedical, setStatisticalMedical] = useState([]);

  const [dateStartAccount, setDateStartAccount] = useState("");
  const [dateEndAccount, setDateEndAccount] = useState("");
  const [searchDateStartAccount, setSearchDateStartAccount] = useState("");
  const [searchDateEndAccount, setSearchDataEndAccount] = useState("");
  const [dateStartTicket, setDateStartTicket] = useState("");
  const [dateEndTicket, setDateEndTicket] = useState("");
  const [searchDateStartTicket, setSearchDateStartTicket] = useState("");
  const [searchDateEndTicket, setSearchDataEndTicket] = useState("");
  const [dateStartRecord, setDateStartRecord] = useState("");
  const [dateEndRecord, setDateEndRecord] = useState("");
  const [searchDateStartRecord, setSearchDateStartRecord] = useState("");
  const [searchDateEndRecord, setSearchDataEndRecord] = useState("");
  const [dateStartMedical, setDateStartMedical] = useState("");
  const [dateEndMedical, setDateEndMedical] = useState("");
  const [searchDateStartMedical, setSearchDateStartMedical] = useState("");
  const [searchDateEndMedical, setSearchDataEndMedical] = useState("");
  const [dateStartExport, setDateStartExport] = useState("");
  const [dateEndExport, setDateEndExport] = useState("");
  const [visibleExport, setVisibleExport] = useState(false);
  const [formExport] = Form.useForm();

  const [dayupdated, setDayUpdated] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCount = async() => {
      try{
        let dateStart = moment("01/01/2024", "DD/MM/YYYY").format("DD/MM/YYYY");
        let dateEnd = moment("31/12/2024", "DD/MM/YYYY").format("DD/MM/YYYY");
        let response = await axios.post(getDataStatistics, {
          StartDate: dateStart,
          EndDate: dateEnd,
        },{
          withCredentials: true
        })
        if (response.status === 200) {
          setTotalAccount(response.data.Data.Account.Total);
          setTotalTicket(response.data.Data.Ticket.Total);
          setTotalRecord(response.data.Data.Record.Total);
          setTotalMedical(response.data.Data.Medical.Total);
          setNewMedical(response.data.Data.Medical.New);
          setLockedMedical(response.data.Data.Medical.Locked);
          setExpiredMedical(response.data.Data.Medical.Expired);

          const endDate = moment();
          let dateEnd = endDate.format("HH:mm DD/MM/YYYY");
          setDayUpdated(dateEnd);
        }
      } catch(error) {
        message.error(error.response.data.Message)
      }
    }
    fetchCount();
  },[])

  useEffect(() => {
    const fetchDataStatisticsAccount = async() => {
      if (searchDateStartAccount && searchDateEndAccount) {
        try {
          setLoading(true);
          let datestart = moment(searchDateStartAccount).format("DD/MM/YYYY");
          let dateend = moment(searchDateEndAccount).format("DD/MM/YYYY");
          let response = await axios.post(getDataStatistics, {
            StartDate: datestart,
            EndDate: dateend,
          },{
            withCredentials: true
          })
          if (response.status === 200) {
            message.success(response.data.Message);
            setStatisticalAccount(response.data.Data.Account.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }  finally {
          setLoading(false);
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setStatisticalAccount(dataFake);
        setLoading(false);
      }
    }
    fetchDataStatisticsAccount();
  },[searchDateStartAccount, searchDateEndAccount])

  useEffect(() => {
    const fetchDataStatisticsTicket = async() => {
      if (searchDateStartTicket && searchDateEndTicket) {
        try {
          setLoading(true);
          let datestart = moment(searchDateStartTicket).format("DD/MM/YYYY");
          let dateend = moment(searchDateEndTicket).format("DD/MM/YYYY");
          let response = await axios.post(getDataStatistics, {
            StartDate: datestart,
            EndDate: dateend,
          },{
            withCredentials: true
          })
          if (response.status === 200) {
            message.success(response.data.Message);
            setStatisticalTicket(response.data.Data.Ticket.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        } finally {
          setLoading(false);
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setStatisticalTicket(dataFake);
        setLoading(false);
      }
    }
    fetchDataStatisticsTicket();
  },[searchDateStartTicket, searchDateEndTicket])

  useEffect(() => {
    const fetchDataStatisticsRecord = async() => {
      if (searchDateStartRecord && searchDateEndRecord) {
        try {
          setLoading(true);
          let datestart = moment(searchDateStartRecord).format("DD/MM/YYYY");
          let dateend = moment(searchDateEndRecord).format("DD/MM/YYYY");
          let response = await axios.post(getDataStatistics, {
            StartDate: datestart,
            EndDate: dateend,
          },{
            withCredentials: true
          })
          if (response.status === 200) {
            message.success(response.data.Message);    
            setStatisticalRecord(response.data.Data.Record.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        } finally {
          setLoading(false);
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setStatisticalRecord(dataFake);
        setLoading(false)
      }
    }
    fetchDataStatisticsRecord();
  },[searchDateStartRecord, searchDateEndRecord])

  useEffect(() => {
    const fetchDataStatisticsMedical = async() => {
      if (searchDateStartMedical && searchDateEndMedical) {
        try {
          setLoading(true);
          let datestart = moment(searchDateStartMedical).format("DD/MM/YYYY");
          let dateend = moment(searchDateEndMedical).format("DD/MM/YYYY");
          let response = await axios.post(getDataStatistics, {
            StartDate: datestart,
            EndDate: dateend,
          },{
            withCredentials: true
          })
          if (response.status === 200) {
            message.success(response.data.Message);
            setStatisticalMedical(response.data.Data.Medical.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        } finally {
          setLoading(false)
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setStatisticalMedical(dataFake);
        setLoading(false);
      }
    }
    fetchDataStatisticsMedical();
  },[searchDateStartMedical, searchDateEndMedical])

  const handleExportExcel = async() => {
    try {
      let datestart = moment(dateStartExport).format("DD/MM/YYYY");
      let dateend = moment(dateEndExport).format("DD/MM/YYYY");
      let response = await axios.post(getDataStatistics, {
        StartDate: datestart,
        EndDate: dateend,
      },{
        withCredentials: true
      })
      if (response.status === 200) {
        message.success("Xuất file excel thành công");
        console.log(response.data.Data);
        ExportToExcel({ data: response.data.Data });
      }
    } catch(error) {
      message.error(error.response.data.Message)
    }
  }
  

  const handleSearchAccount = () => {
    setSearchDateStartAccount(dateStartAccount);
    setSearchDataEndAccount(dateEndAccount);
  }

  const handleSearchTicket = () => {
    setSearchDateStartTicket(dateStartTicket);
    setSearchDataEndTicket(dateEndTicket);
  }

  const handleSearchRecord = () => {
    setSearchDateStartRecord(dateStartRecord);
    setSearchDataEndRecord(dateEndRecord);
  }

  const handleSearchMedical = () => {
    setSearchDateStartMedical(dateStartMedical);
    setSearchDataEndMedical(dateEndMedical);
  }

  const handleExport = () => {
    setVisibleExport(true);
  }

  const handleCancelExport = () => {
    setVisibleExport(false);
    setDateStartExport("");
    setDateEndExport("");
    formExport.resetFields();
  }

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => handleExport()} className="bg-teal-500 text-white mb-5" htmlType="submit" icon={<SaveOutlined />} >Xuất dữ liệu ra file excel</Button>
      <h1 className="text-2xl font-bold mb-4 text-darkmagenta">Hồ sơ bệnh án</h1>
      <div className="flex flex-wrap justify-between">
        <div className="w-1/4">
          <div className="flex items-center mt-6 mb-5 bg-darkmagenta p-4 rounded w-auto mr-2">
            <FaFileMedical className="text-2xl mr-2 text-white" />
            <div className="flex flex-col">
              <h2 className="text-xs font-medium text-white">Tổng số bệnh án: <span className="font-bold">{totalMedical}</span></h2>
              <p className="text-[10px] text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex items-center mt-6 mb-5 bg-amber-600 p-4 rounded w-auto mr-2">
            <VscNewFile className="text-2xl mr-2 text-white" />
            <div className="flex flex-col">
              <h2 className="text-xs font-medium text-white">Số bệnh án mới: <span className="font-bold">{newMedical}</span></h2>
              <p className="text-[10px] text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex items-center mt-6 mb-5 bg-emerald-600 p-4 rounded w-auto mr-2">
            <BsFileEarmarkLock className="text-2xl mr-2 text-white" />
            <div className="flex flex-col">
              <h2 className="text-xs font-medium text-white">Số bệnh án đã lưu kho: <span className="font-bold">{lockedMedical}</span></h2>
              <p className="text-[10px] text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex items-center mt-6 mb-5 bg-rose-600 p-4 rounded w-auto">
            <LuFileX className="text-2xl mr-2 text-white" />
            <div className="flex flex-col">
              <h2 className="text-xs font-medium text-white">Số bệnh án cần thanh lý: <span className="font-bold">{expiredMedical}</span></h2>
              <p className="text-[10px] text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-4">
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày bắt đầu"
          value={dateStartMedical ? moment(dateStartMedical, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateStartMedical(dateString)}
        />
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày kết thúc"
          value={dateEndMedical ? moment(dateEndMedical, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateEndMedical(dateString)}
        />
        <Button onClick={() => handleSearchMedical()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={loading ? <Spin /> : <SearchOutlined />} disabled={loading}>
          {loading ? 'Loading...' : 'Tra cứu'}
        </Button>
      </div>
      <ResponsiveContainer className="mt-6" width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={statisticalMedical}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" name="Ngày"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Count" name="Số lượng" fill="#8B008B" />
        </BarChart>
      </ResponsiveContainer>

      <hr className="my-8 border-gray-300"/>

      <h1 className="text-2xl font-bold mb-4 text-limegreen">Tài khoản</h1>
      <div className="flex items-center mt-6 mb-5 bg-limegreen p-4 rounded w-72">
        <FaUser className="text-4xl mr-4 text-white" />
        <div className="flex flex-col">
          <h2 className="text-base font-medium text-white">Số lượng tài khoản: <span className="font-bold">{totalAccount}</span></h2>
          <p className="text-xs text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-4">
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày bắt đầu"
          value={dateStartAccount ? moment(dateStartAccount, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateStartAccount(dateString)}
        />
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày kết thúc"
          value={dateEndAccount ? moment(dateEndAccount, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateEndAccount(dateString)}
        />
        <Button onClick={() => handleSearchAccount()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={loading ? <Spin /> : <SearchOutlined />} disabled={loading}>
          {loading ? 'Loading...' : 'Tra cứu'}
        </Button>
      </div>
      <ResponsiveContainer className="mt-6" width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={statisticalAccount}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" name="Ngày"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Count" name="Số lượng" fill="#32CD32" />
        </BarChart>
      </ResponsiveContainer>

      <hr className="my-8 border-gray-300"/>

      <h1 className="text-2xl font-bold mb-4 text-blue2">Phiếu khám</h1>
      <div className="flex items-center mt-6 mb-5 bg-blue2 p-4 rounded w-72">
        <IoTicket className="text-4xl mr-4 text-white" />
        <div className="flex flex-col">
          <h2 className="text-base font-medium text-white">Số lượng phiếu khám: <span className="font-bold">{totalTicket}</span></h2>
          <p className="text-xs text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-4">
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày bắt đầu"
          value={dateStartTicket ? moment(dateStartTicket, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateStartTicket(dateString)}
        />
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày kết thúc"
          value={dateEndTicket ? moment(dateEndTicket, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateEndTicket(dateString)}
        />
        <Button onClick={() => handleSearchTicket()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={loading ? <Spin /> : <SearchOutlined />} disabled={loading}>
          {loading ? 'Loading...' : 'Tra cứu'}
        </Button>
      </div>
      <ResponsiveContainer className="mt-6" width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={statisticalTicket}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" name="Ngày"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Count" name="Số lượng" fill="#0000FF" />
        </BarChart>
      </ResponsiveContainer>

      <hr className="my-8 border-gray-300"/>
      
      <h1 className="text-2xl font-bold mb-4 text-chocolate">Hồ sơ bệnh nhân</h1>
      <div className="flex items-center mt-6 mb-5 bg-chocolate p-4 rounded w-72">
        <FaFileAlt className="text-4xl mr-4 text-white" />
        <div className="flex flex-col">
          <h2 className="text-base font-medium text-white">Số lượng hồ sơ: <span className="font-bold">{totalRecord}</span></h2>
          <p className="text-xs text-white">Cập nhật: <span className="font-medium">{dayupdated}</span></p>
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-4">
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày bắt đầu"
          value={dateStartRecord ? moment(dateStartRecord, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateStartRecord(dateString)}
        />
        <DatePicker
          className="w-60 mr-3 mb-2"
          placeholder="Chọn ngày kết thúc"
          value={dateEndRecord ? moment(dateEndRecord, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setDateEndRecord(dateString)}
        />
        <Button onClick={() => handleSearchRecord()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={loading ? <Spin /> : <SearchOutlined />} disabled={loading}>
          {loading ? 'Loading...' : 'Tra cứu'}
        </Button>
      </div>
      <ResponsiveContainer className="mt-6" width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={statisticalRecord}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" name="Ngày"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Count" name="Số lượng" fill="#D2691E" />
        </BarChart>
      </ResponsiveContainer>
      <Modal 
        title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Xuất file excel</h1>}
        visible={visibleExport}
        onOk={() => formExport.submit()}
        okText="Xuất file"
        onCancel={handleCancelExport}
        cancelText="Thoát"
        okButtonProps={{ className: "bg-blue-700" }}
        cancelButtonProps={{ className: "bg-red-600" }}
      >
        <Form 
          {...formLayout} 
          form={formExport} 
          onFinish={handleExportExcel}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              formExport.submit();
            }
          }}
        >
          <Form.Item name="exportstart" label="Ngày bắt đầu" rules={[{ required: true, message: 'Ngày bắt đầu không được để trống!' }]}>
            <DatePicker
              className="w-full"
              placeholder="Chọn ngày bắt đầu"
              value={dateStartExport ? moment(dateStartExport, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => setDateStartExport(dateString)}
            />
          </Form.Item>
          <Form.Item name="exportend" label="Ngày kết thúc" rules={[{ required: true, message: 'Ngày kết thúc không được để trống!' }]}>
              <DatePicker 
                className="w-full"
                placeholder="Chọn ngày kết thúc"
                value={dateEndExport ? moment(dateEndExport, 'YYYY-MM-DD') : null}
                onChange={(date, dateString) => setDateEndExport(dateString)}
              />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DataStatisticsManagementByAdmin
