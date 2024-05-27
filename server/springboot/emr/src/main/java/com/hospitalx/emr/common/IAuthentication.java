package com.hospitalx.emr.common;

import org.springframework.security.core.Authentication;

public interface IAuthentication {
    Authentication getAuthentication();
}
