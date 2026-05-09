package com.api.admin.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @Email
    @NotBlank
    public String email;

    @NotBlank
    public String password;

    public String displayName;

    public String role;

    public String setupKey;
}