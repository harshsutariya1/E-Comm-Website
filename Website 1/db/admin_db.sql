CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin (password: Admin@123 - plain text)
-- Use INSERT IGNORE to prevent duplicate entry errors
INSERT IGNORE INTO `admins` (`email`, `password`) VALUES
('admin@bytebazaar.com', 'Admin@123');
