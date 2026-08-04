package com.agilepm.app.repository;

import com.agilepm.app.entity.UserStory;
import com.agilepm.app.enums.StoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
    List<UserStory> findByProjectId(Long projectId);
    List<UserStory> findByProjectIdAndStatus(Long projectId, StoryStatus status);
}
