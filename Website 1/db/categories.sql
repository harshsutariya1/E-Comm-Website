-- Create the categories table
-- This table will store unique categories for the products.
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL-friendly version of the name',
  `description` TEXT,
  `image_url` VARCHAR(255) COMMENT 'Link to an image representing the category',
  `icon_class` VARCHAR(100) COMMENT 'Font Awesome class for an icon, e.g., fas fa-tshirt',
  `product_count` INT NOT NULL DEFAULT 0 COMMENT 'Caches the number of products in this category',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial categories
-- These categories correspond to the ones used in your products table and navigation.
INSERT INTO `categories` (`name`, `slug`, `image_url`, `icon_class`) VALUES
('Fashion', 'fashion', 'https://placehold.co/300x200/ff6b35/ffffff?text=Fashion', 'fas fa-tshirt'),
('Electronics', 'electronics', 'https://placehold.co/300x200/ff6b35/ffffff?text=Electronics', 'fas fa-laptop'),
('Home & Garden', 'home-garden', 'https://placehold.co/300x200/ff6b35/ffffff?text=Home', 'fas fa-home'),
('Sports', 'sports', 'https://placehold.co/300x200/ff6b35/ffffff?text=Sports', 'fas fa-dumbbell'),
('Books', 'books', 'https://placehold.co/300x200/ff6b35/ffffff?text=Books', 'fas fa-book'),
('Toys', 'toys', 'https://placehold.co/300x200/ff6b35/ffffff?text=Toys', 'fas fa-gamepad'),
('Automotive', 'automotive', 'https://placehold.co/300x200/ff6b35/ffffff?text=Automotive', 'fas fa-car'),
('Art & Crafts', 'art-crafts', 'https://placehold.co/300x200/ff6b35/ffffff?text=Art', 'fas fa-palette');

