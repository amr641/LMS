# LMS Project

## Overview
The Learning Management System (LMS) is a backend application built with TypeScript, Node.js, and MySQL. The LMS supports PayPal for payments, Cloudinary for media storage, TypeORM for database management, and PDFKit for certificate generation. It uses Passport for Google OAuth authentication and Jest for unit testing.

### Models
The system includes the following models:
- User: Manages authentication and user roles.
- Category: Organizes courses into different categories.
- Course: Represents courses with details such as title, description, and instructor.
- Payment: Handles transactions, supporting PayPal integration.
- Enrollment: Tracks user enrollments in courses.
- Material: Stores learning materials and resources.
- Assignment: Manages assignments given to users.
- Submission: Tracks user submissions for assignments.

## Prerequisites
To run this project, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/lms-project.git
cd lms-project
```

### 2. Create an `.env` File
Create a `.env` file in the project root and configure your database credentials:

```sh
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=lms
```

### 3. Run with Docker Compose
Run the following command to start the application and database:
```sh
docker-compose up -d
```
This will spin up a MySQL container along with the application.

### 4. Run Database Migrations
Once the containers are running, execute the migrations:
```sh
docker exec -it lms-app npm run typeorm migration:run
```

## Stopping the Application
To stop and remove the running containers, use:
```sh
docker-compose down
```

## Contributing
Feel free to submit issues or pull requests to improve the project.

