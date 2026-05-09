package com.api.admin.dto.response;

public class RegisterResponse {

    public String id;
    public String email;
    public String displayName;
    public String role;
    public Boolean active;

    public RegisterResponse() {
    }

    public RegisterResponse(
            String id,
            String email,
            String displayName,
            String role,
            Boolean active
    ) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.active = active;
    }
}