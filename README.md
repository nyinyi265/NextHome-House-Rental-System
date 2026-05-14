# House Rental System

A full-stack house rental management platform built with Laravel and React.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12 (PHP 8.2+) |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| Auth | Laravel Sanctum (token-based) |
| Roles | Spatie Laravel Permission |
| Admin Panel | Filament |

## Features

### Authentication & Authorization
- User registration/login with email and password
- Role-based access: Admin, Landlord, Tenant
- Password reset (forgot/reset password flow)
- Secure token-based sessions via Sanctum

### Admin
- Approve/reject landlord registration requests
- Admin dashboard for managing platform

### Landlords
- Property listings (create, edit, delete houses)
- Photo uploads and panorama support
- Manage amenities and furniture
- View and process rental applications
- Rental management (start/end, collect rent)
- Real-time notifications via SSE

### Tenants
- Browse and search properties
- View house details with 360° panorama viewer
- Apply for rentals
- Compare properties side-by-side
- My rentals and application history
- Real-time notifications via SSE

### Public
- Landing page with property showcase
- About and Contact pages

## Project Structure

```
House_Rental_System/
├── house_rental_backend/     # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/API/
│   │   │   ├── Admin/        # Admin controllers
│   │   │   ├── Landlord/     # Landlord controllers
│   │   │   └── Tenant/       # Tenant controllers
│   │   ├── Models/           # Eloquent models
│   │   └── Services/        # Business logic
│   ├── routes/api.php        # API routes
│   └── ...
├── house_rental_frontend/    # React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/        # Login, Register, Password reset
│   │   │   ├── landlord/    # Landlord dashboard, rentals
│   │   │   ├── public/      # About, Contact
│   │   │   └── tenant/      # Home, Explore, HouseDetail, Compare
│   │   ├── routes/          # React Router setup
│   │   ├── services/        # API service modules
│   │   └── context/         # Auth context provider
│   └── ...
└── package.json              # Root (shared utilities)
```

## API Endpoints

| Prefix | Description |
|--------|-------------|
| `POST api/auth/register` | User registration |
| `POST api/auth/login` | User login |
| `POST api/auth/logout` | User logout |
| `GET api/auth/me` | Get authenticated user |
| `GET api/houses` | List public houses |
| `GET api/houses/{id}` | House details |
| `GET api/tenant/houses` | Tenant house access |
| `POST api/tenant/rental-applications` | Submit rental application |
| `GET/POST api/landlord/houses` | Landlord house management |
| `POST api/admin/landlord-requests/{id}/approve` | Approve landlord |

## Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- SQLite / MySQL / PostgreSQL

### Backend Setup

```bash
cd house_rental_backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key and run migrations
php artisan key:generate
php artisan migrate

# Start development server
php artisan serve
```

### Frontend Setup

```bash
cd house_rental_frontend

# Install dependencies
npm install

# Start dev server
npm start
```

The frontend runs on `http://localhost:3000` and proxies API requests to `http://127.0.0.1:8000`.

### Using the Dev Script (Backend)

```bash
cd house_rental_backend
npm run dev
```

This runs the Laravel server, queue worker, logs watcher, and Vite bundler concurrently.

## Models

- **User** - Authentication and authorization
- **TenantProfile** / **LandlordProfile** - Extended user profiles
- **House** - Property listings
- **HousePhoto** - Property images
- **Amenty** / **Furniture** - Property features
- **Rental** - Active rental agreements
- **RentalApplication** - Tenant applications
- **CompareList** - Tenant comparison saves
- **Message** - Contact messages
- **Notification** - User notifications

## License

MIT