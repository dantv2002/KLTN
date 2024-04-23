package com.hospitalx.emr.models.entitys;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "DiagnosticImages")
@Data
public class DiagnosticImage {
    @Id
    private String id;
    private String method; // Phương pháp: CT, MRI, X-Quang
    private String content; // Nội dung yêu cầu
    private String urlImage; // Đường dẫn ảnh
    private String conclude; // Kết luận
    private String doctorIdPerform; // Id bác sĩ thực hiện
    private Boolean locked = false;
}
