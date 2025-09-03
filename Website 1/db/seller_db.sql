-- Create the sellers table
-- This table will store information about the different vendors on the platform.
CREATE TABLE `sellers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE COMMENT 'Links to the main users table',
  `store_name` VARCHAR(150) NOT NULL UNIQUE,
  `profile_pic_url` VARCHAR(255),
  `category_specialty` VARCHAR(100) COMMENT 'Primary category the seller deals in',
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00 COMMENT 'Average rating from 0.00 to 5.00',
  `total_reviews` INT NOT NULL DEFAULT 0,
  `total_products` INT NOT NULL DEFAULT 0,
  `total_sales` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Allows admins to activate/deactivate sellers',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) COMMENT='Stores information about sellers on the e-commerce platform.';

-- Insert sample seller data
-- NOTE: This assumes you have users with IDs 1, 2, and 3 in your `users` table.
-- You will need to create a `users` table first if you haven't already.
INSERT INTO `sellers` (`user_id`, `store_name`, `profile_pic_url`, `category_specialty`, `rating`, `total_reviews`, `total_products`, `total_sales`) VALUES
(1, 'TechHub Store', 'https://placehold.co/80x80/ff9771/ffffff?text=TechHub', 'Electronics & Gadgets', 4.90, 1250, 2500, 15000),
(2, 'Fashion Forward', 'https://placehold.co/80x80/3498db/ffffff?text=Fashion', 'Clothing & Accessories', 4.70, 880, 1800, 12000),
(3, 'Home Essentials', 'https://placehold.co/80x80/2ecc71/ffffff?text=Home', 'Home & Garden', 4.80, 2100, 3200, 18000);
