-- Create the users table
-- This table will store the primary information for all users, including customers and sellers.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Stores the hashed password',
  `user_role` ENUM('customer', 'seller', 'admin') NOT NULL DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='Stores all user accounts for the platform.';

-- Insert sample user data
-- Passwords are 'Password123' hashed. You should replace these with your own logic.
-- You can generate new hashes in PHP using: password_hash('YourPassword123', PASSWORD_DEFAULT)
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password_hash`, `user_role`) VALUES
('John', 'Doe', 'johndoe@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', 'seller'),
('Jane', 'Smith', 'janesmith@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', 'seller'),
('Peter', 'Jones', 'peterjones@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', 'seller'),
('Alice', 'Williams', 'alice@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', 'customer'),
('Bob', 'Brown', 'bob@example.com', '$2y$10$E.q5.h8.M2u5j8j/f9/g7eIX.w.Y8G1U.Z/c.9G5jO3X/e8F6o9pC', 'customer');
