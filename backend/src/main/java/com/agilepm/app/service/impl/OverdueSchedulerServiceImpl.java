package com.agilepm.app.service.impl;

import com.agilepm.app.entity.Task;
import com.agilepm.app.enums.TaskStatus;
import com.agilepm.app.repository.TaskRepository;
import com.agilepm.app.service.OverdueSchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OverdueSchedulerServiceImpl implements OverdueSchedulerService {

    private final TaskRepository taskRepository;

    @Override
    @Transactional
    public Map<String, Object> processOverdueTasks() {
        int maxRetries = 3;
        int attempt = 0;
        Exception lastException = null;

        while (attempt < maxRetries) {
            attempt++;
            try {
                log.info("[ASYNC SCHEDULER] Running overdue task detection cycle (Attempt {}/{})", attempt, maxRetries);

                LocalDate today = LocalDate.now();
                // Find all tasks where due_date < today and status is NOT DONE and NOT OVERDUE
                List<Task> overdueCandidates = taskRepository.findByDueDateBeforeAndStatusNot(today, TaskStatus.DONE);

                List<Task> newlyOverdue = new ArrayList<>();
                for (Task task : overdueCandidates) {
                    if (task.getStatus() != TaskStatus.OVERDUE) {
                        task.setStatus(TaskStatus.OVERDUE);
                        newlyOverdue.add(task);
                    }
                }

                if (!newlyOverdue.isEmpty()) {
                    taskRepository.saveAll(newlyOverdue);
                    log.warn("[ASYNC SCHEDULER] Marked {} tasks as OVERDUE: {}", 
                            newlyOverdue.size(), 
                            newlyOverdue.stream().map(Task::getTitle).toList());
                } else {
                    log.info("[ASYNC SCHEDULER] No new overdue tasks detected.");
                }

                Map<String, Object> report = new HashMap<>();
                report.put("executionTime", LocalDateTime.now());
                report.put("processedCandidatesCount", overdueCandidates.size());
                report.put("updatedOverdueCount", newlyOverdue.size());
                report.put("updatedTaskIds", newlyOverdue.stream().map(Task::getId).toList());
                report.put("status", "SUCCESS");
                report.put("attempts", attempt);

                log.info("[ASYNC SCHEDULER] Report summary generated successfully: {}", report);
                return report;

            } catch (Exception e) {
                lastException = e;
                log.error("[ASYNC SCHEDULER] Exception during overdue processing attempt {}: {}", attempt, e.getMessage(), e);
                try {
                    Thread.sleep(1000L * attempt); // Backoff retry delay
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        log.error("[ASYNC SCHEDULER] Processing failed after {} retries", maxRetries);
        Map<String, Object> failureReport = new HashMap<>();
        failureReport.put("executionTime", LocalDateTime.now());
        failureReport.put("status", "FAILED");
        failureReport.put("errorMessage", lastException != null ? lastException.getMessage() : "Unknown error");
        failureReport.put("attempts", attempt);
        return failureReport;
    }
}
