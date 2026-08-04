package com.agilepm.app.service;

import com.agilepm.app.dto.ProjectDTO;
import com.agilepm.app.enums.ProjectStatus;

import java.util.List;

public interface ProjectService {
    ProjectDTO createProject(ProjectDTO projectDTO);
    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);
    void deleteProject(Long id);
    ProjectDTO getProjectById(Long id);
    List<ProjectDTO> getAllProjects(String search, ProjectStatus status);
}
