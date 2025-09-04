# Todo List Application

This is a modern todo list web application built with:
- **Frontend**: Angular (latest) with signals for reactive state management
- **Backend**: Node.js with Express for RESTful API
- **Architecture**: Full-stack application with separate client and server folders

## Development Guidelines

- Use Angular signals for state management instead of traditional RxJS where appropriate
- Follow modern Angular best practices with standalone components
- Use TypeScript throughout both frontend and backend
- Implement proper error handling and validation
- Use modern ES6+ features and async/await patterns

## Project Structure
- `/frontend` - Angular frontend application
- `/backend` - Node.js backend API
- Each folder has its own package.json and dependencies

## API Endpoints
- GET /api/todos - Get all todos
- POST /api/todos - Create new todo
- PUT /api/todos/:id - Update todo
- DELETE /api/todos/:id - Delete todo

## Features
- Add new todos
- Mark todos as complete/incomplete
- Edit existing todos
- Delete todos
- Responsive design
