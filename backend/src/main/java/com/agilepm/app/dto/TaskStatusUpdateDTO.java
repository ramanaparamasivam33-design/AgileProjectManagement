package com.agilepm.app.dto;

import com.agilepm.app.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private TaskStatus status;
}
