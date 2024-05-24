import { useState, useEffect } from "react"
import { getDataStatistics } from "../../Api";
import moment from "moment";
import axios from "axios";
import { message, DatePicker, Button } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  useEffect(() => {
    const fetchDataStatisticsAccount = async() => {
      if (searchDateStartAccount && searchDateEndAccount) {
        try {
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
            setTotalAccount(response.data.Data.Account.Total);
            setStatisticalAccount(response.data.Data.Account.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setTotalAccount(0);
        setStatisticalAccount(dataFake);
      }
    }
    fetchDataStatisticsAccount();
  },[searchDateStartAccount, searchDateEndAccount])

  useEffect(() => {
    const fetchDataStatisticsTicket = async() => {
      if (searchDateStartTicket && searchDateEndTicket) {
        try {
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
            setTotalTicket(response.data.Data.Ticket.Total);
            setStatisticalTicket(response.data.Data.Ticket.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setTotalTicket(0);
        setStatisticalTicket(dataFake);
      }
    }
    fetchDataStatisticsTicket();
  },[searchDateStartTicket, searchDateEndTicket])

  useEffect(() => {
    const fetchDataStatisticsRecord = async() => {
      if (searchDateStartRecord && searchDateEndRecord) {
        try {
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
            setTotalRecord(response.data.Data.Record.Total);
            setStatisticalRecord(response.data.Data.Record.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setTotalRecord(0);
        setStatisticalRecord(dataFake);
      }
    }
    fetchDataStatisticsRecord();
  },[searchDateStartRecord, searchDateEndRecord])

  useEffect(() => {
    const fetchDataStatisticsMedical = async() => {
      if (searchDateStartMedical && searchDateEndMedical) {
        try {
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
            setTotalMedical(response.data.Data.Medical.Total);
            setNewMedical(response.data.Data.Medical.New);
            setLockedMedical(response.data.Data.Medical.Locked);
            setExpiredMedical(response.data.Data.Medical.Expired);
            setStatisticalMedical(response.data.Data.Medical.Statistical);
          }
        } catch(error) {
          message.error(error.response.data.Message)
        }
      } else {
        const dataFake = [
          {
            Count: 0,
            Date: "0",
          }
        ];
        setTotalMedical(0);
        setNewMedical(0);
        setLockedMedical(0);
        setExpiredMedical(0);
        setStatisticalMedical(dataFake);
      }
    }
    fetchDataStatisticsMedical();
  },[searchDateStartMedical, searchDateEndMedical])

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-limegreen">Tài khoản</h1>
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
        <Button onClick={() => handleSearchAccount()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={<SearchOutlined />}>Tra cứu</Button>
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
      <h2 className="text-xl font-semibold mt-4">Số lượng tài khoản: {totalAccount}</h2>

      <hr className="my-8 border-gray-300"/>

      <h1 className="text-2xl font-bold mb-4 text-blue2">Phiếu khám</h1>
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
        <Button onClick={() => handleSearchTicket()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={<SearchOutlined />}>Tra cứu</Button>
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
      <h2 className="text-xl font-semibold mt-4">Số lượng phiếu khám: {totalTicket}</h2>

      <hr className="my-8 border-gray-300"/>
      
      <h1 className="text-2xl font-bold mb-4 text-chocolate">Hồ sơ bệnh nhân</h1>
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
        <Button onClick={() => handleSearchRecord()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={<SearchOutlined />}>Tra cứu</Button>
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
      <h2 className="text-xl font-semibold mt-4">Số lượng hồ sơ: {totalRecord}</h2>

      <hr className="my-8 border-gray-300"/>
      
      <h1 className="text-2xl font-bold mb-4 text-darkmagenta">Hồ sơ bệnh án</h1>
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
        <Button onClick={() => handleSearchMedical()} className="bg-blue-700 text-white mb-2" htmlType="submit" icon={<SearchOutlined />}>Tra cứu</Button>
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
      <h2 className="text-xl font-semibold mt-4">Tổng số lượng hồ sơ bệnh án: {totalMedical}</h2>
      <h2 className="text-xl font-semibold mt-4">Số lượng hồ sơ bệnh án mới: {newMedical}</h2>
      <h2 className="text-xl font-semibold mt-4">Số lượng hồ sơ bệnh án đã khóa: {lockedMedical}</h2>
      <h2 className="text-xl font-semibold mt-4">Số lượng hồ sơ bệnh án hết hạn: {expiredMedical}</h2>
    </div>
    
  );
}

export default DataStatisticsManagementByAdmin
