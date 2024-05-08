package com.hospitalx.emr.models.dtos;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hospitalx.emr.common.MedicalResult;
import com.hospitalx.emr.common.MedicalType;
import com.hospitalx.emr.models.entitys.Biosignal;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MedicalDto {
    @JsonProperty("Id")
    private String id;
    @NotEmpty(message = "Vui lòng nhập lý do khám bệnh")
    @JsonProperty("Reason")
    private String reason; // Lý do khám(Triệu chứng)
    @NotEmpty(message = "Vui lòng nhập quá trình bệnh lý")
    @JsonProperty("PathologicalProcess")
    private String pathologicalProcess; // Quá trình bệnh lý
    @NotEmpty(message = "Vui lòng nhập tiền sử bệnh")
    @JsonProperty("MedicalHistory")
    private String medicalHistory; // Tiền sử bệnh
    @NotNull(message = "Vui lòng nhập kết quả sinh hiệu")
    @JsonProperty("Biosignal")
    private Biosignal biosignal; // Dấu hiệu sinh tồn(Sinh hiệu)
    @JsonProperty("ExamineOrgans")
    private String examineOrgans; // Khám các cơ quan

    @JsonProperty("DiagnosticImages")
    private List<String> diagnosticImages; // Danh sách chẩn đoán hình ảnh
    @JsonProperty("Summary")
    private String summary; // Tóm tắt kết quả chẩn đoán hình ảnh
    @JsonProperty("TreatmentMethod")
    private String treatmentMethod; // Phương pháp điều trị
    @JsonProperty("DiagnosisDischarge")
    private String diagnosisDischarge; // Chuẩn đoán ra viện
    @JsonProperty("Result")
    private MedicalResult result; // Kết quả điều trị
    @JsonProperty("Locked")
    private Boolean locked; // Bệnh án đã khóa
    @JsonProperty("SaveDate")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date saveDate; // Ngày lưu trữ
    @JsonProperty("DueDate")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date dueDate; // Ngày đến hạn thanh lý
    @JsonProperty("CreateDate")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date createDate; // Ngày tạo
    @JsonProperty("Mark")
    private String mark = "NO"; // Đánh dấu

    @NotNull(message = "Vui lòng nhập loại bệnh án")
    @JsonProperty("Type")
    private MedicalType type; // Loại bệnh án
    // Ngoại trú
    @JsonProperty("Date")
    @JsonFormat(pattern = "HH:mm dd/MM/yyyy")
    private Date date;// Thời gian đến khám
    @JsonProperty("InitialDiagnosis")
    private String initialDiagnosis; // Chẩn đoán ban đầu
    // chẩn đoán khi ra viện
    // Nội trú
    @JsonProperty("SpecializedExamination")
    private String specializedExamination; // Khám chuyên khoa
    @JsonProperty("DateAdmission")
    @JsonFormat(pattern = "HH:mm dd/MM/yyyy")
    private Date dateAdmission; // Thời gian vào viện
    @JsonProperty("DepartmentAdmission")
    private String departmentAdmission; // Khoa vào viện
    @JsonProperty("DiagnosisAdmission")
    private String diagnosisAdmission; // Chuẩn đoán khi vào khoa điều trị
    // Optional
    @JsonProperty("DateTransfer")
    @JsonFormat(pattern = "HH:mm dd/MM/yyyy")
    private Date dateTransfer; // Thời gian chuyển khoa
    @JsonProperty("DepartmentTransfer")
    private String departmentTransfer; // Khoa chuyển
    @JsonProperty("DiagnosisTransfer")
    private String diagnosisTransfer; // Chuẩn đoán nơi chuyển đến
    //

    @JsonProperty("Prognosis")
    private String prognosis; // Tiên lượng
    @JsonProperty("DateDischarge")
    @JsonFormat(pattern = "HH:mm dd/MM/yyyy")
    private Date dateDischarge; // Thời gian ra viện
    @JsonProperty("DaysTreatment")
    private Integer daysTreatment; // Số ngày điều trị
    //
    @NotEmpty(message = "Vui lòng nhập bác sĩ điều trị")
    @JsonProperty("DoctorIdTreatment")
    private String doctorIdTreatment; // Bác sĩ điều trị
    @NotEmpty(message = "Vui lòng chọn hồ sơ bệnh nhân")
    @JsonProperty("RecordId")
    private String recordId; // Mã hồ sơ bệnh nhân
}
