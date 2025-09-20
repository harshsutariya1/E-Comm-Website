-- Create the users table
-- This table will store the primary information for all users, including customers and sellers.
CREATE TABLE `users` (
  `u_id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL COMMENT 'Stores the hashed password',
  `is_seller` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `seller_store_name` VARCHAR(100) NULL,
  `seller_profile_pic` VARCHAR(255) NULL,
  `user_profile_pic` VARCHAR(255) NULL,
  `seller_category` VARCHAR(50) NULL,
  `seller_ratings` DECIMAL(3,2) NULL DEFAULT 0.00,
  `seller_total_products` INT NULL DEFAULT 0,
  `seller_total_sells` INT NULL DEFAULT 0,
  `is_seller_active` BOOLEAN NULL DEFAULT TRUE,
  `is_user_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `total_user_orders` INT NOT NULL DEFAULT 0,
  INDEX idx_email (`email`),
  INDEX idx_is_seller (`is_seller`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores all user accounts for the platform.';

-- Insert sample user data
-- Passwords are 'Password123' hashed. You should replace these with your own logic.
-- You can generate new hashes in PHP using: password_hash('YourPassword123', PASSWORD_DEFAULT)
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `is_seller`, `seller_store_name`, `seller_profile_pic`, `user_profile_pic`, `seller_category`, `seller_ratings`, `seller_total_products`, `seller_total_sells`, `is_seller_active`, `is_user_active`, `total_user_orders`) VALUES
('John', 'Doe', 'johndoe@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', TRUE, 'Doe Electronics', 'profiles/sellers/johndoe.jpg', 'profiles/users/johndoe.jpg', 'Electronics', 4.50, 150, 1200, TRUE, TRUE, 0),
('Jane', 'Smith', 'janesmith@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', TRUE, 'Smith Books', 'profiles/sellers/janesmith.jpg', 'profiles/users/janesmith.jpg', 'Books', 4.20, 200, 800, TRUE, TRUE, 0),
('Peter', 'Jones', 'peterjones@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', TRUE, 'Jones Fashion', 'profiles/sellers/peterjones.jpg', 'profiles/users/peterjones.jpg', 'Fashion', 4.80, 300, 2500, TRUE, TRUE, 0),
('Alice', 'Williams', 'alice@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', FALSE, NULL, NULL, 'profiles/users/alice.jpg', NULL, NULL, NULL, NULL, NULL, TRUE, 5),
('Bob', 'Brown', 'bob@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', FALSE, NULL, NULL, 'profiles/users/bob.jpg', NULL, NULL, NULL, NULL, NULL, TRUE, 3);
