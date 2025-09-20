-- Create the products table structure
CREATE TABLE `products` (
  `p_id` INT AUTO_INCREMENT PRIMARY KEY,
  `p_title` VARCHAR(255) NOT NULL,
  `p_price` DECIMAL(10, 2) NOT NULL,
  `p_total_ratings` DECIMAL(3, 1) DEFAULT 0.0,
  `p_image` VARCHAR(255) NOT NULL,
  `p_category` VARCHAR(100),
  `p_badge` VARCHAR(50),
  `p_description` TEXT,
  `seller_id` INT NOT NULL,
  `p_total_sold` INT DEFAULT 0,
  `p_createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `p_updatedat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`u_id`) ON DELETE CASCADE,
  INDEX idx_category (`p_category`),
  INDEX idx_seller_id (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores product information for the e-commerce platform.';

-- Insert the product data
INSERT INTO `products` (`p_title`, `p_price`, `p_total_ratings`, `p_image`, `p_category`, `p_badge`, `p_description`, `seller_id`, `p_total_sold`) VALUES
('Premium Headphones', 99.99, 4.2, 'https://blobcdn.same.energy/a/35/c9/35c93bd71cf4e6e84dc0e8392b8ac13d620be867', 'electronics', 'New', 'High-quality wireless headphones with noise cancellation and premium sound quality.', 1, 1200),
('Smart Watch', 199.99, 4.8, 'https://blobcdn.same.energy/a/aa/df/aadf17fbbcb0b27b77c266eeef9bce73e51c4127', 'electronics', 'Best Seller', 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.', 2, 800),
('Designer Backpack', 79.99, 4.1, 'https://blobcdn.same.energy/a/6a/b0/6ab02c96c2fbe6c248cbeba571fb96273e0e0a7a', 'fashion', NULL, 'Stylish and durable backpack for everyday use with multiple compartments.', 3, 500),
('Wireless Speaker', 149.99, 4.9, 'https://blobcdn.same.energy/b/ee/3d/ee3d982582428fc8af247e35291c30051d6acf05', 'electronics', 'Sale', 'Portable Bluetooth speaker with excellent sound quality and waterproof design.', 1, 1500),
('Gaming Keyboard', 129.99, 4.7, 'https://blobcdn.same.energy/a/9f/ec/9fec7195862d1e0ce4e502e7a52940e1463dd60b', 'electronics', NULL, 'Mechanical gaming keyboard with RGB lighting and customizable keys.', 2, 900),
('Fitness Tracker', 89.99, 4.3, 'https://blobcdn.same.energy/b/8a/ad/8aad3251eaac9ebcf50038c4fcd70fd32290839a', 'sports', NULL, 'Advanced fitness tracker with sleep monitoring and step counting.', 3, 600),
('Coffee Maker', 159.99, 4.5, 'https://placehold.co/250x250/ff9771/ffffff?text=Coffee+Maker', 'home', NULL, 'Premium coffee maker with programmable features and thermal carafe.', 1, 700),
('Desk Lamp', 49.99, 4.6, 'https://placehold.co/250x250/ff9771/ffffff?text=Desk+Lamp', 'home', NULL, 'LED desk lamp with adjustable brightness and USB charging port.', 2, 400),
('Yoga Mat', 29.99, 4.4, 'https://placehold.co/250x250/ff9771/ffffff?text=Yoga+Mat', 'sports', NULL, 'Non-slip yoga mat for comfortable workouts and meditation.', 3, 300),
('Phone Case', 19.99, 4.8, 'https://placehold.co/250x250/ff9771/ffffff?text=Phone+Case', 'electronics', NULL, 'Protective phone case with card holder and shock absorption.', 1, 2000),
('Running Shoes', 119.99, 4.7, 'https://placehold.co/250x250/ff9771/ffffff?text=Running+Shoes', 'sports', 'New', 'High-performance running shoes with advanced cushioning technology.', 2, 1100),
('Professional Blender', 199.99, 4.6, 'https://placehold.co/250x250/ff9771/ffffff?text=Blender', 'home', 'Sale', 'Professional blender with multiple speed settings and durable blades.', 3, 800);
