# Auth Service Seeder

## Admin User Seeder

To seed the initial admin user, run:

```bash
npm run seed
```

### Default Admin Credentials

- **Email**: admin@hrms.com
- **Password**: Admin@123
- **Role**: admin

> **Important**: Please change the password after first login for security.

### What the Seeder Does

1. Connects to the database
2. Checks if admin user already exists
3. If not, creates a new admin user with:
   - Email: admin@hrms.com
   - Hashed password
   - Role: admin
   - Name: System Administrator
   - Active status

The seeder is idempotent - it won't create duplicate admin users if run multiple times.
