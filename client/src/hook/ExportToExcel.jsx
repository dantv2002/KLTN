import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportToExcel = ({ data }) => {
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();

    // Tạo sheet cho Tài khoản và thêm dữ liệu
    const accountSheetData = [
        ['Tổng', data.Account.Total],
        [''],
        ['Thống kê'],
        ['Tháng', 'Số lượng']
    ];
    data.Account.Statistical.forEach(item => {
        accountSheetData.push([item.Date, item.Count]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(accountSheetData), 'Tài khoản');

    // Tạo sheet cho Phiếu khám và thêm dữ liệu
    const ticketSheetData = [
        ['Tổng', data.Ticket.Total],
        [''],
        ['Thống kê'],
        ['Tháng', 'Số lượng']
    ];
    data.Ticket.Statistical.forEach(item => {
        ticketSheetData.push([item.Date, item.Count]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ticketSheetData), 'Phiếu khám');

    // Tạo sheet cho Hồ sơ bệnh nhân và thêm dữ liệu
    const recordSheetData = [
        ['Tổng', data.Record.Total],
        [''],
        ['Thống kê'],
        ['Tháng', 'Số lượng']
    ];
    data.Record.Statistical.forEach(item => {
        recordSheetData.push([item.Date, item.Count]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(recordSheetData), 'Hồ sơ bệnh nhân');

    // Tạo sheet cho Hồ sơ bệnh án và thêm dữ liệu
    const medicalSheetData = [
        ['Tổng', data.Medical.Total],
        ['Mới', data.Medical.New],
        ['Đã lưu kho', data.Medical.Locked],
        ['Hết hạn', data.Medical.Expired],
        [''],
        ['Thống kê'],
        ['Tháng', 'Số lượng']
    ];
    data.Medical.Statistical.forEach(item => {
        medicalSheetData.push([item.Date, item.Count]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(medicalSheetData), 'Hồ sơ bệnh án');

    // Tạo file Excel và lưu
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'StatisticalData.xlsx');
};

ExportToExcel.propTypes = {
    data: PropTypes.shape({
        Account: PropTypes.shape({
            Total: PropTypes.number.isRequired,
            Statistical: PropTypes.arrayOf(PropTypes.shape({
                Count: PropTypes.number.isRequired,
                Date: PropTypes.string.isRequired
            })).isRequired
        }).isRequired,
        Ticket: PropTypes.shape({
            Total: PropTypes.number.isRequired,
            Statistical: PropTypes.arrayOf(PropTypes.shape({
                Count: PropTypes.number.isRequired,
                Date: PropTypes.string.isRequired
            })).isRequired
        }).isRequired,
        Record: PropTypes.shape({
            Total: PropTypes.number.isRequired,
            Statistical: PropTypes.arrayOf(PropTypes.shape({
                Count: PropTypes.number.isRequired,
                Date: PropTypes.string.isRequired
            })).isRequired
        }).isRequired,
        Medical: PropTypes.shape({
            New: PropTypes.number.isRequired,
            Locked: PropTypes.number.isRequired,
            Total: PropTypes.number.isRequired,
            Statistical: PropTypes.arrayOf(PropTypes.shape({
                Count: PropTypes.number.isRequired,
                Date: PropTypes.string.isRequired
            })).isRequired,
            Expired: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
};

export default ExportToExcel;
