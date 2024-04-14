package com.hospitalx.emr.models.entitys;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.hospitalx.emr.common.AuthProvider;

import lombok.Data;

@Document(collection = "Accounts")
@Data
public class Account {

    @Id
    private String id;
    private String fullName;
    private String imageUrl;
    private String email;

    private Boolean emailVerified = false;

    private String password = null;
    private String passwordUpdate = null;
    private String role = "PATIENT";
    private Boolean actived = true;

    private AuthProvider authProvider = AuthProvider.LOCAL;
    private Boolean deleted = false;

    private Verify verify;

    public void setFullName(String fullName) {
        this.fullName = fullName.replace(" ", "_");
    }
}
