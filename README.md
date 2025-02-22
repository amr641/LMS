# LMS Project

## Overview
The Learning Management System (LMS) is a backend application built with TypeScript, Node.js, and MySQL. It provides an API for managing courses, enrollments, and user authentication.

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

