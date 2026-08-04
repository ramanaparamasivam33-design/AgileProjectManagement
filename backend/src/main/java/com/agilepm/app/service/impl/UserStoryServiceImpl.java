package com.agilepm.app.service.impl;

import com.agilepm.app.dto.UserStoryDTO;
import com.agilepm.app.entity.Project;
import com.agilepm.app.entity.UserStory;
import com.agilepm.app.exception.ResourceNotFoundException;
import com.agilepm.app.mapper.UserStoryMapper;
import com.agilepm.app.repository.ProjectRepository;
import com.agilepm.app.repository.UserStoryRepository;
import com.agilepm.app.service.UserStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserStoryServiceImpl implements UserStoryService {

    private final UserStoryRepository userStoryRepository;
    private final ProjectRepository projectRepository;
    private final UserStoryMapper userStoryMapper;

    @Override
    public UserStoryDTO createStory(UserStoryDTO storyDTO) {
        Project project = projectRepository.findById(storyDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent project not found with id: " + storyDTO.getProjectId()));

        UserStory story = userStoryMapper.toEntity(storyDTO, project);
        UserStory saved = userStoryRepository.save(story);
        return userStoryMapper.toDTO(saved, true);
    }

    @Override
    public UserStoryDTO updateStory(Long id, UserStoryDTO storyDTO) {
        UserStory existing = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));

        existing.setTitle(storyDTO.getTitle());
        existing.setDescription(storyDTO.getDescription());
        if (storyDTO.getPriority() != null) existing.setPriority(storyDTO.getPriority());
        if (storyDTO.getStatus() != null) existing.setStatus(storyDTO.getStatus());
        if (storyDTO.getStoryPoints() != null) existing.setStoryPoints(storyDTO.getStoryPoints());

        UserStory updated = userStoryRepository.save(existing);
        return userStoryMapper.toDTO(updated, true);
    }

    @Override
    public void deleteStory(Long id) {
        if (!userStoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("User story not found with id: " + id);
        }
        userStoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserStoryDTO getStoryById(Long id) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));
        return userStoryMapper.toDTO(story, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserStoryDTO> getStoriesByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        return userStoryRepository.findByProjectId(projectId).stream()
                .map(s -> userStoryMapper.toDTO(s, true))
                .collect(Collectors.toList());
    }
}
