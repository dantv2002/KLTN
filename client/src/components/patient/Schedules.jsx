import axios from "axios";
import { getTicket } from "../../Api";
import { useState, useEffect, useCallback } from "react";
import { message, Button, Space, Select, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons"

const Schedules = () => {

  const [status, setStatus] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState("0");
  const [totalItems, setTotalItems] = useState("0");


  const fetchTicket = useCallback(async() => {
    try {
      const statusSearch = searchStatus || "";
      let response = await axios.get(getTicket(statusSearch, page), {
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
  },[searchStatus, page]);

  const openConfirmationReceipt = (ticket) => {
    const confirmationReceipt = `
    <!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org">
    
    <head>
        <meta charset="UTF-8" />
        <title th:inline="text"> Xác nhận Phiếu Khám Bệnh: ${ticket.Id}</title>
    </head>
    
    <body>
        <div style="font: small/1.5 Arial, Helvetica, sans-serif; overflow: hidden">
            <table style="
              border-collapse: collapse;
              table-layout: fixed;
              border-spacing: 0;
              vertical-align: top;
              min-width: 320px;
              margin: 0 auto;
              background-color: #ffffff;
              width: 100%;
            " cellpadding="0" cellspacing="0">
                <tbody>
                    <tr style="vertical-align: top">
                        <td style="
                    word-break: break-word;
                    border-collapse: collapse !important;
                    vertical-align: top;
                  ">
                            <div style="background-color: transparent">
                                <div style="
                        margin: 0 auto;
                        min-width: 320px;
                        max-width: 500px;
                        word-wrap: break-word;
                        word-break: break-word;
                        background-color: transparent;
                      ">
                                    <div style="
                          border-collapse: collapse;
                          display: table;
                          width: 100%;
                          background-color: transparent;
                        ">
                                        <div style="
                            min-width: 320px;
                            max-width: 500px;
                            display: table-cell;
                            vertical-align: top;
                          ">
                                            <div style="
                              background-color: transparent;
                              width: 100% !important;
                            ">
                                                <div style="
                                border-top: 0px solid transparent;
                                border-left: 0px solid transparent;
                                border-bottom: 0px solid transparent;
                                border-right: 0px solid transparent;
                                padding-top: 5px;
                                padding-bottom: 5px;
                                padding-right: 0px;
                                padding-left: 0px;
                              ">
                                                    <div align="center" style="padding-right: 0px; padding-left: 0px"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="background-color: transparent">
                                <div style="
                        margin: 0 auto;
                        min-width: 320px;
                        max-width: 500px;
                        word-wrap: break-word;
                        word-break: break-word;
                        background-color: transparent;
                      ">
                                    <div style="
                          border-collapse: collapse;
                          display: table;
                          width: 100%;
                          background-color: transparent;
                        ">
                                        <div style="
                            min-width: 320px;
                            max-width: 500px;
                            display: table-cell;
                            vertical-align: top;
                          ">
                                            <div style="
                              background-color: transparent;
                              width: 100% !important;
                            ">
                                                <div style="
                                border-top: 0px solid transparent;
                                border-left: 0px solid transparent;
                                border-bottom: 0px solid transparent;
                                border-right: 0px solid transparent;
                                padding-top: 5px;
                                padding-bottom: 5px;
                                padding-right: 0px;
                                padding-left: 0px;
                              ">
                                                    <div style="
                                  font-size: 16px;
                                  font-family: Arial, 'Helvetica Neue', Helvetica,
                                    sans-serif;
                                  text-align: center;
                                ">
                                                        <div>
                                                            <table align="center" style="
                                      margin: 0 auto;
                                      width: 325px;
                                      height: 746px;
                                      border: 5px solid #e0e6e8;
                                      padding: 10px;
                                    ">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="text-align: center">
                                                                            <b>Bệnh viện X TPHCM</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: center">
                                                                            PHIẾU KHÁM BỆNH<br /><i th:inline="text">(Mã
                                                                                phiếu:
                                                                                ${ticket.Id})</i>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: center" th:inline="text">
                                                                            Khám ${ticket.Area}
                                                                            <br />Phòng khám:
                                                                            Phòng ${ticket.Clinic}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: center" th:inline="text">
                                                                            Chuyên khoa: ${ticket.Department}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: center">
                                                                            <p style="
                                              color: #48a7f2;
                                              font-size: 100px;
                                              margin: 20px 0;
                                              font-weight: bold;
                                            ">
                                                                                <b th:inline="text">${ticket.Number}</b>
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Ngày khám: <b
                                                                                th:inline="text">${ticket.Date}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Giờ khám dự kiến: <b
                                                                                th:inline="text">${ticket.Time}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Họ tên: <b
                                                                                th:inline="text">${ticket.NamePatient}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Giới tính: <b
                                                                                th:inline="text">${ticket.Gender}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Năm sinh: <b
                                                                                th:inline="text">${ticket.DateOfBirth}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Địa chỉ: <b
                                                                                th:inline="text">${ticket.Address}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            BHYT: <b
                                                                                th:inline="text">${ticket.HealthInsurance}</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            <i>Vui lòng đến trực tiếp phòng khám trước
                                                                                giờ hẹn 15-30 phút để khám bệnh.</i>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <hr style="
                                              color: #e0e6e8;
                                              margin-bottom: 1px;
                                              margin-top: 1px;
                                            " />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            Số hồ sơ:<br />
                                                                            <b th:inline="text">${ticket.RecordId}</b>
                                                                            <br />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="text-align: left">
                                                                            <i>Ghi chú: Phiếu khám bệnh chỉ có giá trị
                                                                                trong ngày khám từ
                                                                                <b>7h00 - 16h00</b>.</i>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>
    `;
    const newWindow = window.open(`${ticket.Id}`, '_blank');
    newWindow.document.write(confirmationReceipt);
  };


  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSearch = () => {
    setSearchStatus(status)
    setPage("0");
  }

  const handleChangPage = (page) => {
    setPage(page-1);
  }

  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      render: (_, __, index) => index + 1 + page * 10,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'NamePatient',
      key: 'NamePatient',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
    },
    {
      title: 'Tên bác sĩ',
      dataIndex: 'NameDoctor',
      key: 'NameDoctor',
    },
    {
      title: 'Ngày khám',
      dataIndex: 'Date',
      key: 'Date',
    },
    {
      title: 'Khoa',
      dataIndex: 'Department',
      key: 'Department',
    },
    {
      title: 'Vị trí',
      dataIndex: 'Area',
      key: 'Area',
    },
    {
      title: 'Phòng',
      dataIndex: 'Clinic',
      key: 'Clinic',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'options',
      key: 'options',
      render: (_,ticket) => (
        <Space size="middle">
          <Button type="link" className="read" onClick={() => openConfirmationReceipt(ticket)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 items-center">
      <h1 className=" text-3xl font-rubik text-blue-700 mb-6 mt-28">Quản lý lịch khám</h1>
      <div className="flex items-center mb-5">
        <Select
          className="w-96 mr-3"
          placeholder="Chọn trạng thái phiếu khám"
          value={status}
          onChange={(value) => setStatus(value)}
          allowClear
        >
          <Select.Option value="WAITING">Đang chờ</Select.Option>
          <Select.Option value="COMPLETED">Đã khám</Select.Option>
        </Select>
        <Button
          onClick={() => handleSearch()}
          className="bg-blue-700 text-white"
          htmlType="submit"
          icon={<SearchOutlined />}
        >
          Tìm kiếm
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data}
        pagination={{
          total: totalItems,
          pageSize: 10,
          current: page + 1,
          onChange: handleChangPage,
        }}
      />    
    </div>
  )
}

export default Schedules
