-- Create the products table structure
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_sku` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `rating` DECIMAL(3, 1) DEFAULT 0.0,
  `image` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `badge` VARCHAR(50),
  `description` TEXT,
  `date_added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the product data
INSERT INTO `products` (`product_sku`, `title`, `price`, `rating`, `image`, `category`, `badge`, `description`) VALUES
('premium-headphones', 'Premium Headphones', 99.99, 4.2, 'https://blobcdn.same.energy/a/35/c9/35c93bd71cf4e6e84dc0e8392b8ac13d620be867', 'electronics', 'New', 'High-quality wireless headphones with noise cancellation and premium sound quality.'),
('smart-watch', 'Smart Watch', 199.99, 4.8, 'https://blobcdn.same.energy/a/aa/df/aadf17fbbcb0b27b77c266eeef9bce73e51c4127', 'electronics', 'Best Seller', 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.'),
('designer-backpack', 'Designer Backpack', 79.99, 4.1, 'https://blobcdn.same.energy/a/6a/b0/6ab02c96c2fbe6c248cbeba571fb96273e0e0a7a', 'fashion', NULL, 'Stylish and durable backpack for everyday use with multiple compartments.'),
('wireless-speaker', 'Wireless Speaker', 149.99, 4.9, 'https://blobcdn.same.energy/b/ee/3d/ee3d982582428fc8af247e35291c30051d6acf05', 'electronics', 'Sale', 'Portable Bluetooth speaker with excellent sound quality and waterproof design.'),
('gaming-keyboard', 'Gaming Keyboard', 129.99, 4.7, 'https://blobcdn.same.energy/a/9f/ec/9fec7195862d1e0ce4e502e7a52940e1463dd60b', 'electronics', NULL, 'Mechanical gaming keyboard with RGB lighting and customizable keys.'),
('fitness-tracker', 'Fitness Tracker', 89.99, 4.3, 'https://blobcdn.same.energy/b/8a/ad/8aad3251eaac9ebcf50038c4fcd70fd32290839a', 'sports', NULL, 'Advanced fitness tracker with sleep monitoring and step counting.'),
('coffee-maker', 'Coffee Maker', 159.99, 4.5, 'https://placehold.co/250x250/ff9771/ffffff?text=Coffee+Maker', 'home', NULL, 'Premium coffee maker with programmable features and thermal carafe.'),
('desk-lamp', 'Desk Lamp', 49.99, 4.6, 'https://placehold.co/250x250/ff9771/ffffff?text=Desk+Lamp', 'home', NULL, 'LED desk lamp with adjustable brightness and USB charging port.'),
('yoga-mat', 'Yoga Mat', 29.99, 4.4, 'https://placehold.co/250x250/ff9771/ffffff?text=Yoga+Mat', 'sports', NULL, 'Non-slip yoga mat for comfortable workouts and meditation.'),
('phone-case', 'Phone Case', 19.99, 4.8, 'https://placehold.co/250x250/ff9771/ffffff?text=Phone+Case', 'electronics', NULL, 'Protective phone case with card holder and shock absorption.'),
('running-shoes', 'Running Shoes', 119.99, 4.7, 'https://placehold.co/250x250/ff9771/ffffff?text=Running+Shoes', 'sports', 'New', 'High-performance running shoes with advanced cushioning technology.'),
('blender', 'Professional Blender', 199.99, 4.6, 'https://placehold.co/250x250/ff9771/ffffff?text=Blender', 'home', 'Sale', 'Professional blender with multiple speed settings and durable blades.');
