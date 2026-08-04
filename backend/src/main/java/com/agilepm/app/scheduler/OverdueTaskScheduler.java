package com.agilepm.app.scheduler;

import com.agilepm.app.service.OverdueSchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OverdueTaskScheduler {

    private final OverdueSchedulerService overdueSchedulerService;

    // Runs every hour according to app.scheduler.overdue-cron in application.yml
    @Scheduled(cron = "${app.scheduler.overdue-cron:0 0 * * * ?}")
    public void scheduleOverdueTaskCheck() {
        log.info("[SPRING SCHEDULER TRIGGERED] Checking for overdue tasks...");
        overdueSchedulerService.processOverdueTasks();
    }
}
