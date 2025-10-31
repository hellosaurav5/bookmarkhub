# BookmarkHub - Social Bookmarking Platform

A modern social bookmarking platform where users can share links, vote on content, and discover interesting bookmarks.

## Features

- 📚 **Public Feed**: Browse bookmarks without authentication
- 🔐 **User Authentication**: Secure registration and login
- 📝 **Create Bookmarks**: Share interesting links
- 👍👎 **Voting System**: Upvote/downvote bookmarks
- 🎨 **Modern UI**: Beautiful, responsive design

## Tech Stack

**Frontend**: Next.js 14, TypeScript, Zustand, Tailwind CSS  
**Backend**: NestJS, Fastify, TypeORM, JWT  
**Database**: PostgreSQL  
**Deployment**: Docker & Docker Compose

## Prerequisites

- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)

That's it! Everything runs in containers.

## Quick Start

### 1. Navigate to Project Directory

```bash
cd BookmarkHub
```

### 2. Start All Services

```bash
docker-compose up --build
```

This command will:
- Build the backend, frontend, and database containers
- Initialize the PostgreSQL database with the schema
- Start all services with hot-reload enabled

**First startup takes 2-3 minutes** while dependencies are installed.

### 3. Access the Application

Once you see `🚀 Application is running on: http://localhost:3001` in the logs:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### 4. Start Using BookmarkHub

1. Open http://localhost:3000
2. Click **Register** to create an account
3. Login with your credentials
4. Click **Create Bookmark** to share a link
5. Vote on bookmarks using the up/down arrows
6. Log out to view the public feed

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Rebuild After Changes

```bash
docker-compose up --build
```

## Troubleshooting

### Port Already in Use

If you see errors about ports 3000, 3001, or 5432 being in use:

1. Stop the conflicting service, or
2. Change the port mappings in `docker-compose.yml`

### Services Not Starting

```bash
# Check running containers
docker ps

# Check logs for errors
docker-compose logs -f

# Clean restart
docker-compose down
docker-compose up --build
```

### Database Issues

```bash
# Restart database
docker-compose restart postgres

# Check database logs
docker logs bookmarkhub-postgres
```

### Clear Everything and Start Fresh

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

## Project Structure

```
BookmarkHub/
├── backend/          # NestJS API
├── frontend/         # Next.js App
├── database/         # SQL schema
└── docker-compose.yml
```

## Environment Variables

All environment variables are pre-configured in `docker-compose.yml` for development.

**⚠️ Important**: Change `JWT_SECRET` in `docker-compose.yml` before deploying to production!

---

**Happy Bookmarking! 🚀**
