package com.agilepm.app.controller;

import com.agilepm.app.dto.ApiResponse;
import com.agilepm.app.dto.TaskDTO;
import com.agilepm.app.dto.TaskStatusUpdateDTO;
import com.agilepm.app.enums.TaskStatus;
import com.agilepm.app.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Task Management API", description = "Endpoints for managing individual tasks, status progression, and story assignments.")
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/tasks")
    @Operation(summary = "Create Task", description = "Creates a new task under a specific user story.")
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        TaskDTO created = taskService.createTask(taskDTO);
        return new ResponseEntity<>(ApiResponse.success(created, "Task created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/tasks/{id}")
    @Operation(summary = "Update Task", description = "Updates task details including title, assignee, priority, and due date.")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(
            @Parameter(description = "ID of task to update") @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO) {
        TaskDTO updated = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(ApiResponse.success(updated, "Task updated successfully"));
    }

    @DeleteMapping("/tasks/{id}")
    @Operation(summary = "Delete Task", description = "Deletes a task by ID.")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @Parameter(description = "ID of task to delete") @PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }

    @GetMapping("/tasks/{id}")
    @Operation(summary = "Get Task", description = "Fetches task details by ID.")
    public ResponseEntity<ApiResponse<TaskDTO>> getTask(
            @Parameter(description = "ID of task to fetch") @PathVariable Long id) {
        TaskDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task, "Task fetched successfully"));
    }

    @GetMapping("/stories/{storyId}/tasks")
    @Operation(summary = "List Tasks by Story", description = "Retrieves all tasks under a specific user story.")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> getTasksByStory(
            @Parameter(description = "ID of user story") @PathVariable Long storyId) {
        List<TaskDTO> tasks = taskService.getTasksByStory(storyId);
        return ResponseEntity.ok(ApiResponse.success(tasks, "User story tasks fetched successfully"));
    }

    @GetMapping("/tasks")
    @Operation(summary = "Get All Tasks", description = "Retrieves all tasks across all projects with optional status filter.")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> getAllTasks(
            @Parameter(description = "Filter tasks by status (TODO, IN_PROGRESS, DONE, OVERDUE)") @RequestParam(required = false) TaskStatus status) {
        List<TaskDTO> tasks = taskService.getAllTasks(status);
        return ResponseEntity.ok(ApiResponse.success(tasks, "Tasks retrieved successfully"));
    }

    @PatchMapping("/tasks/{id}/status")
    @Operation(summary = "Update Task Status", description = "Updates the status of a task (useful for Kanban drag-and-drop or quick status toggle).")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTaskStatus(
            @Parameter(description = "ID of task to update") @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateDTO statusDTO) {
        TaskDTO updated = taskService.updateTaskStatus(id, statusDTO.getStatus());
        return ResponseEntity.ok(ApiResponse.success(updated, "Task status updated successfully"));
    }
}
