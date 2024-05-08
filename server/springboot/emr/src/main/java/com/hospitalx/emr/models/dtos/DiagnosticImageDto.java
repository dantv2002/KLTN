package com.hospitalx.emr.models.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiagnosticImageDto {
    @JsonProperty("Id")
    private String id;
    @NotEmpty(message = "Vui lòng nhập phương pháp chụp")
    @JsonProperty("Method")
    private String method; // Phương pháp: CT, MRI, X-Quang
    @NotEmpty(message = "Vui lòng nhập nội dung chụp")
    @JsonProperty("Content")
    private String content; // Nội dung yêu cầu
    @NotEmpty(message = "Vui lòng thêm ảnh chụp")
    @JsonProperty("UrlImage")
    private String urlImage; // Đường dẫn ảnh
    @NotEmpty(message = "Vui lòng nhập kết luận chẩn đoán hình ảnh")
    @JsonProperty("Conclude")
    private String conclude; // Kết luận
    @JsonProperty("DoctorIdPerform")
    private String doctorIdPerform; // Id bác sĩ thực hiện
    @JsonProperty("Locked")
    private Boolean locked = false;
}
