package com.agilepm.app.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DatabaseConfig {

    private final DataSource dataSource;

    @PostConstruct
    public void enableSQLiteForeignKeys() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("PRAGMA foreign_keys = ON;");
            log.info("SQLite Foreign Key Constraints successfully enabled.");
        } catch (Exception e) {
            log.error("Failed to enable SQLite foreign keys: {}", e.getMessage(), e);
        }
    }
}
