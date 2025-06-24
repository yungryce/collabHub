# CollabHub Frontend

[![Angular](https://img.shields.io/badge/Angular-17.3.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.3-cyan.svg)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8.0-purple.svg)](https://rxjs.dev/)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Components](#components)
- [Services](#services)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

The CollabHub Frontend is a modern Angular 17 application providing a comprehensive user interface for collaborative task management. Built with standalone components, reactive programming patterns, and modern UI/UX principles using TailwindCSS.

### Purpose
- **Task Management**: Intuitive interface for creating, managing, and tracking tasks
- **User Authentication**: Secure login/register with role-based access control
- **Collaboration**: Real-time task assignment and status tracking
- **Calendar Integration**: Visual task scheduling and timeline management
- **Responsive Design**: Mobile-first approach with modern UI components

## Features

### 🔐 Authentication & User Management
- User registration with email verification
- Secure login with JWT token management
- Profile management and user settings
- Role-based access control (Admin, Developer, User)
- Protected routes with authentication guards

### 📋 Task Management
- Create, edit, and delete tasks
- Task status tracking (Start, Pause, In Progress, Done, Close)
- Task assignment to multiple users
- Due date management and reminders
- Task filtering and search capabilities

### 📅 Calendar Integration
- Visual task timeline using Angular Calendar
- Due date visualization
- Task scheduling interface
- Date-based task filtering

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Modern component architecture
- Interactive alerts with SweetAlert2
- Form validation and user feedback
- Loading states and error handling

### 🔒 Security Features
- Google reCAPTCHA integration for form protection
- HTTP interceptors for secure API communication
- Token-based authentication
- Input validation and sanitization

## Tech Stack

### Core Framework
- **Angular 17.3.0**: Modern framework with standalone components
- **TypeScript 5.4.2**: Type-safe development
- **RxJS 7.8.0**: Reactive programming and state management

### UI & Styling
- **TailwindCSS 3.4.3**: Utility-first CSS framework
- **Angular Material**: UI component library (if used)
- **SweetAlert2 11.10.8**: Beautiful alert dialogs

### Third-Party Libraries
- **Angular Calendar 0.31.1**: Calendar and date management
- **ng-recaptcha 13.2.1**: Google reCAPTCHA integration
- **date-fns 3.6.0**: Modern date utility library

### Development Tools
- **Angular CLI 17.3.5**: Development tooling and build system
- **Karma & Jasmine**: Unit testing framework
- **TypeScript ESLint**: Code quality and linting

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── Auth/                    # Authentication module
│   │   │   ├── login/              # Login component
│   │   │   ├── register/           # Registration component
│   │   │   ├── profile/            # User profile component
│   │   │   ├── verification/       # Email verification
│   │   │   ├── auth.service.ts     # Authentication service
│   │   │   ├── auth.guard.ts       # Route protection
│   │   │   └── auth.interceptor.ts # HTTP auth interceptor
│   │   ├── Task/                   # Task management module
│   │   │   ├── new-tasks/          # Create new tasks
│   │   │   ├── all-tasks/          # All tasks view
│   │   │   ├── ongoing-tasks/      # Active tasks
│   │   │   ├── paused-tasks/       # Paused tasks
│   │   │   ├── completed-tasks/    # Completed tasks
│   │   │   ├── task/               # Individual task view
│   │   │   ├── tasks-parent/       # Task container component
│   │   │   ├── task.service.ts     # Task API service
│   │   │   └── task-user-utils.service.ts # Task utilities
│   │   ├── calendar/               # Calendar component
│   │   ├── dashboard/              # Main dashboard
│   │   ├── home/                   # Landing page
│   │   ├── footer/                 # Footer component
│   │   ├── app.component.ts        # Root component
│   │   ├── app.routes.ts           # Application routing
│   │   ├── app.config.ts           # Application configuration
│   │   └── shared services/        # Shared utilities
│   ├── assets/                     # Static assets
│   ├── environments/               # Environment configurations
│   └── styles.css                  # Global styles
├── angular.json                    # Angular CLI configuration
├── package.json                    # Node.js dependencies
├── tailwind.config.js              # TailwindCSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Setup & Installation

### Prerequisites
- **Node.js 18.x** or higher
- **npm 9.x** or higher
- **Angular CLI 17.x**

### Installation Steps

1. **Clone and Navigate**
   ```bash
   cd collabHub/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp src/environments/environment.template.ts src/environments/environment.ts
   
   # Configure API endpoints and keys
   nano src/environments/environment.ts
   ```

4. **Start Development Server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Access Application**
   ```
   http://localhost:4200
   ```

## Development

### Development Server
```bash
# Start dev server with hot reload
ng serve

# Start with specific port
ng serve --port 4201

# Start with host binding
ng serve --host 0.0.0.0
```

### Code Generation
```bash
# Generate new component
ng generate component feature/component-name

# Generate service
ng generate service services/service-name

# Generate guard
ng generate guard guards/guard-name

# Generate interceptor
ng generate interceptor interceptors/interceptor-name
```

### Development Workflow
1. **Feature Development**: Create feature branches for new functionality
2. **Component Structure**: Follow Angular style guide for component organization
3. **Service Layer**: Implement services for API communication and state management
4. **Type Safety**: Leverage TypeScript for robust development
5. **Reactive Programming**: Use RxJS patterns for data flow

## Build & Deployment

### Build Commands
```bash
# Development build
ng build

# Production build
ng build --configuration production

# Build with custom configuration
ng build --configuration staging
```

### Build Optimization
- **Tree Shaking**: Automatic removal of unused code
- **Bundle Optimization**: Webpack optimization for smaller bundles
- **Lazy Loading**: Route-based code splitting
- **Service Workers**: Optional PWA support

### Deployment Options
- **Static Hosting**: Deploy dist/ folder to CDN or static hosting
- **Docker**: Containerized deployment with Nginx
- **CI/CD**: Integration with build pipelines

## Components

### Authentication Components
- **LoginComponent**: User authentication interface
- **RegisterComponent**: New user registration with validation
- **ProfileComponent**: User profile management
- **VerificationComponent**: Email verification handling

### Task Management Components
- **TasksParentComponent**: Main task container with routing
- **NewTasksComponent**: Task creation interface
- **AllTasksComponent**: Complete task listing
- **OngoingTasksComponent**: Active tasks view
- **PausedTasksComponent**: Paused tasks management
- **CompletedTasksComponent**: Completed tasks archive
- **TaskComponent**: Individual task detail view

### Shared Components
- **DashboardComponent**: Main application dashboard
- **HomeComponent**: Landing page component
- **CalendarComponent**: Task calendar integration
- **FooterComponent**: Application footer

## Services

### Core Services
- **AuthService**: Authentication and user management
- **TaskService**: Task CRUD operations and state management
- **AlertService**: Notification and alert handling
- **LoggingService**: Application logging and error tracking
- **RecaptchaService**: Google reCAPTCHA integration

### Utility Services
- **DateTimeUtilsService**: Date formatting and manipulation
- **TaskUserUtilsService**: Task-user relationship utilities
- **ErrorService**: Centralized error handling

### HTTP Interceptors
- **AuthInterceptor**: Automatic token attachment and refresh
- **ErrorInterceptor**: Global error handling and logging

## Testing

### Unit Testing
```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run tests in CI mode
ng test --watch=false --browsers=ChromeHeadless
```

### Testing Framework
- **Jasmine**: Testing framework for behavior-driven development
- **Karma**: Test runner for Angular applications
- **Angular Testing Utilities**: Component and service testing helpers

### Testing Strategy
- **Component Testing**: Isolated component unit tests
- **Service Testing**: Service logic and HTTP mocking
- **Integration Testing**: Component-service integration
- **E2E Testing**: End-to-end user workflow testing

## Contributing

### Development Guidelines
1. **Code Style**: Follow Angular style guide and ESLint rules
2. **Component Design**: Use standalone components and reactive patterns
3. **Type Safety**: Maintain strict TypeScript configuration
4. **Testing**: Write unit tests for new components and services
5. **Documentation**: Update documentation for new features

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation as needed
4. Submit pull request with detailed description
5. Address code review feedback

---

*Modern Angular frontend application for collaborative task management by [Jbcco](https://github.com/jukwu)*
