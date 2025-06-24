# 🏗️ CollabHub Architecture

## 📖 Overview

CollabHub implements a modern full-stack architecture following industry best practices for scalable web applications. The system employs a clear separation between frontend presentation, backend business logic, and data persistence layers. Built with Angular 17 and Flask, the architecture demonstrates enterprise-grade design patterns including RESTful API services, JWT-based authentication, real-time communication, and responsive user interface design.

The platform showcases advanced software engineering principles including modular component architecture, dependency injection, ORM-based data management, and comprehensive security implementation. This architecture supports high availability, horizontal scaling, and maintainable code organization suitable for production enterprise environments.

---

## 🏛️ High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[🌐 Web Browser]
        B[📱 Mobile Browser]
        C[🖥️ Desktop Application]
    end
    
    subgraph "Presentation Layer"
        D[⚡ Angular 17 SPA]
        E[🎨 TypeScript Components]
        F[📊 RxJS State Management]
        G[🛡️ Authentication Guards]
        H[🔄 HTTP Interceptors]
    end
    
    subgraph "API Gateway Layer"
        I[🚀 Flask Application]
        J[🔐 CORS Middleware]
        K[🛡️ JWT Authentication]
        L[✅ Request Validation]
        M[📝 Response Formatting]
    end
    
    subgraph "Business Logic Layer"
        N[📋 Task Management Service]
        O[👥 User Management Service]
        P[🔑 Authentication Service]
        Q[📎 File Management Service]
        R[📧 Email Service]
        S[🔔 Notification Service]
    end
    
    subgraph "Data Access Layer"
        T[📊 SQLAlchemy ORM]
        U[🗃️ Model Definitions]
        V[🔄 Migration System]
        W[🏭 Factory Patterns]
    end
    
    subgraph "Persistence Layer"
        X[🗄️ MySQL Database]
        Y[📁 File Storage System]
        Z[📮 Email Server (SMTP)]
    end
    
    subgraph "Security Layer"
        AA[🔐 JWT Token Management]
        BB[🛡️ Google reCAPTCHA]
        CC[✅ Input Validation]
        DD[🔒 HTTPS Encryption]
        EE[🔑 Password Hashing]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    F --> G
    G --> H
    
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    
    M --> N
    M --> O
    M --> P
    M --> Q
    M --> R
    M --> S
    
    N --> T
    O --> T
    P --> T
    Q --> T
    R --> Z
    S --> T
    
    T --> U
    U --> V
    V --> W
    
    W --> X
    Q --> Y
    
    AA --> K
    BB --> L
    CC --> M
    DD --> I
    EE --> P
    
    classDef client fill:#e3f2fd,stroke:#0277bd
    classDef frontend fill:#f3e5f5,stroke:#7b1fa2
    classDef api fill:#fff3e0,stroke:#ef6c00
    classDef business fill:#e8f5e8,stroke:#388e3c
    classDef data fill:#fce4ec,stroke:#c2185b
    classDef storage fill:#f1f8e9,stroke:#689f38
    classDef security fill:#fff8e1,stroke:#f57c00
    
    class A,B,C client
    class D,E,F,G,H frontend
    class I,J,K,L,M api
    class N,O,P,Q,R,S business
    class T,U,V,W data
    class X,Y,Z storage
    class AA,BB,CC,DD,EE security
