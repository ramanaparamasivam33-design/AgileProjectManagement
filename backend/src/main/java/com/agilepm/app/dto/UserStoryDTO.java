package com.agilepm.app.dto;

import com.agilepm.app.enums.StoryPriority;
import com.agilepm.app.enums.StoryStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class UserStoryDTO {

    private Long id;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private String projectName;

    @NotBlank(message = "Story title is required")
    @Size(max = 150, message = "Story title must not exceed 150 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private StoryPriority priority;
    private StoryStatus status;

    @Min(value = 1, message = "Story points must be at least 1")
    private Integer storyPoints;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<TaskDTO> tasks;
    private int totalTasks;
    private int completedTasks;
}
