package com.agilepm.app.mapper;

import com.agilepm.app.dto.ProjectDTO;
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
public class ProjectMapper {

    private final UserStoryMapper userStoryMapper;

    public ProjectDTO toDTO(Project entity, boolean includeDetails) {
        if (entity == null) return null;

        List<UserStoryDTO> storiesDTO = Collections.emptyList();
        int totalStories = 0;
        int totalTasks = 0;
        int completedTasks = 0;

        if (entity.getUserStories() != null) {
            totalStories = entity.getUserStories().size();
            for (UserStory story : entity.getUserStories()) {
                if (story.getTasks() != null) {
                    totalTasks += story.getTasks().size();
                    completedTasks += (int) story.getTasks().stream()
                            .filter(t -> t.getStatus() == TaskStatus.DONE)
                            .count();
                }
            }

            if (includeDetails) {
                storiesDTO = entity.getUserStories().stream()
                        .map(story -> userStoryMapper.toDTO(story, true))
                        .collect(Collectors.toList());
            }
        }

        double completionPercentage = totalTasks > 0 ? (double) completedTasks / totalTasks * 100.0 : 0.0;

        return ProjectDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .userStories(storiesDTO)
                .totalStories(totalStories)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .completionPercentage(Math.round(completionPercentage * 10.0) / 10.0)
                .build();
    }

    public Project toEntity(ProjectDTO dto) {
        if (dto == null) return null;

        return Project.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .build();
    }
}
