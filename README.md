# ProctorPlus

A web application built with Django REST Framework and React+Vite.

## Project Structure
```
project/
├── frontend/           # React + Vite frontend
│   ├── src/           # React source files
│   ├── public/        # Static files
│   └── ...
└── ProctorPlus/       # Django backend
    ├── hello/         # Django app
    ├── ProctorPlus/   # Django project settings
    └── ...
```

## Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

## Backend Setup

1. Create and activate virtual environment:
```bash
cd ProctorPlus
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix or MacOS
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   - Add env variables to `.env` for both frontend and/or backend
   - Update the values if needed

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
   - Add env variables to `.env` for both frontend and/or backend
   - Update the values if needed

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

Backend:
- `python manage.py runserver` - Starts Django development server
- `python manage.py migrate` - Run database migrations
- `python manage.py createsuperuser` - Create admin user

Frontend:
- `npm run dev` - Starts Vite development server
- `npm run build` - Builds the frontend for production
- `npm run lint` - Runs ESLint
- `npm run preview` - Preview production build locally

## Development

- Backend API runs on `http://localhost:8000`
- Frontend development server runs on `http://localhost:5173`
- Admin interface available at `http://localhost:8000/admin`

## Database

The project uses SQLite by default. The database file is located at `ProctorPlus/db.sqlite3`.

## Additional Documentation

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
