-- Create the orders table structure
CREATE TABLE `orders` (
  `o_id` INT AUTO_INCREMENT PRIMARY KEY,
  `o_createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `o_updatedat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `p_id` INT NOT NULL,
  `p_price` DECIMAL(10, 2) NOT NULL,
  `is_delivered` BOOLEAN NOT NULL DEFAULT FALSE,
  `seller_id` INT NOT NULL,
  `buyer_rating` DECIMAL(2,1) NULL CHECK (`buyer_rating` BETWEEN 1.0 AND 5.0),
  `buyer_review_text` TEXT NULL,
  `buyer_id` INT NOT NULL,
  FOREIGN KEY (`p_id`) REFERENCES `products`(`p_id`) ON DELETE CASCADE,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`u_id`) ON DELETE CASCADE,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`u_id`) ON DELETE CASCADE,
  INDEX idx_p_id (`p_id`),
  INDEX idx_seller_id (`seller_id`),
  INDEX idx_buyer_id (`buyer_id`),
  INDEX idx_is_delivered (`is_delivered`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores order information for the e-commerce platform.';
