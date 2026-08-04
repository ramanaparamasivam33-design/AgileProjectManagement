package com.agilepm.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    private long totalProjects;
    private long totalStories;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;

    private Map<String, Long> taskStatusCounts;
    private Map<String, Long> storyStatusCounts;

    private List<ProjectProgressSummary> projectProgressSummaries;
    private List<RecentActivityDTO> recentActivities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectProgressSummary {
        private Long id;
        private String name;
        private String status;
        private int totalTasks;
        private int completedTasks;
        private double completionPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityDTO {
        private String type; // TASK, STORY, PROJECT
        private String title;
        private String action;
        private String status;
        private String timestamp;
    }
}
