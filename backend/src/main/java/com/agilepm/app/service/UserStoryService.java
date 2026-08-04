package com.agilepm.app.service;

import com.agilepm.app.dto.UserStoryDTO;

import java.util.List;

public interface UserStoryService {
    UserStoryDTO createStory(UserStoryDTO storyDTO);
    UserStoryDTO updateStory(Long id, UserStoryDTO storyDTO);
    void deleteStory(Long id);
    UserStoryDTO getStoryById(Long id);
    List<UserStoryDTO> getStoriesByProject(Long projectId);
}