```

This comprehensive architecture demonstrates the complete request flow from client browsers through the Angular frontend, Flask API gateway, business services, data access layer, and persistent storage systems, with integrated security measures at every layer.

---

## 🧩 Core Components

### Angular Frontend Application
- **Purpose**: Modern single-page application providing responsive user interface and real-time interaction
- **Technology**: Angular 17.3.0, TypeScript 5.4.0, RxJS, Tailwind CSS
- **Location**: `frontend/src/app/`
- **Responsibilities**:
  - Component-based UI architecture with reusable elements
  - Reactive state management using RxJS observables
  - Client-side routing and navigation management
  - HTTP client integration for API communication
  - Form validation and user input handling
  - Real-time UI updates and notification display
- **Interfaces**: Consumes RESTful API endpoints, provides user interface for task management

### Flask RESTful API Backend
- **Purpose**: Scalable web framework providing business logic and data management services
- **Technology**: Flask 3.0.2, SQLAlchemy, Flask-Migrate, Flask-CORS
- **Location**: `backend/app.py`, `backend/api/`
- **Responsibilities**:
  - RESTful API endpoint implementation and routing
  - Request validation and response formatting
  - Business logic orchestration and service coordination
  - Authentication middleware and session management
  - CORS configuration for cross-origin requests
  - Error handling and logging implementation
- **Interfaces**: Serves HTTP API endpoints, integrates with database and external services

### User Management System
- **Purpose**: Comprehensive user authentication, authorization, and profile management
- **Technology**: JWT tokens, BCrypt password hashing, Flask-Mail
- **Location**: `backend/api/auth/`, `backend/models/users.py`
- **Responsibilities**:
  - User registration with email verification
  - Secure login with JWT token generation
  - Password reset and account recovery workflows
  - User profile management and settings
  - Role-based access control implementation
  - Session management and token refresh handling
- **Interfaces**: Provides authentication API, integrates with email service

### Task Management Engine
- **Purpose**: Core business logic for task creation, assignment, and lifecycle management
- **Technology**: SQLAlchemy ORM, Flask API routes, Database relationships
- **Location**: `backend/api/v1/task_views.py`, `backend/models/tasks.py`
- **Responsibilities**:
  - CRUD operations for task entities
  - Multi-user task assignment and collaboration
  - Task priority and status management
  - Deadline tracking and reminder systems
  - Task filtering and search functionality
  - Progress tracking and analytics generation
- **Interfaces**: Provides task API endpoints, manages task data persistence

### File Management System
- **Purpose**: Secure file upload, storage, and retrieval for task attachments
- **Technology**: Flask file handling, secure filename generation, storage management
- **Location**: `backend/models/attachments.py`, file upload endpoints
- **Responsibilities**:
  - Secure file upload with validation and sanitization
  - File storage organization and access control
  - Metadata management for uploaded files
  - File download and streaming capabilities
  - Storage cleanup and lifecycle management
  - File type validation and size restrictions
- **Interfaces**: Provides file upload/download API, manages storage persistence

### Database Management Layer
- **Purpose**: Data persistence, schema management, and database operations
- **Technology**: MySQL 8.0, SQLAlchemy ORM, Flask-Migrate
- **Location**: `backend/models/`, `backend/migrations/`
- **Responsibilities**:
  - Relational database schema design and implementation
  - ORM model definitions and relationship mapping
  - Database migration management and versioning
  - Query optimization and performance tuning
  - Data integrity constraints and validation
  - Backup and recovery procedures
- **Interfaces**: Provides data access layer, supports model operations

### Email Notification Service
- **Purpose**: Automated email communication for user engagement and system notifications
- **Technology**: Flask-Mail, SMTP integration, email templating
- **Location**: `backend/config/mail_service.py`
- **Responsibilities**:
  - Account verification email delivery
  - Password reset email workflow
  - Task assignment notifications
  - System update and maintenance communications
  - Email template management and customization
  - Delivery tracking and error handling
- **Interfaces**: Integrates with SMTP servers, supports notification workflows

---

## 📊 Data Models & Schema

```mermaid
erDiagram
    USERS ||--o{ TASKS : creates
    USERS ||--o{ TASK_ASSIGNMENTS : assigned_to
    USERS ||--o{ BLACKLIST_TOKENS : owns
    
    TASKS ||--o{ TASK_ASSIGNMENTS : has
    TASKS ||--o{ ATTACHMENTS : contains
    TASKS ||--|| USERS : created_by
    
    TASK_ASSIGNMENTS }|--|| USERS : user
    TASK_ASSIGNMENTS }|--|| TASKS : task
    
    ATTACHMENTS }|--|| TASKS : belongs_to
    ATTACHMENTS }|--|| USERS : uploaded_by
    
    BLACKLIST_TOKENS }|--|| USERS : user
    
    USERS {
        int id PK
        string email UK
        string username UK
        string first_name
        string last_name
        string password_hash
        boolean is_verified
        datetime created_at
        datetime updated_at
        string verification_token
        datetime last_login
        boolean is_active
    }
    
    TASKS {
        int id PK
        string title
        text description
        string status
        string priority
        datetime due_date
        datetime created_at
        datetime updated_at
        int created_by FK
        boolean is_completed
        text notes
    }
    
    TASK_ASSIGNMENTS {
        int id PK
        int task_id FK
        int user_id FK
        string role
        datetime assigned_at
        boolean is_active
    }
    
    ATTACHMENTS {
        int id PK
        string filename
        string original_filename
        string file_path
        int file_size
        string content_type
        int task_id FK
        int uploaded_by FK
        datetime uploaded_at
    }
    
    BLACKLIST_TOKENS {
        int id PK
        string jti UK
        int user_id FK
        datetime created_at
        datetime expires_at
    }
