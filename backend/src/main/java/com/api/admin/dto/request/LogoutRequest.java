package com.api.admin.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LogoutRequest {

    @NotBlank
    public String refreshToken;
}