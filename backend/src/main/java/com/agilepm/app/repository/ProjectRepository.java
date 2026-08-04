package com.agilepm.app.repository;

import com.agilepm.app.entity.Project;
import com.agilepm.app.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByNameContainingIgnoreCase(String keyword);
}