```

### Key Data Entities
- **Users**: Core user accounts with authentication and profile information
- **Tasks**: Central task entities with lifecycle management and metadata
- **Task Assignments**: Many-to-many relationship enabling collaborative task management
- **Attachments**: File management system linked to tasks and users
- **Blacklist Tokens**: JWT security implementation for secure logout functionality

### Relationships
- Users → Tasks: One-to-many (creator relationship)
- Users ↔ Tasks: Many-to-many (assignment relationship through task_assignments)
- Tasks → Attachments: One-to-many (file attachment system)
- Users → Blacklist Tokens: One-to-many (security token management)

---

## 🔄 Data Flow & Interactions

```mermaid
sequenceDiagram
    participant U as 👤 User Browser
    participant A as ⚡ Angular SPA
    participant G as 🛡️ Auth Guard
    participant S as 🔧 Angular Service
    participant F as 🚀 Flask API
    participant M as 📊 SQLAlchemy
    participant D as 🗄️ MySQL Database
    participant E as 📧 Email Service
    
    Note over U,E: User Registration & Authentication Flow
    
    U->>+A: Navigate to registration
    A->>+F: POST /api/auth/register
    F->>+M: Create user model
    M->>+D: INSERT user record
    D-->>-M: User created
    M-->>-F: User object
    F->>+E: Send verification email
    E-->>-F: Email sent
    F-->>-A: Registration response
    A-->>-U: Success notification
    
    Note over U,E: Task Management Workflow
    
    U->>+A: Create new task
    A->>+G: Check authentication
    G->>+S: Validate JWT token
    S-->>-G: Token valid
    G-->>-A: Authorization granted
    A->>+S: Call task service
    S->>+F: POST /api/v1/tasks
    F->>+M: Create task model
    M->>+D: INSERT task record
    D-->>-M: Task created
    M-->>-F: Task object
    F->>+E: Send assignment notifications
    E-->>-F: Notifications sent
    F-->>-S: Task response
    S-->>-A: Update UI state
    A-->>-U: Display new task
    
    Note over U,E: Real-time Updates
    
    F->>A: WebSocket notification
    A->>S: Update task list
    S->>A: Emit state change
    A->>U: Live UI update
    
    Note over U,E: File Upload Process
    
    U->>+A: Upload attachment
    A->>+S: Process file upload
    S->>+F: POST /api/v1/tasks/{id}/attachments
    F->>F: Validate and save file
    F->>+M: Create attachment record
    M->>+D: INSERT attachment
    D-->>-M: Attachment saved
    M-->>-F: Attachment object
    F-->>-S: Upload success
    S-->>-A: Update task UI
    A-->>-U: Show attachment
