package com.agilepm.app.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    private boolean success;
    private String message;
    private String details;
    private Map<String, String> validationErrors;
    private LocalDateTime timestamp;
}
