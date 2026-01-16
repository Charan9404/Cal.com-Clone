# Cal.com Clone - Scheduling Platform

A functional scheduling/booking web application that replicates Cal.com's design and user experience. The application allows users to create event types, set their availability, and let others book time slots through a public booking page.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://cal-com-clone-roan.vercel.app)
- **Backend API**: [Deployed on Render](https://cal-com-clone.onrender.com)

## 📋 Features

### Core Features
- ✅ **Event Types Management**: Create, edit, delete, and list event types with title, description, duration, and unique URL slug
- ✅ **Availability Settings**: Set available days of the week, time slots for each day, and timezone
- ✅ **Public Booking Page**: Calendar date picker, available time slots display, booking form, and double-booking prevention
- ✅ **Bookings Dashboard**: View upcoming and past bookings, cancel bookings

### Bonus Features
- ✅ **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- ✅ **Modern UI**: Cal.com-inspired design with smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19.2.0) - Single Page Application
- **React Router** (v7.12.0) - Client-side routing
- **Vite** (v7.2.4) - Build tool and dev server
- **Tailwind CSS** (v4.1.18) - Styling
- **Axios** (v1.13.2) - HTTP client
- **Lucide React** - Icons

### Backend
- **Python** (3.11+)
- **Django** (v6.0.1) - Web framework
- **Django REST Framework** (v3.16.1) - API framework
- **PostgreSQL** - Database
- **Gunicorn** (v23.0.0) - WSGI server
- **WhiteNoise** (v6.11.0) - Static file serving
- **django-cors-headers** (v4.9.0) - CORS handling

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📁 Project Structure

```
CalCom Clone/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # API client and utilities
│   │   └── ui/              # UI components
│   ├── public/
│   └── package.json
├── scheduling/              # Django app
│   ├── models.py           # Database models
│   ├── views.py            # API views
│   ├── serializers.py      # DRF serializers
│   ├── urls.py             # URL routing
│   └── management/
│       └── commands/
│           └── seed.py     # Database seeding command
├── server/                  # Django project settings
│   ├── settings.py         # Django configuration
│   └── urls.py            # Root URL configuration
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
├── Procfile               # Render deployment config
└── README.md              # This file
```

## 🗄️ Database Schema

### Models

**EventType**
- `title` - Event title
- `description` - Event description
- `duration_minutes` - Duration in minutes
- `slug` - Unique URL slug
- `active` - Active status
- `created_at` - Creation timestamp

**Availability**
- `timezone` - Timezone string (e.g., "Asia/Kolkata")
- `created_at` - Creation timestamp

**AvailabilityRule**
- `availability` - ForeignKey to Availability
- `weekday` - Day of week (0=Monday, 6=Sunday)
- `start_time` - Start time
- `end_time` - End time

**Booking**
- `event_type` - ForeignKey to EventType
- `booking_uid` - Unique UUID identifier
- `booker_name` - Booker's name
- `booker_email` - Booker's email
- `start_at` - Booking start time (UTC)
- `end_at` - Booking end time (UTC)
- `status` - CONFIRMED or CANCELED
- `created_at` - Creation timestamp

### Constraints
- Unique constraint on `EventType.slug`
- Unique constraint on confirmed bookings per event type and start time
- Unique constraint on `Booking.booking_uid`

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11 or higher
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "CalCom Clone"
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DJANGO_SECRET_KEY=your-secret-key-here
   DEBUG=True
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   # OR use individual DB settings:
   DB_NAME=calclone
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   CSRF_TRUSTED_ORIGINS=http://localhost:5173
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Seed sample data (optional)**
   ```bash
   python manage.py seed
   ```

7. **Create superuser (optional, for admin access)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 🚢 Deployment

### Backend (Render)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure settings:**
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn server.wsgi:application --bind 0.0.0.0:$PORT`
4. **Set environment variables:**
   - `DJANGO_SECRET_KEY` - Generate a secure key
   - `DEBUG` - Set to `False`
   - `DATABASE_URL` - PostgreSQL connection string (provided by Render if using Render PostgreSQL)
   - `ALLOWED_HOSTS` - Your Render domain (e.g., `cal-com-clone.onrender.com,.onrender.com`)
   - `CORS_ALLOWED_ORIGINS` - Your Vercel frontend URL
   - `CSRF_TRUSTED_ORIGINS` - Your Vercel frontend URL

### Frontend (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Configure settings:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Set environment variables:**
   - `VITE_API_BASE_URL` - Your Render backend URL (e.g., `https://cal-com-clone.onrender.com`)

## 📝 Assumptions

1. **No Authentication**: The application assumes a default user is logged in for the admin side. No login system is implemented.

2. **Single Availability Schedule**: The application uses a single default availability schedule. Multiple schedules per user are not supported.

3. **Timezone Handling**: All availability rules are stored in the selected timezone, but bookings are stored in UTC in the database.

4. **Public Booking**: The public booking page (`/book/:slug`) is accessible without authentication.

5. **Double Booking Prevention**: The application prevents double booking through database constraints and transaction handling.

## 🧪 Testing

### Manual Testing Checklist

1. **Event Types**
   - Create a new event type
   - Edit an existing event type
   - Delete an event type
   - Verify public booking link works

2. **Availability**
   - Set available days and time slots
   - Change timezone
   - Save and verify changes persist

3. **Public Booking**
   - Access public booking page via `/book/:slug`
   - Select a date
   - View available time slots
   - Create a booking with name and email
   - Verify confirmation page displays correctly

4. **Bookings Dashboard**
   - View upcoming bookings
   - View past bookings
   - Cancel a booking
   - Verify canceled booking status updates

## 📚 API Endpoints

### Admin Endpoints
- `GET /api/event-types/` - List all event types
- `POST /api/event-types/` - Create event type
- `GET /api/event-types/{id}/` - Get event type
- `PATCH /api/event-types/{id}/` - Update event type
- `DELETE /api/event-types/{id}/` - Delete event type
- `GET /api/availability/` - Get availability
- `PUT /api/availability/` - Update availability
- `GET /api/bookings/?type=upcoming|past` - List bookings
- `POST /api/bookings/{id}/cancel/` - Cancel booking

### Public Endpoints
- `GET /api/public/event-types/{slug}/` - Get public event type
- `GET /api/public/slots/?slug={slug}&date={date}` - Get available slots
- `POST /api/public/bookings/` - Create booking
- `GET /api/public/bookings/{uid}/` - Get booking details

## 🎨 UI/UX Design

The application closely follows Cal.com's design patterns:
- Clean, modern interface with gradient backgrounds
- Card-based layouts with subtle shadows
- Smooth transitions and hover effects
- Responsive design for all screen sizes
- Consistent color scheme (slate grays with accent colors)

## 🤝 Contributing

This is an assignment project. For questions or issues, please refer to the assignment requirements.

## 📄 License

This project is created for educational/assignment purposes.

## 👤 Author

Created as part of SDE Intern Fullstack Assignment.

---

**Note**: Make sure to set up environment variables correctly for both local development and deployment. The application requires a PostgreSQL database for production use.
