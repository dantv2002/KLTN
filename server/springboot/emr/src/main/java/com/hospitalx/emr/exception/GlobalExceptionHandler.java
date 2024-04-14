package com.hospitalx.emr.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.hospitalx.emr.common.BaseResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleException(Exception exception) {
        BaseResponse baseResponse = new BaseResponse();
        String message = "Internal Server Error";
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    @ExceptionHandler({ NoHandlerFoundException.class, NoResourceFoundException.class })
    public ResponseEntity<BaseResponse> handleNoHandlerFoundException(Exception exception) {
        BaseResponse baseResponse = new BaseResponse();
        String message = "Page not found";
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.NOT_FOUND.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<BaseResponse> handleInsufficientAuthenticationException(Exception exception) {
        BaseResponse baseResponse = new BaseResponse();
        String message = "Full authentication is required to access this resource";
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<BaseResponse> handleAccountAlreadyExistsException(CustomException exception) {
        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setMessage(exception.getMessage());
        baseResponse.setStatus(exception.getStatus());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception) {
        BaseResponse baseResponse = new BaseResponse();
        String message = exception.getBindingResult().getFieldError().getDefaultMessage();
        baseResponse.setMessage(message);
        baseResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        baseResponse.setData(null);
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

}
