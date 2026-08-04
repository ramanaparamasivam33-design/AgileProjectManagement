package com.agilepm.app.controller;

import com.agilepm.app.dto.ApiResponse;
import com.agilepm.app.dto.DashboardStatsDTO;
import com.agilepm.app.service.DashboardService;
import com.agilepm.app.service.OverdueSchedulerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard API", description = "Endpoints for aggregated project stats, charts, recent activities, and async task triggers.")
public class DashboardController {

    private final DashboardService dashboardService;
    private final OverdueSchedulerService overdueSchedulerService;

    @GetMapping("/stats")
    @Operation(summary = "Get Dashboard Stats", description = "Retrieves aggregated metrics, task status breakdown, project completion progress, and recent activities.")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard metrics fetched successfully"));
    }

    @PostMapping("/trigger-overdue-check")
    @Operation(summary = "Trigger Async Overdue Task Check", description = "Manually triggers the background Spring Scheduler workflow to detect overdue tasks, update status, log event, and generate a summary report.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerOverdueCheck() {
        Map<String, Object> result = overdueSchedulerService.processOverdueTasks();
        return ResponseEntity.ok(ApiResponse.success(result, "Async overdue task scan executed"));
    }
}
