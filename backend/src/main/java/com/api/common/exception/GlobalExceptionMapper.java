package com.api.common.exception;

import com.api.common.dto.ApiErrorResponse;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(Throwable exception) {
        int status = resolveStatus(exception);
        String message = resolveMessage(exception, status);
        String path = uriInfo != null ? uriInfo.getPath() : null;

        if (status >= 500) {
            LOG.error("Unhandled API error", exception);
        } else {
            LOG.warnf("API error, status=%s, path=%s, message=%s", status, path, message);
        }

        ApiErrorResponse error = new ApiErrorResponse(
                status,
                message,
                path != null ? "/" + path : null,
                LocalDateTime.now().toString()
        );

        return Response.status(status)
                .entity(error)
                .build();
    }

    private int resolveStatus(Throwable exception) {
        if (exception instanceof BadRequestException) {
            return Response.Status.BAD_REQUEST.getStatusCode();
        }

        if (exception instanceof NotAuthorizedException) {
            return Response.Status.UNAUTHORIZED.getStatusCode();
        }

        if (exception instanceof ForbiddenException) {
            return Response.Status.FORBIDDEN.getStatusCode();
        }

        if (exception instanceof NotFoundException) {
            return Response.Status.NOT_FOUND.getStatusCode();
        }

        if (exception instanceof WebApplicationException webApplicationException) {
            return webApplicationException.getResponse().getStatus();
        }

        return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
    }

    private String resolveMessage(Throwable exception, int status) {
        if (exception.getMessage() != null && !exception.getMessage().isBlank()) {
            return exception.getMessage();
        }

        return switch (status) {
            case 400 -> "Bad request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not found";
            default -> "Internal server error";
        };
    }
}