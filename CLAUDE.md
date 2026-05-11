# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**LeetTrade** is a full-stack web application. The repository is organized into two main directories:

- `frontend/` — Client-side application (likely React/Next.js)
- `backend/` — Server-side API (likely Node.js/Express or similar)

Both directories are currently empty scaffolds awaiting initialization.

## Project Structure

```
/f/leetrade/
├── frontend/          # Frontend application
├── backend/           # Backend API server
├── .agents/           # Agent/skill configuration
└── skills-lock.json   # Skills lockfile
```

## Common Commands

Once the project is initialized, these are the typical commands you'll use:

### Install Dependencies
```bash
# Install all dependencies
npm install

# Or if using separate package managers
cd frontend && npm install
cd backend && npm install
```

### Development
```bash
# Start the full dev stack
npm run dev

# Or individually
cd frontend && npm run dev    # Start frontend dev server
cd backend && npm run dev     # Start backend dev server
```

### Build
```bash
# Build for production
npm run build

# Or individually
cd frontend && npm run build
cd backend && npm run build
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx jest --testPathPattern=<test-file-name>
```

### Linting & Formatting
```bash
# Lint all files
npm run lint

# Fix lint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## First Steps

1. Initialize the frontend and backend with your chosen frameworks
2. Set up environment variables (`.env` files) for both
3. Create the initial project structure and configuration files
4. Install dependencies and verify the dev servers start

## Notes

- This repo does not yet have a `package.json` at the root or in either subdirectory
- No git history exists yet — initialize with `git init` once ready
- The `.agents/` directory contains skill configurations for agent tooling