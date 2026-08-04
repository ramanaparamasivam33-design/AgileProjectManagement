package com.agilepm.app.mapper;

import com.agilepm.app.dto.TaskDTO;
import com.agilepm.app.entity.Task;
import com.agilepm.app.entity.UserStory;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDTO toDTO(Task entity) {
        if (entity == null) return null;

        UserStory story = entity.getStory();
        Long storyId = story != null ? story.getId() : null;
        String storyTitle = story != null ? story.getTitle() : null;
        Long projectId = (story != null && story.getProject() != null) ? story.getProject().getId() : null;
        String projectName = (story != null && story.getProject() != null) ? story.getProject().getName() : null;

        return TaskDTO.builder()
                .id(entity.getId())
                .storyId(storyId)
                .storyTitle(storyTitle)
                .projectId(projectId)
                .projectName(projectName)
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .assignee(entity.getAssignee())
                .dueDate(entity.getDueDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Task toEntity(TaskDTO dto, UserStory story) {
        if (dto == null) return null;

        return Task.builder()
                .id(dto.getId())
                .story(story)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .priority(dto.getPriority())
                .assignee(dto.getAssignee())
                .dueDate(dto.getDueDate())
                .build();
    }
}
