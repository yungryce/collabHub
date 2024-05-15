# CollabHub

## Introduction

CollabHub is a collaborative task management platform designed to help teams organize and track their tasks efficiently. It allows users to create, update, and manage tasks, and assign them to multiple collaborators. The platform is built using Angular for the frontend and Flask for the backend.

- **Deployed Site:** [CollabHub](http://your-deployed-site-url.com)
- **Project Blog Article:** [Final Project Blog Article](http://your-blog-article-url.com)
- **Author(s) LinkedIn:**
  - [Chigbu Joshua](https://www.linkedin.com/in/chxgbx)

## Installation

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- Angular CLI
- Python 3.x
- pip

### Backend (Flask)

1. Clone the repo
   ```sh
   git clone https://github.com/yourusername/collabhub.git
   ```
2. Navigate to the backend directory
   ```sh
   cd collabhub/CollabHub_flask_api
   ```
3.  Setup virtual environment and activate it
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```
4.  Install the required packages
    ```sh
    pip install -r requirements.txt
    ```
5. Set up the environment variables (create a .env file) and jwt SECRET_KEY
    ```sh
    touch .env
    DB_USERNAME=
    DB_PASSWORD=
    DB_HOST=
    DB_NAME=
    DATABASE_URL=
    SECRET_KEY=
    ```
6.  Initialize the database
    ```sh
    flask db init
    flask db migrate
    flask db upgrade
    ```
7.  Run the Flask application
    ```sh
    flask run
    ```

### Frontend (Angular)

1.  Navigate to the frontend directory
    ```sh
    cd ../frontend
    ```
2.  Install the required packages
    ```sh
    npm install
    ```
3.   Run the Angular application
    ```sh
    ng serve
    ```

### Usage
  Register and login to your account.
  Create a new task by clicking the "Create Task" button.
  Assign collaborators by entering their user IDs.
  View and manage your tasks on the dashboard.
  Contributing
  Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

### Related Projects
Here are some related projects that might interest you:

Task Manager Pro
Team Task Tracker

### Licensing
Distributed under the MIT License. See LICENSE for more information.
