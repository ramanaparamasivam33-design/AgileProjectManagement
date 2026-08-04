package com.agilepm.app.controller;

import com.agilepm.app.dto.ApiResponse;
import com.agilepm.app.dto.ProjectDTO;
import com.agilepm.app.enums.ProjectStatus;
import com.agilepm.app.service.ProjectService;
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
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management API", description = "Endpoints for creating, managing, updating, and querying Agile Projects.")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create Project", description = "Creates a new Agile project in the system.")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        ProjectDTO created = projectService.createProject(projectDTO);
        return new ResponseEntity<>(ApiResponse.success(created, "Project created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Project", description = "Updates details of an existing project by ID.")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(
            @Parameter(description = "ID of project to update") @PathVariable Long id,
            @Valid @RequestBody ProjectDTO projectDTO) {
        ProjectDTO updated = projectService.updateProject(id, projectDTO);
        return ResponseEntity.ok(ApiResponse.success(updated, "Project updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Project", description = "Deletes a project and recursively deletes all user stories and tasks inside it.")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @Parameter(description = "ID of project to delete") @PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Project and associated work items deleted successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Project by ID", description = "Fetches project details along with full hierarchy of User Stories and Tasks.")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(
            @Parameter(description = "ID of project to fetch") @PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project, "Project fetched successfully"));
    }

    @GetMapping
    @Operation(summary = "Get All Projects", description = "Retrieves all projects with optional keyword search and status filter.")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects(
            @Parameter(description = "Search project by name keyword") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by project status") @RequestParam(required = false) ProjectStatus status) {
        List<ProjectDTO> projects = projectService.getAllProjects(search, status);
        return ResponseEntity.ok(ApiResponse.success(projects, "Projects retrieved successfully"));
    }
}
