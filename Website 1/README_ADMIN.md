# ByteBazaar Admin Dashboard

## Setup Instructions

### 1. Database Setup

Run the following SQL file to create the admins table:

```sql
source db/admin_db.sql;
```

Or manually execute the SQL commands from `db/admin_db.sql`.

### 2. Default Admin Credentials

- **Email:** admin@bytebazaar.com
- **Password:** Admin@123

**Important:** Change the default password after first login for security.

### 3. Access Admin Dashboard

1. Navigate to: `http://localhost/Projects/E-Comm-Website/Website%201/admin-login.html`
2. Enter the default credentials
3. You will be redirected to the admin dashboard

### 4. Features

#### Dashboard

- View total users, sellers, products, and orders
- Real-time statistics

#### User Management

- View all users
- Edit user information
- Activate/Deactivate users
- Delete users
- Search functionality

#### Security Features

- Session-based authentication
- Protected routes
- Admin-only access

### 5. File Structure

```
admin-login.html          # Admin login page
admin-dashboard.html      # Admin dashboard
css/admin-dashboard.css   # Dashboard styles
js/admin-login.js        # Login functionality
js/admin-dashboard.js    # Dashboard functionality
admin_login.php          # Login processing
admin_stats.php          # Statistics API
admin_get_users.php      # Get users API
admin_update_user.php    # Update user API
admin_toggle_user.php    # Toggle user status API
admin_delete_user.php    # Delete user API
check_admin.php          # Auth check
admin_logout.php         # Logout
db/admin_db.sql          # Database schema
```

### 6. Adding More Admins

To add more admin users, insert into the `admins` table:

```sql
INSERT INTO admins (email, password, is_active)
VALUES ('newemail@example.com', 'NewPassword123', 1);
```

### 7. Customization

- Update colors in `css/admin-dashboard.css`
- Modify notification styles in `js/admin-dashboard.js`
- Add more features by extending the sections

### 8. Troubleshooting

**Issue:** Cannot login

- Verify database connection in `db/db_config.php`
- Check if `admins` table exists
- Verify credentials match database

**Issue:** Statistics not loading

- Check database permissions
- Verify all tables (users, products, orders) exist

**Issue:** User management not working

- Check PHP error logs
- Verify session is working
- Check database table structure

### 9. Security Recommendations

1. Change default admin password immediately
2. Use HTTPS in production
3. Implement rate limiting for login attempts
4. Add password hashing (currently using plain text for demo)
5. Implement CSRF protection
6. Add IP whitelisting for admin access
7. Enable audit logging

### 10. Future Enhancements

- Product management interface
- Order management interface
- Analytics and reporting
- Email notifications
- Activity logs
- Role-based access control
- Two-factor authentication
