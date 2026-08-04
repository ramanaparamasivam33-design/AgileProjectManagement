package com.agilepm.app.service.impl;

import com.agilepm.app.dto.TaskDTO;
import com.agilepm.app.entity.Task;
import com.agilepm.app.entity.UserStory;
import com.agilepm.app.enums.TaskStatus;
import com.agilepm.app.exception.ResourceNotFoundException;
import com.agilepm.app.mapper.TaskMapper;
import com.agilepm.app.repository.TaskRepository;
import com.agilepm.app.repository.UserStoryRepository;
import com.agilepm.app.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        UserStory story = userStoryRepository.findById(taskDTO.getStoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent user story not found with id: " + taskDTO.getStoryId()));

        Task task = taskMapper.toEntity(taskDTO, story);
        Task saved = taskRepository.save(task);
        return taskMapper.toDTO(saved);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        existing.setTitle(taskDTO.getTitle());
        existing.setDescription(taskDTO.getDescription());
        if (taskDTO.getStatus() != null) existing.setStatus(taskDTO.getStatus());
        if (taskDTO.getPriority() != null) existing.setPriority(taskDTO.getPriority());
        existing.setAssignee(taskDTO.getAssignee());
        existing.setDueDate(taskDTO.getDueDate());

        Task updated = taskRepository.save(existing);
        return taskMapper.toDTO(updated);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return taskMapper.toDTO(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByStory(Long storyId) {
        if (!userStoryRepository.existsById(storyId)) {
            throw new ResourceNotFoundException("User story not found with id: " + storyId);
        }
        return taskRepository.findByStoryId(storyId).stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks(TaskStatus status) {
        List<Task> tasks;
        if (status != null) {
            tasks = taskRepository.findByStatus(status);
        } else {
            tasks = taskRepository.findAll();
        }
        return tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTaskStatus(Long id, TaskStatus status) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        existing.setStatus(status);
        Task updated = taskRepository.save(existing);
        return taskMapper.toDTO(updated);
    }
}
