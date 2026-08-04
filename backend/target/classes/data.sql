-- Sample Seed Data for Agile Project Management System

-- Projects
INSERT INTO projects (id, name, description, status, created_at, updated_at) VALUES
(1, 'Enterprise E-Commerce Portal', 'Next-gen online shopping platform with microservices architecture and real-time inventory.', 'IN_PROGRESS', '2026-08-01 09:00:00', '2026-08-01 09:00:00'),
(2, 'Mobile Health Tracker', 'Cross-platform mobile application for tracking daily steps, vital signs, and doctor appointments.', 'IN_PROGRESS', '2026-08-02 10:30:00', '2026-08-02 10:30:00'),
(3, 'Cloud Infrastructure Migration', 'Migrate legacy on-premise workloads to AWS cloud with automated CI/CD pipelines.', 'PLANNED', '2026-08-03 14:15:00', '2026-08-03 14:15:00');

-- User Stories for Project 1 (Enterprise E-Commerce Portal)
INSERT INTO user_stories (id, project_id, title, description, priority, status, story_points, created_at, updated_at) VALUES
(101, 1, 'User Authentication & JWT Auth', 'As a customer, I want to securely log in using email/password or OAuth2 providers.', 'HIGH', 'DONE', 5, '2026-08-01 10:00:00', '2026-08-02 12:00:00'),
(102, 1, 'Product Catalog & Search Engine', 'As a customer, I want to search and filter products by category, price, and ratings.', 'HIGH', 'IN_PROGRESS', 8, '2026-08-01 11:00:00', '2026-08-03 09:30:00'),
(103, 1, 'Shopping Cart & Checkout Flow', 'As a buyer, I want to add items to cart and complete payment via Stripe integration.', 'MEDIUM', 'TODO', 5, '2026-08-01 11:30:00', '2026-08-01 11:30:00');

-- User Stories for Project 2 (Mobile Health Tracker)
INSERT INTO user_stories (id, project_id, title, description, priority, status, story_points, created_at, updated_at) VALUES
(201, 2, 'BLE Heart Rate Monitor Sync', 'As a user, I want the app to sync heart rate readings from my smartwatch over Bluetooth.', 'HIGH', 'IN_PROGRESS', 5, '2026-08-02 11:00:00', '2026-08-03 16:00:00'),
(202, 2, 'Daily Summary Notifications', 'As a user, I want daily push notification reminders to reach my active step goal.', 'LOW', 'TODO', 2, '2026-08-02 12:00:00', '2026-08-02 12:00:00');

-- Tasks for Story 101
INSERT INTO tasks (id, story_id, title, description, status, priority, assignee, due_date, created_at, updated_at) VALUES
(1001, 101, 'Design User Entity & Auth Schema', 'Define database constraints and password hashing logic.', 'DONE', 'HIGH', 'Sarah Jenkins', '2026-08-02', '2026-08-01 10:30:00', '2026-08-02 11:00:00'),
(1002, 101, 'Implement JWT Token Generator', 'Create JWT utility methods and claims structure.', 'DONE', 'HIGH', 'Alex Rivera', '2026-08-02', '2026-08-01 11:00:00', '2026-08-02 12:00:00');

-- Tasks for Story 102
INSERT INTO tasks (id, story_id, title, description, status, priority, assignee, due_date, created_at, updated_at) VALUES
(1003, 102, 'Setup Elasticsearch Cluster', 'Configure index mapping for fast multi-attribute product search.', 'DONE', 'MEDIUM', 'Devon Vance', '2026-08-03', '2026-08-01 13:00:00', '2026-08-03 14:00:00'),
(1004, 102, 'Develop Product Filter Backend API', 'Implement search REST endpoints with pagination and sorting support.', 'IN_PROGRESS', 'HIGH', 'Sarah Jenkins', '2026-08-05', '2026-08-02 09:00:00', '2026-08-03 09:30:00'),
(1005, 102, 'Build Product Grid UI Component', 'Create dynamic React card grid with skeleton loaders.', 'TODO', 'MEDIUM', 'Emily Chen', '2026-08-06', '2026-08-02 10:00:00', '2026-08-02 10:00:00');

-- Tasks for Story 103
INSERT INTO tasks (id, story_id, title, description, status, priority, assignee, due_date, created_at, updated_at) VALUES
(1006, 103, 'Stripe Gateway Webhook Integration', 'Handle payment confirmation and charge success callbacks.', 'TODO', 'HIGH', 'Alex Rivera', '2026-08-01', '2026-08-01 14:00:00', '2026-08-01 14:00:00');

-- Tasks for Story 201
INSERT INTO tasks (id, story_id, title, description, status, priority, assignee, due_date, created_at, updated_at) VALUES
(2001, 201, 'Bluetooth Low Energy Android Driver', 'Implement native BLE scan and GATT service client.', 'IN_PROGRESS', 'HIGH', 'Devon Vance', '2026-08-04', '2026-08-02 11:30:00', '2026-08-03 16:00:00'),
(2002, 201, 'Heart Rate Time Series Chart Component', 'Render interactive SVG chart of continuous pulse rate.', 'TODO', 'LOW', 'Emily Chen', '2026-08-07', '2026-08-02 13:00:00', '2026-08-02 13:00:00');
