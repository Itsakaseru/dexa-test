# Attendee (Simple Web Attendance)

A modern Attendance Management Platform designed for efficient tracking and management of employee or student attendance. Built using React Router v7 (formerly Remix) for seamless navigation and route management. This project was developed as part of an interview test, showcasing both frontend and backend integration.

It marks my first attempt at building a simple microservices architecture and organizing the codebase using a monorepo structure. While the core features are fully implemented and ready for presentation, there are still a few minor error-handling checks on both the frontend and backend that can be easily addressed in future iterations.

## Stack's
- ShaCDN
- React Router v7 (formerly Remix)
- Typescript
- TailwindCSS
- Express.JS
- Prisma
- MySQL
- Turborepo

## Prerequisites
1. MySQL server running at localhost:3306
2. MySQL script has been applied
3. Fill out starting data in the database or by using seed data by running `pnpm run seed` for each microservices.
4. API_URL in project /web-attendance/app/api/config.ts is set to your ip address, (setting it to localhost will not work when you access the page on other devices in the network, use absolute IP address)
5. Run in development mode or build and start using command below.

## Information
`turbo dev` Run project in development moda

`turbo build` To build the project

`turbo start` Run project in production mode (Build first!)