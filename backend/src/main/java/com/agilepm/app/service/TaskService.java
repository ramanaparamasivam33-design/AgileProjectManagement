package com.agilepm.app.service;

import com.agilepm.app.dto.TaskDTO;
import com.agilepm.app.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    TaskDTO updateTask(Long id, TaskDTO taskDTO);
    void deleteTask(Long id);
    TaskDTO getTaskById(Long id);
    List<TaskDTO> getTasksByStory(Long storyId);
    List<TaskDTO> getAllTasks(TaskStatus status);
    TaskDTO updateTaskStatus(Long id, TaskStatus status);
}
