package com.agilepm.app.mapper;

import com.agilepm.app.dto.TaskDTO;
import com.agilepm.app.dto.UserStoryDTO;
import com.agilepm.app.entity.Project;
import com.agilepm.app.entity.Task;
import com.agilepm.app.entity.UserStory;
import com.agilepm.app.enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserStoryMapper {

    private final TaskMapper taskMapper;

    public UserStoryDTO toDTO(UserStory entity, boolean includeTasks) {
        if (entity == null) return null;

        Project project = entity.getProject();
        Long projectId = project != null ? project.getId() : null;
        String projectName = project != null ? project.getName() : null;

        List<TaskDTO> taskDTOs = Collections.emptyList();
        int totalTasks = 0;
        int completedTasks = 0;

        if (entity.getTasks() != null) {
            totalTasks = entity.getTasks().size();
            completedTasks = (int) entity.getTasks().stream()
                    .filter(t -> t.getStatus() == TaskStatus.DONE)
                    .count();
            if (includeTasks) {
                taskDTOs = entity.getTasks().stream()
                        .map(taskMapper::toDTO)
                        .collect(Collectors.toList());
            }
        }

        return UserStoryDTO.builder()
                .id(entity.getId())
                .projectId(projectId)
                .projectName(projectName)
                .title(entity.getTitle())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .storyPoints(entity.getStoryPoints())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .tasks(taskDTOs)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .build();
    }

    public UserStory toEntity(UserStoryDTO dto, Project project) {
        if (dto == null) return null;

        return UserStory.builder()
                .id(dto.getId())
                .project(project)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .status(dto.getStatus())
                .storyPoints(dto.getStoryPoints())
                .build();
    }
}
