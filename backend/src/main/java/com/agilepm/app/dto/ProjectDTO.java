package com.agilepm.app.dto;

import com.agilepm.app.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Project name is required")
    @Size(max = 100, message = "Project name must not exceed 100 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private ProjectStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<UserStoryDTO> userStories;
    private int totalStories;
    private int totalTasks;
    private int completedTasks;
    private double completionPercentage;
}
