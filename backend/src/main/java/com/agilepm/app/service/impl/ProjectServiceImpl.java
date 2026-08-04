package com.agilepm.app.service.impl;

import com.agilepm.app.dto.ProjectDTO;
import com.agilepm.app.entity.Project;
import com.agilepm.app.enums.ProjectStatus;
import com.agilepm.app.exception.ResourceNotFoundException;
import com.agilepm.app.mapper.ProjectMapper;
import com.agilepm.app.repository.ProjectRepository;
import com.agilepm.app.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        Project saved = projectRepository.save(project);
        return projectMapper.toDTO(saved, false);
    }

    @Override
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        existing.setName(projectDTO.getName());
        existing.setDescription(projectDTO.getDescription());
        if (projectDTO.getStatus() != null) {
            existing.setStatus(projectDTO.getStatus());
        }

        Project updated = projectRepository.save(existing);
        return projectMapper.toDTO(updated, true);
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        // Cascade delete on userStories and tasks handles hierarchy cleanup
        projectRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return projectMapper.toDTO(project, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects(String search, ProjectStatus status) {
        List<Project> projects;
        if (search != null && !search.trim().isEmpty()) {
            projects = projectRepository.findByNameContainingIgnoreCase(search.trim());
        } else if (status != null) {
            projects = projectRepository.findByStatus(status);
        } else {
            projects = projectRepository.findAll();
        }

        return projects.stream()
                .map(p -> projectMapper.toDTO(p, false))
                .collect(Collectors.toList());
    }
}
