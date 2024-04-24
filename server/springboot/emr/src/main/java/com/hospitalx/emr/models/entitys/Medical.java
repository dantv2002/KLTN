package com.hospitalx.emr.models.entitys;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.hospitalx.emr.common.MedicalResult;
import com.hospitalx.emr.common.MedicalType;

import lombok.Data;

@Document(collection = "Medicals")
@Data
public class Medical {
    @Id
    private String id;
    private String reason; // Lý do khám(Triệu chứng)
    private String pathologicalProcess; // Quá trình bệnh lý
    private String medicalHistory; // Tiền sử bệnh
    private Biosignal biosignal; // Dấu hiệu sinh tồn(Sinh hiệu)
    private String examineOrgans; // Khám các cơ quan
    private List<String> diagnosticImages; // Danh sách chẩn đoán hình ảnh
    private String summary; // Tóm tắt kết quả chẩn đoán hình ảnh
    private String treatmentMethod; // Phương pháp điều trị
    private String diagnosisDischarge = ""; // Chuẩn đoán ra viện
    private Boolean locked = false; // Bệnh án đã khóa
    private Date saveDate; // Ngày lưu trữ
    private Date dueDate; // Ngày đến hạn thanh lý
    private MedicalType type; // Loại bệnh án
    private Date createDate; // Ngày tạo
    private String mark = "NO"; // Đánh dấu
    // Ngoại trú
    private Date date;// Thời gian đến khám
    private String initialDiagnosis; // Chẩn đoán ban đầu
    // chẩn đoán khi ra viện
    // Nội trú
    private String specializedExamination; // Khám chuyên khoa
    private Date dateAdmission; // Thời gian vào viện
    private String departmentAdmission; // Khoa vào viện
    private Date dateTransfer; // Thời gian chuyển khoa
    private String departmentTransfer; // Khoa chuyển
    private String diagnosisTransfer; // Chuẩn đoán nơi chuyển đến
    private String diagnosisAdmission; // Chuẩn đoán khi vào khoa điều trị
    private String prognosis; // Tiên lượng
    private Date dateDischarge; // Thời gian ra viện
    private Integer daysTreatment; // Số ngày điều trị
    private MedicalResult result; // Kết quả điều trị
    //
    private String doctorIdTreatment;// Bác sĩ điều trị
    private String recordId; // Mã hồ sơ bệnh nhân
}
