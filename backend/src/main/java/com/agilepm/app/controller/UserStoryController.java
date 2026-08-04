package com.agilepm.app.controller;

import com.agilepm.app.dto.ApiResponse;
import com.agilepm.app.dto.UserStoryDTO;
import com.agilepm.app.service.UserStoryService;
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
@Tag(name = "User Story Management API", description = "Endpoints for managing user stories within Agile Projects.")
public class UserStoryController {

    private final UserStoryService userStoryService;

    @PostMapping("/stories")
    @Operation(summary = "Create Story", description = "Creates a new user story under an existing project.")
    public ResponseEntity<ApiResponse<UserStoryDTO>> createStory(@Valid @RequestBody UserStoryDTO storyDTO) {
        UserStoryDTO created = userStoryService.createStory(storyDTO);
        return new ResponseEntity<>(ApiResponse.success(created, "User story created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/stories/{id}")
    @Operation(summary = "Update Story", description = "Updates an existing user story details.")
    public ResponseEntity<ApiResponse<UserStoryDTO>> updateStory(
            @Parameter(description = "ID of user story to update") @PathVariable Long id,
            @Valid @RequestBody UserStoryDTO storyDTO) {
        UserStoryDTO updated = userStoryService.updateStory(id, storyDTO);
        return ResponseEntity.ok(ApiResponse.success(updated, "User story updated successfully"));
    }

    @DeleteMapping("/stories/{id}")
    @Operation(summary = "Delete Story", description = "Deletes a user story and all tasks associated with it.")
    public ResponseEntity<ApiResponse<Void>> deleteStory(
            @Parameter(description = "ID of user story to delete") @PathVariable Long id) {
        userStoryService.deleteStory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User story deleted successfully"));
    }

    @GetMapping("/stories/{id}")
    @Operation(summary = "Get Story", description = "Fetches a single user story by ID including its nested tasks.")
    public ResponseEntity<ApiResponse<UserStoryDTO>> getStory(
            @Parameter(description = "ID of user story to fetch") @PathVariable Long id) {
        UserStoryDTO story = userStoryService.getStoryById(id);
        return ResponseEntity.ok(ApiResponse.success(story, "User story fetched successfully"));
    }

    @GetMapping("/projects/{projectId}/stories")
    @Operation(summary = "List Stories by Project", description = "Retrieves all user stories associated with a specific project.")
    public ResponseEntity<ApiResponse<List<UserStoryDTO>>> getStoriesByProject(
            @Parameter(description = "ID of project") @PathVariable Long projectId) {
        List<UserStoryDTO> stories = userStoryService.getStoriesByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success(stories, "Project user stories fetched successfully"));
    }
}
