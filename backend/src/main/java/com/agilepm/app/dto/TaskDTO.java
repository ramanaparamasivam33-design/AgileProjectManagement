package com.agilepm.app.dto;

import com.agilepm.app.enums.TaskPriority;
import com.agilepm.app.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private Long id;

    @NotNull(message = "Story ID is required")
    private Long storyId;

    private String storyTitle;
    private Long projectId;
    private String projectName;

    @NotBlank(message = "Task title is required")
    @Size(max = 150, message = "Task title must not exceed 150 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private TaskStatus status;
    private TaskPriority priority;

    @Size(max = 100, message = "Assignee name must not exceed 100 characters")
    private String assignee;

    private LocalDate dueDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
