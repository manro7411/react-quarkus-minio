package com.api.admin.dto.response;

public class LoginResponse {

    public String accessToken;
    public String refreshToken;
    public String tokenType;
    public Long expiresIn;
    public String displayName;
    public String role;

    public LoginResponse() {
    }

    public LoginResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            Long expiresIn,
            String displayName,
            String role
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.displayName = displayName;
        this.role = role;
    }
}