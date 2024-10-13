# Exercise Tracker

A simple **Exercise Tracker** built with Node.js, Express, and MongoDB. This application allows users to track their exercise routines, store user information, and view their exercise logs.

## Project Purpose

This project is part of the [FreeCodeCamp Back End Development and APIs](https://www.freecodecamp.org/learn/back-end-development-and-apis/) curriculum, demonstrating RESTful API design and database interaction.

## Features

- Create and manage user accounts.
- Log exercises with details such as description, duration, and date.
- Retrieve user exercise logs with filtering options.
- Delete all users and exercises from the database.

## API Endpoints

- **GET** `/api/users` - Retrieve all users.
- **POST** `/api/users` - Create a new user.
- **POST** `/api/users/:_id/exercises` - Log a new exercise for a user.
- **GET** `/api/users/:_id/logs` - Retrieve exercise logs for a user.
- **GET** `/api/users/delete` - Delete all users.
- **GET** `/api/exercises/delete` - Delete all exercises.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v12.x or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhishek-d-b/exercise-tracker.git
   cd exercise-tracker
   ```