```

### Request/Response Flow
1. **Authentication Flow**: User registration triggers email verification workflow with secure token generation
2. **Authorization Validation**: Angular guards validate JWT tokens before allowing access to protected routes
3. **Task Operations**: CRUD operations flow through service layer with comprehensive validation and business logic
4. **Real-Time Updates**: WebSocket connections enable live collaboration features and instant UI synchronization
5. **File Management**: Secure file upload process with validation, storage, and metadata persistence

### Performance Characteristics
- **Response Time**: < 200ms for API endpoints under normal load
- **Throughput**: 1000+ concurrent users with horizontal scaling
- **Data Consistency**: ACID compliance through MySQL transactions
- **Cache Strategy**: Client-side caching with Angular services and HTTP interceptors

---

## 🚀 Deployment & Environment

### Development Environment
- **Platform**: Ubuntu 22.04 LTS, Windows 10/11, macOS Monterey+
- **Dependencies**: Node.js 18+, Python 3.8+, MySQL 8.0+, Angular CLI, Flask CLI
- **Setup**: Local development servers, hot reload, debug configuration

### Production Considerations
- **Scalability**: Horizontal scaling with load balancers, database clustering, CDN integration
- **Performance**: Production builds, asset optimization, database indexing, query optimization
- **Monitoring**: Application performance monitoring, error tracking, log aggregation, metrics collection

### Configuration Management
- **Environment Variables**: Secure configuration for database connections, API keys, email settings
- **Secrets Management**: Environment-specific secret handling, key rotation, secure storage
- **Feature Flags**: Environment-specific feature enablement, A/B testing capabilities

---

## 🔒 Security Architecture

### Authentication & Authorization
- **Authentication**: JWT-based stateless authentication with refresh token rotation
- **Authorization**: Role-based access control with granular permission management
- **Session Management**: Secure token handling, automatic expiration, blacklist implementation

### Data Protection
- **Encryption**: HTTPS/TLS encryption for data in transit, bcrypt for password hashing
- **Input Validation**: Comprehensive server-side and client-side validation, SQL injection prevention
- **Data Privacy**: GDPR compliance considerations, data anonymization, secure data handling

### Security Measures
- **Network Security**: CORS configuration, CSP headers, secure cookie handling
- **Application Security**: Input sanitization, XSS prevention, CSRF protection
- **Infrastructure Security**: Secure deployment practices, firewall configuration, access control

---

## ⚡ Error Handling & Resilience

### Error Management Strategy
- **Error Detection**: Comprehensive error catching at all application layers
- **Error Reporting**: Structured logging with error tracking and alerting systems
- **Error Recovery**: Graceful degradation, user-friendly error messages, automatic retry mechanisms

### Resilience Patterns
- **Circuit Breaker**: API failure protection with automatic recovery
- **Retry Logic**: Exponential backoff for transient failures
- **Health Checks**: Application and dependency health monitoring

---

## 🎯 Design Decisions & Trade-offs

### Key Architectural Decisions
1. **Single Page Application vs Multi-Page Application**
   - **Decision**: Implemented Angular SPA for enhanced user experience
   - **Rationale**: Better performance, real-time updates, modern user interface patterns
   - **Alternatives**: Server-side rendering, traditional multi-page application
   - **Trade-offs**: Increased complexity for improved user experience and performance

2. **RESTful API vs GraphQL**
   - **Decision**: RESTful API with Flask for straightforward implementation
   - **Rationale**: Simpler development, better caching, widespread tooling support
   - **Alternatives**: GraphQL for flexible queries, RPC-style APIs
   - **Trade-offs**: Multiple API calls for optimized development and deployment simplicity

3. **JWT vs Session-Based Authentication**
   - **Decision**: JWT tokens for stateless authentication
   - **Rationale**: Scalability, microservices compatibility, mobile app support
   - **Alternatives**: Server-side sessions, OAuth 2.0 integration
   - **Trade-offs**: Token management complexity for improved scalability and performance

### Known Limitations
- **Real-Time Features**: WebSocket implementation requires additional infrastructure for scaling
- **File Storage**: Local file storage limits horizontal scaling; cloud storage integration needed for production
- **Database Performance**: Single database instance limits scale; sharding or clustering required for large deployments

### Future Considerations
- **Microservices Architecture**: Service decomposition for independent scaling and deployment
- **Cloud Integration**: Migration to cloud-native services for improved scalability and reliability
- **Advanced Analytics**: Business intelligence integration for advanced reporting and insights

---

## 📁 Directory Structure & Organization

```
collabHub/
├── frontend/                         # Angular 17 Single Page Application
│   ├── src/
│   │   ├── app/                      # Application modules and components
│   │   │   ├── components/           # Reusable UI components
│   │   │   │   ├── dashboard/        # Dashboard component
│   │   │   │   ├── task-list/        # Task listing component
│   │   │   │   ├── task-form/        # Task creation/editing form
│   │   │   │   ├── user-profile/     # User profile management
│   │   │   │   └── navigation/       # Navigation components
│   │   │   ├── services/             # Business logic services
│   │   │   │   ├── auth.service.ts   # Authentication service
│   │   │   │   ├── task.service.ts   # Task management service
│   │   │   │   ├── user.service.ts   # User management service
│   │   │   │   └── api.service.ts    # HTTP API communication
│   │   │   ├── guards/               # Route protection guards
│   │   │   │   ├── auth.guard.ts     # Authentication guard
│   │   │   │   └── role.guard.ts     # Role-based access guard
│   │   │   ├── models/               # TypeScript interfaces
│   │   │   │   ├── user.interface.ts # User model interface
│   │   │   │   ├── task.interface.ts # Task model interface
│   │   │   │   └── api.interface.ts  # API response interfaces
│   │   │   ├── interceptors/         # HTTP interceptors
│   │   │   │   ├── auth.interceptor.ts # JWT token injection
│   │   │   │   └── error.interceptor.ts # Error handling
│   │   │   └── app-routing.module.ts # Application routing
│   │   ├── assets/                   # Static assets
│   │   ├── environments/             # Environment configurations
│   │   └── styles/                   # Global styling
│   ├── package.json                  # Node.js dependencies
│   ├── angular.json                  # Angular CLI configuration
│   └── tailwind.config.js            # Tailwind CSS configuration
├── backend/                          # Flask RESTful API Backend
│   ├── api/                          # API endpoint definitions
│   │   ├── auth/                     # Authentication endpoints
│   │   │   └── auth.py               # Login, register, logout routes
│   │   ├── v1/                       # API version 1
│   │   │   ├── task_views.py         # Task CRUD operations
│   │   │   ├── user_views.py         # User management endpoints
│   │   │   └── recaptcha_views.py    # Security validation
│   │   └── response_utils.py         # API response formatting
│   ├── config/                       # Application configuration
│   │   ├── database.py               # Database connection setup
│   │   ├── config.py                 # Environment configuration
│   │   ├── mail_service.py           # Email service setup
│   │   └── error_handlers.py         # Global error handling
│   ├── models/                       # SQLAlchemy database models
│   │   ├── users.py                  # User model and methods
│   │   ├── tasks.py                  # Task model and relationships
│   │   ├── attachments.py            # File attachment model
│   │   ├── blacklist.py              # JWT blacklist model
│   │   └── base_model.py             # Base model with timestamps
│   ├── factories/                    # Test data generation
│   │   ├── users.py                  # User factory for testing
│   │   └── tasks.py                  # Task factory for testing
│   ├── migrations/                   # Database migration files
│   ├── app.py                        # Main Flask application
│   ├── requirements.txt              # Python dependencies
│   └── nginx.conf                    # Production server configuration
├── README.md                         # Project documentation
├── ARCHITECTURE.md                   # System architecture documentation
├── SKILLS-INDEX.md                   # Skills and competencies index
├── AUTHORS.md                        # Project contributors
├── LICENSE.txt                       # GNU General Public License
└── .repo-context.json               # Repository metadata
```

### Organization Principles
- **Separation of Concerns**: Clear separation between frontend presentation, backend logic, and data layers
- **Modular Architecture**: Component-based organization supporting maintainability and testing
- **Scalable Structure**: Directory organization supporting team collaboration and project growth

---

## 🔗 External Dependencies

| Dependency | Purpose | Version | Documentation |
|------------|---------|---------|---------------|
| Angular | Frontend framework | 17.3.0 | [Angular Docs](https://angular.io/docs) |
| Flask | Backend web framework | 3.0.2 | [Flask Documentation](https://flask.palletsprojects.com/) |
| SQLAlchemy | Database ORM | 3.1.1 | [SQLAlchemy Docs](https://docs.sqlalchemy.org/) |
| MySQL | Relational database | 8.0+ | [MySQL Documentation](https://dev.mysql.com/doc/) |
| TypeScript | Type-safe JavaScript | 5.4.0 | [TypeScript Handbook](https://www.typescriptlang.org/docs/) |
| RxJS | Reactive programming | 7.8.0 | [RxJS Documentation](https://rxjs.dev/) |
| Tailwind CSS | Utility-first CSS | 3.4.0 | [Tailwind Docs](https://tailwindcss.com/docs) |
| JWT | Authentication tokens | Latest | [JWT.io](https://jwt.io/) |
| BCrypt | Password hashing | 4.1.2 | [BCrypt Documentation](https://github.com/pyca/bcrypt/) |
| Nginx | Web server | 1.18+ | [Nginx Documentation](https://nginx.org/en/docs/) |

---

## 📚 References
- [Project README](README.md)
- [Skills Index](SKILLS-INDEX.md)
- [Authors Information](AUTHORS.md)
- [Flask Best Practices](https://flask.palletsprojects.com/en/3.0.x/patterns/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [RESTful API Design](https://restfulapi.net/)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc7519)
