# 🎓 ProctorPlus

A comprehensive online examination system with advanced proctoring capabilities, domain-specific assessments, and robust authentication mechanisms.

## 📑 Table of Contents
- [Key Features](#-key-features)
- [Technical Stack](#%EF%B8%8F-technical-stack)
- [AI Proctoring System Components](#-ai-proctoring-system-components)
- [Project Implementation Screenshots](#-project-implementation)
- [Project Demonstration video](#project-demo)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
- [Available Scripts](#-available-scripts)
- [Development](#-development)
- [Additional Documentation](#-additional-documentation)

## 🌟 Key Features

### 📚 Multi-Domain Assessment System

Our assessment platform implements a versatile multi-domain system designed to evaluate candidates across different specializations. The system has been architected to handle three distinct domains while maintaining flexibility for future expansions.

#### Question Types

1. **Multiple Choice Questions (MCQs)**
   - Advanced randomization and time-tracking features
   - Categorized by difficulty level and topic
   - Prevents backward navigation
   - Question-specific time limits

2. **Descriptive Answers**
   - Rich text editor with auto-save functionality
   - Markdown formatting support
   - Response length and writing time tracking
   - Content preservation features

3. **Domain-Specific Challenges**
   - Technical candidates: Live coding exercises
   - Design candidates: Portfolio submissions with process documentation
   - Marketing candidates: Video presentations of campaign strategies

### 🔐 Advanced Biometric Authentication

1. **Face Registration Process**
   - Multiple facial angle capture
   - Different lighting condition support
   - Reliable reference profile creation

2. **Pre-exam Verification**
   - Thorough identity verification
   - Advanced facial recognition algorithms
   - Real-time profile matching

3. **Continuous Monitoring**
   - Periodic face matching
   - Session security maintenance
   - Prevention of candidate substitution

### 👀 Comprehensive Proctoring System

#### Visual Monitoring
- Face presence and position tracking
- Suspicious movement detection
- Multiple person detection
- Screen focus monitoring

#### Environment Control
- Fullscreen mode enforcement
- Browser tab switching prevention
- Multiple window detection
- Copy-paste restriction

#### Keystroke Analytics
- Timestamp recording for keypresses
- Typing rhythm pattern analysis
- Speed variation monitoring
- Special key combination tracking
- Backspace pattern analysis
- Automation detection
- Pattern change monitoring

#### Mouse Movement Analytics
- Continuous position tracking
- Movement trajectory analysis
- Click pattern monitoring
- Automated movement detection

#### Audio Monitoring
- Voice activity detection
- Keyword monitoring
- Background noise analysis
- Communication attempt detection

### 📊 Analytics and Reporting

#### Submission Analysis
- Response pattern tracking
- Performance metrics
- Skill evaluations
- Score distribution analysis

#### Behavioral Analysis
- Question timing metrics
- Navigation pattern tracking
- Interaction analysis
- Suspicious activity monitoring

#### Integrity Verification
- Plagiarism detection
- Content similarity analysis
- Source matching
- Activity logging

## 🛠️ Technical Stack

### Frontend
- React.js
- Context API for state management
- Face-api.js for face recognition
- React Webcam for video capture

### Backend
- Django
- Django REST Framework
- SimpleJWT for authentication
- PostgreSQL database

## 🤖 AI Proctoring System Components

### 1. Biometric Authentication System

#### Architecture
- FaceAPI.js with SSD MobileNet v1
- Real-time face detection
- CNN-based neural network

#### Technical Components
- Face Detection (SSD)
- Face Recognition (128-dimensional embeddings)
- Performance Metrics

### 2. Behavioral Analysis System

#### Core Components
- Keystroke Dynamics Analysis
- Mouse Movement Analysis
- Pattern Recognition
- Key Metrics Analysis

### 3. Audio Monitoring System

#### Speech Recognition Architecture
- Web Speech API
- NLP Pipeline
- Real-time processing
- Pattern Recognition
[Previous sections remain the same...]

### 4. AI Content Detection System
- RoBERTa-base OpenAI detector model
- Real-time content analysis pipeline
- Neural transformer-based classification
- Token-level analysis
- Confidence scoring system

## 📁 Project Implementation
Registration with compulsory face registration
![Registration](Registration.png)

Login for registered users:
![Login](login.png)

Landing page -entry point to the website
![Landing page](landingPage.png)

Test catalogue - view all available tests
![Test catalogue](Testcatalogue.png)

### Test environment

Mandatory face validation, matching with registered image
![face validation](FaceValidation.png)

Exam instructions:
![instructions](Instructions.png)

MCQ interface:
![MCQ interface](ExamInterface.png)

Descriptive question section:
![Descriptive question](descriptivequestion.png)

Coding section:
![Coding section](<Coding area.png>)

Design specific question:
![Design specific question](DesignSec.png)

Marketing specific section:
![Marketing specific section](Marketing_type.png)

Successful submission of exam:
![Successful](Completion.png)

### Violations

Exiting fullscreen:
![Exiting fullscreen](fullsccr.png)

Examinee looking away warning:
![looking away warning](lookaway.png)

Keywords heard on examinee mic:
![Keywords heard](keyword.png)

Exam termination if number of violation exceeded:
![Exam termination](Termination.png)

### Reports

Reports page:
![Reports page](Reports_page.png)

Detailed view including evaluated mcq, descriptive answers at a glance, domain specific submission, Behavioral analysis and plagiarism/AI generated content check[only accessible for users with staff access]
![Detailed view](detail_1.png)
![Detailed view](detail_2.png)

### Django admin panel
![Django admin panel](DjangoAdmin.png)

## Project demo:

[![Video Title](https://img.youtube.com/vi/Xh1uH7qQoi8&t=7s/0.jpg)](https://www.youtube.com/watch?v=Xh1uH7qQoi8&t=7s)


## 📁 Project Structure
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

## 🚀 Setup Guide

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

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
   - Add env variables to `.env` for both frontend and backend
   - Update the values

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
   - Add env variables to `.env`
   - Update values if needed

3. Start the development server:
```bash
npm run dev
```

## 📜 Available Scripts

### Backend
- `python manage.py runserver` - Starts Django development server
- `python manage.py migrate` - Run database migrations
- `python manage.py createsuperuser` - Create admin user

### Frontend
- `npm run dev` - Starts Vite development server
- `npm run build` - Builds the frontend for production
- `npm run lint` - Runs ESLint
- `npm run preview` - Preview production build locally

## 💻 Development
- Backend API runs on `http://localhost:8000`
- Frontend development server runs on `http://localhost:5173`
- Admin interface available at `http://localhost:8000/admin`

## 📚 Additional Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)