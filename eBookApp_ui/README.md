# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Technology Stack
Technology                               Purpose
-----------------------------------------------------
Vite                              Development server and build tooling
React                             Component-based UI development
JavaScript / TypeScript           Application programming language
IBM Carbon Design System          UI components and design consistency
React Router                      Client-side navigation, if used

## Prerequisites

Node.js version compatible with the project's Vite version.
npm or the package manager used by the project.
Git for cloning the repository.

## Project Structure

Example structure for a Vite + React application:

eBookApp-ui/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

## Installation and Setup

1. Clone the repository
    git clone <YOUR_GIT_REPOSITORY_URL>
    cd ebook-store

2. Install dependencies
    npm install

3. Configure environment variables
   Create a local .env file using the variables documented in .env.example, if required.


## Available Scripts
Document the scripts defined in package.json.
Common Vite scripts include:
npm run dev       # Start development server
npm run build     # Create production build
npm run preview   # Preview production build locally
npm run lint      # Run linting, if configured
npm run test      # Run tests, if configured

## Production Build and Deployment

Build the application:
npm run build
Vite generates production assets in the dist/ directory by default.
To preview the build locally:
npm run preview
Document the actual hosting platform and any SPA routing or environment configuration requirements if the application is deployed.
