# Ticket System – Full Development Log & Troubleshooting

This document describes the complete development process of the Ticket System project, including all configuration steps, integration issues, authentication setup, frontend/backend synchronization, and major debugging challenges encountered from day one until the current stable version.

Project Overview 

Full-stack ticket management system with authentication.

Final Stack

Backend:

Java 21

Spring Boot 3.2.5

Maven

MySQL

Hibernate (JPA)

Spring Security

JWT Authentication

Frontend:

React (Vite)

JavaScript (ES Modules)

Fetch API

LocalStorage (JWT handling)

___________________

## Phase 1 – Backend Initialization

Spring Boot Setup

Created Maven Spring Boot application with:
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
</parent>

Maven not Recognized
Issue:
mvn: command not found

Cause:
Maven not added to system PATH

Solution:

Installed Apache Maven

Added /bin directory to Windows environment variables

Restarted terminal

Verification:
mvn -v

-------------

Lombok Annotation Processor Failure
Problem:
Resolution of annotationProcessorPath dependencies failed

Cause:
Manual compiler plugin misconfiguration

Fix:
Removed custom maven-compiler-plugin configuration and used Spring Boot defaults

-------------

Database Configuration Failure
Error:
Failed to determinate a suitable driver class

Cause:
Missing datasource configuration

Fix:
application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/ticketsystem
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update

------------- 

404 Whitelabel Error

Accessing:
localhost:8080/api/tickets/hello

Returned:
404

Cause:
Controller mapping mismatch

Fix:
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @GetMapping("/hello")
    public String hello() {
        return "Ticket System is running!";
    }

------------- 

Testing POST Endpoint

Used:
Postman
curl (Git Bash)
Confirmed persistence in MySQL

___________________

## Phase 2 - JWT Authentication Implementation

Added Spring Security

Configured:

AuthenticationManager

PasswordEncoder (BCrypt)

JWT filter

Token generation service

Endpoints created:

POST /api/auth/register

POST /api/auth/login

------------- 

403 Forbidden Errors

Problem:
All protected endpoints returned 403.

Cause:
JWT not being sent in Authorization header.

Fix:
Frontend configured to send:
Authorization: Bearer <token>

------------- 

Token Not Persisting
Issue:
Frontend showed:
localStorage.getItem("token") → null

Cause:
Login function was not storing token properly

Fix:
Implemented:
export function setToken(token) {
  localStorage.setItem("token", token);
}

___________________

## Phase 3 - Frontend Integration (React + Vite)

First Integration Attempt

Frontend initially worked without authentication.

After securing backend:

All requests failed with 401 / 403.

Implemented centralized fetch wrapper:
export async function apiFetch(path, options = {}) {
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
}

-------------

Major Debugging Phase - "White Screen of Death"

This was the most complex integration stage.

Problem: Application turned completely white

Console error:
The requested module '/src/services/ticketService.js' does not provide an export named 'default'

Root Cause:
Mismatch between:

default exports

named exports

Example of breaking code:
import ticketApi from "../services/ticketService";

While file exported only: 
export async function createTicket(...)

Solution:
Standardized exports using named exports consistently across project:
import { createTicket } from "../services/ticketService";

Key Lesson:
Mixing default and named exports in ES Modules can silently break Vite rendering

-------------

Duplicate File Conflicts

Observed duplicate component files in:

/src/

/src/components/

Vite was importing outdated versions.

Fix:

Removed duplicates

Restarted Vite

Cleared node_modules/.vite cache

-------------

JSON.parse Crash in apiFetch

Problem:
Frontend crashed when backend returned plain text error instead of JSON

Original code:
const data = JSON.parse(text);

Fix:
Safe parsing logic:
try {
  data = text ? JSON.parse(text) : null;
} catch {
  data = text || null;
}

___________________

## Phase 4 - Authentication UI Refactor

Implemented: 

Login component

Register component

Auth state handling in App.jsx

Token-based session persistence

Auto logout on 401 / 403

State management:
const [isAuth, setIsAuth] = useState(!!getToken());

-------------

Final System Features

User registration
User login (JWT)
Token persistence (localStorage)
Protected API endpoints
CRUD Tickets
Pagination
Filtering by status
Search by title
Sorting
Edit modal
Delete confirmation
Auto logout on invalid token

-------------

Architecture Summary

Backend:

Stateless authentication (JWT)

Spring Security filter chain

JPA persistence

REST controllers

Frontend:

Centralized API wrapper

Token-based request interception

Auth-controlled rendering

Error-safe fetch implementation

-------------

Lessons Learned

JWT integration requires strict header formatting.

Frontend must handle both JSON and text error responses safely.

ES Module export consistency is critical.

Vite cache can cause phantom import errors.

403 errors are usually header-related.
