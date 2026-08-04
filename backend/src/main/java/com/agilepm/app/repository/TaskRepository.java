package com.agilepm.app.repository;

import com.agilepm.app.entity.Task;
import com.agilepm.app.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStoryId(Long storyId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.story.project.id = :projectId")
    List<Task> findByProjectId(@Param("projectId") Long projectId);

    long countByStatus(TaskStatus status);
}
