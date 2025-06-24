<p align="center">
  <img src="https://img.shields.io/badge/Angular-17.3.0-DD0031?style=for-the-badge&logo=angular" alt="Angular">
  <img src="https://img.shields.io/badge/Flask-3.0.2-000000?style=for-the-badge&logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/TypeScript-5.4.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Status-Production--Ready-green?style=for-the-badge" alt="Status">
</p>

<div align="center">
  <h1>🤝 CollabHub</h1>
  <p><em>Enterprise-grade collaborative task management platform with real-time synchronization and team coordination</em></p>
</div>

---

## 📋 Table of Contents
- [📖 Overview](#-overview)
- [🎯 Learning Objectives](#-learning-objectives)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [💡 Usage](#-usage)
- [🏆 Key Features](#-key-features)
- [🔧 Architecture](#-architecture)
- [🧪 Testing](#-testing)
- [📚 Resources](#-resources)
- [👥 Contributors](#-contributors)

## 📖 Overview

CollabHub is a sophisticated, full-stack collaborative task management platform designed to streamline team productivity and project coordination. Built with modern web technologies, it provides real-time task synchronization, advanced user authentication, and comprehensive project management capabilities.

The platform demonstrates enterprise-level software architecture with a robust RESTful API backend powered by Flask and SQLAlchemy, coupled with a dynamic, responsive frontend built using Angular 17. CollabHub implements advanced features including JWT-based authentication, real-time notifications, file attachment management, Google reCAPTCHA integration, and comprehensive task lifecycle management.

This project showcases full-stack development expertise, modern DevOps practices, and production-ready software engineering principles, making it an ideal demonstration of contemporary web application development and team collaboration software design.

## 🎯 Learning Objectives

Through this comprehensive full-stack project, you will master:

- **Advanced Full-Stack Development**: Complete understanding of modern web application architecture
- **RESTful API Design**: Professional API development with Flask and comprehensive endpoint management
- **Frontend Frameworks**: Advanced Angular development with TypeScript and reactive programming
- **Database Design**: Sophisticated relational database modeling with SQLAlchemy ORM
- **Authentication Systems**: JWT-based security implementation with role-based access control
- **Real-Time Communication**: WebSocket integration for live collaboration features
- **DevOps Integration**: Containerization, deployment automation, and production configuration
- **Software Engineering**: Professional code organization, testing strategies, and documentation practices

## 🛠️ Tech Stack

**Backend Technologies:**
- **Flask 3.0.2**: Modern Python web framework with comprehensive ecosystem
- **SQLAlchemy**: Advanced ORM for database operations and relationship management
- **Flask-Migrate**: Database schema version control and migration management
- **Flask-Mail**: Email service integration for notifications and communication
- **PyJWT**: JSON Web Token implementation for secure authentication
- **MySQL**: Robust relational database for production data management

**Frontend Technologies:**
- **Angular 17.3.0**: Latest Angular framework with enhanced performance and features
- **TypeScript 5.4.0**: Type-safe JavaScript with advanced language features
- **RxJS**: Reactive programming for asynchronous data handling and state management
- **Angular Calendar**: Advanced calendar components for task scheduling and visualization
- **SweetAlert2**: Professional notification and modal dialog system
- **Tailwind CSS**: Utility-first CSS framework for responsive design

**Development Tools:**
- **Angular CLI**: Comprehensive development toolkit for Angular applications
- **Flask-CORS**: Cross-Origin Resource Sharing configuration for API access
- **Google reCAPTCHA**: Advanced bot protection and security validation
- **Nginx**: High-performance web server for production deployment
- **Factory Boy**: Sophisticated test data generation and database seeding

## 📁 Project Structure

```
collabHub/
├── backend/                          # Flask API Backend
│   ├── api/                          # RESTful API endpoints
│   │   ├── auth/                     # Authentication services
│   │   ├── v1/                       # API version 1 endpoints
│   │   │   ├── task_views.py         # Task management endpoints
│   │   │   ├── user_views.py         # User management endpoints
│   │   │   └── recaptcha_views.py    # Security validation endpoints
│   │   └── response_utils.py         # API response utilities
│   ├── config/                       # Application configuration
│   │   ├── database.py               # Database connection setup
│   │   ├── config.py                 # Environment configuration
│   │   ├── mail_service.py           # Email service configuration
│   │   └── error_handlers.py         # Global error handling
│   ├── models/                       # Database models
│   │   ├── users.py                  # User data model
│   │   ├── tasks.py                  # Task data model
│   │   ├── attachments.py            # File attachment model
│   │   ├── blacklist.py              # JWT blacklist model
│   │   └── base_model.py             # Base model with common fields
│   ├── factories/                    # Test data generators
│   │   ├── users.py                  # User factory for testing
│   │   └── tasks.py                  # Task factory for testing
│   ├── migrations/                   # Database migration files
│   ├── app.py                        # Main Flask application
│   ├── requirements.txt              # Python dependencies
│   └── nginx.conf                    # Production web server config
├── frontend/                         # Angular Frontend Application
│   ├── src/
│   │   ├── app/                      # Angular application modules
│   │   │   ├── components/           # Reusable UI components
│   │   │   ├── services/             # Business logic services
│   │   │   ├── guards/               # Route protection guards
│   │   │   ├── models/               # TypeScript interfaces
│   │   │   └── interceptors/         # HTTP request interceptors
│   │   ├── assets/                   # Static assets and images
│   │   ├── environments/             # Environment configurations
│   │   └── styles/                   # Global styling files
│   ├── package.json                  # Node.js dependencies
│   ├── angular.json                  # Angular CLI configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   └── tsconfig.json                 # TypeScript configuration
├── README.md                         # Project documentation
├── LICENSE.txt                       # GNU General Public License
└── .gitignore                        # Git ignore patterns
```

## 🚀 Getting Started

### Prerequisites

**System Requirements:**
- **Node.js 18+**: JavaScript runtime for Angular development
- **Python 3.8+**: Backend runtime environment
- **MySQL 8.0+**: Database server for data persistence
- **Git**: Version control system

**Development Tools:**
- **Angular CLI**: `npm install -g @angular/cli`
- **Flask CLI**: Included with Flask installation
- **MySQL Client**: For database administration

### Backend Setup (Flask API)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/collabhub.git
   cd collabhub/backend
   ```

2. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Configure database and secrets
   echo "DB_USERNAME=your_db_username" >> .env
   echo "DB_PASSWORD=your_db_password" >> .env
   echo "DB_HOST=localhost" >> .env
   echo "DB_NAME=collabhub_db" >> .env
   echo "SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')" >> .env
   echo "MAIL_SERVER=smtp.gmail.com" >> .env
   echo "MAIL_USERNAME=your_email@gmail.com" >> .env
   echo "MAIL_PASSWORD=your_app_password" >> .env
   ```

5. **Database Initialization**
   ```bash
   # Initialize migration repository
   flask db init
   
   # Create initial migration
   flask db migrate -m "Initial migration"
   
   # Apply migrations to database
   flask db upgrade
   
   # Optional: Seed with test data
   python -c "from factories.users import generateusers; generateusers(10)"
   python -c "from factories.tasks import generatetasks; generatetasks(20)"
   ```

6. **Start Development Server**
   ```bash
   flask run --debug
   # API will be available at http://localhost:5000
   ```

### Frontend Setup (Angular Application)

1. **Navigate to Frontend Directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Update src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api/v1',
     recaptchaSiteKey: 'your_recaptcha_site_key'
   };
   ```

4. **Start Development Server**
   ```bash
   ng serve
   # Application will be available at http://localhost:4200
   ```

### Production Deployment

1. **Build Frontend for Production**
   ```bash
   cd frontend
   ng build --configuration production
   ```

2. **Configure Production Environment**
   ```bash
   # Set production environment variables
   export FLASK_ENV=production
   export DATABASE_URL=mysql://user:password@host:port/database
   ```

3. **Deploy with Nginx**
   ```bash
   # Copy nginx configuration
   sudo cp backend/nginx.conf /etc/nginx/sites-available/collabhub
   sudo ln -s /etc/nginx/sites-available/collabhub /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

## 💡 Usage

### User Registration and Authentication

1. **Account Creation**
   - Navigate to the registration page
   - Complete the secure registration form with email verification
   - Verify your account through the email confirmation link

2. **Secure Login**
   - Use your registered credentials to access the platform
   - The system implements JWT-based authentication for secure sessions
   - Optional two-factor authentication for enhanced security

### Task Management Workflow

1. **Create Tasks**
   - Access the task creation interface from the main dashboard
   - Define task details including title, description, priority, and deadlines
   - Assign multiple collaborators using user search functionality
   - Attach relevant files and documents to tasks

2. **Collaboration Features**
   - View real-time updates from team members
   - Comment and communicate within task threads
   - Track task progress and completion status
   - Receive notifications for task assignments and updates

3. **Project Organization**
   - Organize tasks using project categories and labels
   - Filter and search tasks using advanced criteria
   - Generate progress reports and analytics
   - Export task data for external reporting

## 🏆 Key Features

### 🔐 **Advanced Authentication System**
- **JWT-Based Security**: Stateless authentication with refresh token rotation
- **Email Verification**: Secure account activation with email confirmation
- **Password Security**: BCrypt hashing with configurable complexity
- **Session Management**: Automatic token refresh and secure logout

### 📋 **Comprehensive Task Management**
- **Task Lifecycle**: Complete CRUD operations with status tracking
- **Multi-User Assignment**: Flexible collaborator assignment and role management
- **Priority System**: Configurable priority levels with visual indicators
- **Deadline Management**: Due date tracking with automated reminders
- **File Attachments**: Secure file upload and management system

### 🎨 **Modern User Interface**
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-Time Updates**: Live synchronization using WebSocket connections
- **Calendar Integration**: Advanced calendar views for task scheduling
- **Notification System**: In-app and email notifications for important events
- **Dark/Light Themes**: User-customizable interface themes

### 🔒 **Enterprise Security**
- **Google reCAPTCHA**: Advanced bot protection and spam prevention
- **Input Validation**: Comprehensive server-side and client-side validation
- **CORS Configuration**: Secure cross-origin resource sharing
- **Error Handling**: Graceful error management with user-friendly messages
- **Audit Logging**: Comprehensive activity tracking and security monitoring

### 📊 **Analytics and Reporting**
- **Task Analytics**: Progress tracking and completion statistics
- **Team Performance**: Collaboration metrics and productivity insights
- **Export Capabilities**: Data export in multiple formats (JSON, CSV, PDF)
- **Custom Reports**: Configurable reporting with date range filtering

## 🔧 Architecture

### System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Angular 17 SPA]
        B[TypeScript Services]
        C[RxJS State Management]
        D[Angular Router]
    end
    
    subgraph "API Gateway"
        E[Flask Application]
        F[CORS Middleware]
        G[JWT Authentication]
        H[Request Validation]
    end
    
    subgraph "Business Logic"
        I[Task Management API]
        J[User Management API]
        K[Authentication API]
        L[File Upload API]
    end
    
    subgraph "Data Layer"
        M[SQLAlchemy ORM]
        N[MySQL Database]
        O[File Storage System]
        P[Email Service]
    end
    
    subgraph "Security Layer"
        Q[JWT Token Management]
        R[Google reCAPTCHA]
        S[Input Validation]
        T[HTTPS Encryption]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> J
    G --> K
    H --> L
    
    I --> M
    J --> N
    K --> O
    L --> P
    
    Q --> G
    R --> H
    S --> I
    T --> E
```

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=app --cov-report=html

# Generate test data
python -c "from factories.users import generateusers; generateusers(50)"
python -c "from factories.tasks import generatetasks; generatetasks(100)"
```

### Frontend Testing
```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Run tests with coverage
ng test --code-coverage
```

## 📚 Resources

### Documentation
- **[Flask Documentation](https://flask.palletsprojects.com/)** - Backend framework documentation
- **[Angular Documentation](https://angular.io/docs)** - Frontend framework guide
- **[SQLAlchemy Documentation](https://docs.sqlalchemy.org/)** - Database ORM reference
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript language guide

### Related Projects
- **[Task Manager Pro](https://github.com/example/task-manager-pro)** - Advanced task management system
- **[Team Collaboration Hub](https://github.com/example/team-collab)** - Enterprise collaboration platform
- **[Project Management Suite](https://github.com/example/pm-suite)** - Comprehensive project management

### Learning Resources
- **[Full-Stack Development Course](https://example.com/fullstack)** - Complete web development curriculum
- **[Angular Advanced Patterns](https://example.com/angular-patterns)** - Advanced Angular development
- **[Flask RESTful API Guide](https://example.com/flask-api)** - Professional API development

## 👥 Contributors

<div align="center">

| Role | Contributor | Contact |
|------|-------------|---------|
| **Lead Developer** | Chigbu Joshua | [GitHub Profile](https://github.com/jukwamike) |
| **Full-Stack Engineer** | Chigbu Joshua | [LinkedIn](https://linkedin.com/in/chigbu-joshua) |
| **Project Architect** | Chigbu Joshua | [Email](mailto:chigbujoshua@gmail.com) |

</div>

### Contributing

We welcome contributions from the community! Here's how you can contribute:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/collabhub.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open Pull Request**
   - Describe your changes in detail
   - Include screenshots if applicable
   - Reference any related issues

### Code of Conduct
- Write clean, maintainable code
- Follow existing code style and conventions
- Include tests for new features
- Update documentation as needed
- Be respectful in all interactions

---

<div align="center">
  <p><strong>🚀 Ready to collaborate?</strong></p>
  <p><em>CollabHub - Where teams unite and productivity soars</em></p>
  
  **[📖 Architecture Guide](ARCHITECTURE.md)** • **[📋 Skills Index](SKILLS-INDEX.md)** • **[👥 Authors](AUTHORS.md)**
</div>
