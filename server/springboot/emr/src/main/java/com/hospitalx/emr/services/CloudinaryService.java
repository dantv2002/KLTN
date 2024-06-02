package com.hospitalx.emr.services;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.hospitalx.emr.exception.CustomException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    public void delete(String id) {
        try {
            cloudinary.uploader().destroy(id, null);
            log.info("Image public id: " + id + " deleted successfully");
        } catch (IOException e) {
            log.error("Error deleting image from cloudinary: " + e.getMessage());
            throw new CustomException("Có lỗi không thể xóa ảnh", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}
