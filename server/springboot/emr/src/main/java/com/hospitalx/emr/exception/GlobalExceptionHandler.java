package com.hospitalx.emr.exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.hospitalx.emr.common.BaseResponse;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @Autowired
    private Environment env;

    // Lỗi hệ thống
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleException(Exception exception) {
        log.error("Exception: " + exception.getMessage());
        BaseResponse baseResponse = new BaseResponse();

        if (env.getActiveProfiles()[0].equals("dev")) {
            baseResponse.setMessage(exception.getMessage());
        } else {
            baseResponse.setMessage(
                    "Đã xảy ra lỗi nội bộ trên server. Chúng tôi đang nỗ lực khắc phục sự cố này. Vui lòng thử lại sau ít phút. Nếu bạn tiếp tục gặp vấn đề, hãy liên hệ hỗ trợ của chúng tôi.");
        }

        baseResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    // Lỗi không tìm thấy trang
    @ExceptionHandler({ NoHandlerFoundException.class, NoResourceFoundException.class })
    public ResponseEntity<BaseResponse> handleNoHandlerFoundException(Exception exception) {
        log.error("Exception: " + exception.getMessage());
        BaseResponse baseResponse = new BaseResponse();
        String message = "Trang bạn yêu cầu không tồn tại. Vui lòng kiểm tra lại URL và thử lại.";
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.NOT_FOUND.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    // Lỗi không xác thực
    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<BaseResponse> handleInsufficientAuthenticationException(Exception exception) {
        log.error("Exception: " + exception.getMessage());
        BaseResponse baseResponse = new BaseResponse();
        String message = "Yêu cầu của bạn không được xác thực. Vui lòng đăng nhập và thử lại.";
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<BaseResponse> handleAccessDeniedException(Exception exception) {
        log.error("Exception: " + exception.getMessage());
        BaseResponse baseResponse = new BaseResponse();
        String message = "Bạn không có quyền truy cập vào tài nguyên này.";
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.FORBIDDEN.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    // Custom lỗi
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<BaseResponse> handleAccountAlreadyExistsException(CustomException exception) {
        log.error("Exception: " + exception.getMessage());
        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setMessage(exception.getMessage());
        baseResponse.setStatus(exception.getStatus());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    // Lỗi không hợp lệ do validate
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception) {
        log.error("Exception: " + exception.getMessage());
        BaseResponse baseResponse = new BaseResponse();
        String message = exception.getBindingResult().getFieldError().getDefaultMessage();
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }
}
