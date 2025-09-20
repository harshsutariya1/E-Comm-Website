-- Create the categories table
-- This table will store unique categories for the products.
CREATE TABLE `categories` (
  `c_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `image` VARCHAR(255) NULL,
  `icon_class` VARCHAR(100) NULL,
  `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `products_count` INT DEFAULT 0,
  INDEX idx_name (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores category information for the e-commerce platform.';

-- Insert initial categories
-- These categories correspond to the ones used in your products table and navigation.
INSERT INTO `categories` (`name`, `description`, `image`, `icon_class`) VALUES
('Fashion', 'Clothing, footwear, accessories, and other items related to personal style.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Fashion', 'fas fa-tshirt'),
('Electronics', 'Devices, gadgets, and equipment related to technology.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Electronics', 'fas fa-laptop'),
('Home & Garden', 'Products for home improvement, gardening, and outdoor activities.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Home', 'fas fa-home'),
('Sports', 'Equipment, apparel, and accessories for sports and fitness activities.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Sports', 'fas fa-dumbbell'),
('Books', 'Printed or digital literary works.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Books', 'fas fa-book'),
('Toys', 'Playthings for children of all ages.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Toys', 'fas fa-gamepad'),
('Automotive', 'Vehicles and related products.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Automotive', 'fas fa-car'),
('Art & Crafts', 'Creative works and DIY project supplies.', 'https://placehold.co/300x200/ff6b35/ffffff?text=Art', 'fas fa-palette');

