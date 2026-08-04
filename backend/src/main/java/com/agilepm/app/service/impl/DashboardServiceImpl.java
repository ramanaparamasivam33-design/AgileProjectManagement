package com.agilepm.app.service.impl;

import com.agilepm.app.dto.DashboardStatsDTO;
import com.agilepm.app.entity.Project;
import com.agilepm.app.entity.Task;
import com.agilepm.app.enums.TaskStatus;
import com.agilepm.app.repository.ProjectRepository;
import com.agilepm.app.repository.TaskRepository;
import com.agilepm.app.repository.UserStoryRepository;
import com.agilepm.app.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final UserStoryRepository userStoryRepository;
    private final TaskRepository taskRepository;

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalProjects = projectRepository.count();
        long totalStories = userStoryRepository.count();
        long totalTasks = taskRepository.count();

        List<Task> allTasks = taskRepository.findAll();
        long completedTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long pendingTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO || t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long overdueTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.OVERDUE).count();

        Map<String, Long> taskStatusCounts = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            long cnt = allTasks.stream().filter(t -> t.getStatus() == status).count();
            taskStatusCounts.put(status.name(), cnt);
        }

        List<Project> projects = projectRepository.findAll();
        List<DashboardStatsDTO.ProjectProgressSummary> summaries = new ArrayList<>();

        for (Project project : projects) {
            int projTotalTasks = 0;
            int projCompletedTasks = 0;

            if (project.getUserStories() != null) {
                for (var story : project.getUserStories()) {
                    if (story.getTasks() != null) {
                        projTotalTasks += story.getTasks().size();
                        projCompletedTasks += (int) story.getTasks().stream()
                                .filter(t -> t.getStatus() == TaskStatus.DONE)
                                .count();
                    }
                }
            }

            double pct = projTotalTasks > 0 ? (double) projCompletedTasks / projTotalTasks * 100.0 : 0.0;

            summaries.add(DashboardStatsDTO.ProjectProgressSummary.builder()
                    .id(project.getId())
                    .name(project.getName())
                    .status(project.getStatus().name())
                    .totalTasks(projTotalTasks)
                    .completedTasks(projCompletedTasks)
                    .completionPercentage(Math.round(pct * 10.0) / 10.0)
                    .build());
        }

        // Recent activity feed compiled from latest tasks and projects
        List<DashboardStatsDTO.RecentActivityDTO> activities = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        allTasks.stream()
                .sorted(Comparator.comparing(Task::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .forEach(t -> activities.add(DashboardStatsDTO.RecentActivityDTO.builder()
                        .type("TASK")
                        .title(t.getTitle())
                        .action("Updated status to " + t.getStatus())
                        .status(t.getStatus().name())
                        .timestamp(t.getUpdatedAt() != null ? t.getUpdatedAt().format(fmt) : "")
                        .build()));

        return DashboardStatsDTO.builder()
                .totalProjects(totalProjects)
                .totalStories(totalStories)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .overdueTasks(overdueTasks)
                .taskStatusCounts(taskStatusCounts)
                .projectProgressSummaries(summaries)
                .recentActivities(activities)
                .build();
    }
}
