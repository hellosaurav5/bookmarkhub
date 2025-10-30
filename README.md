# BookmarkHub - Social Bookmarking Platform

A modern social bookmarking platform where users can share links, vote on content, and discover interesting bookmarks. Built with Next.js, NestJS, PostgreSQL, and Docker.

## Features

- 📚 **Public Feed**: Browse bookmarks without authentication
- 🔐 **User Authentication**: JWT-based auth with secure password hashing
- 📝 **Create Bookmarks**: Share interesting links with the community
- 👍👎 **Voting System**: Upvote/downvote bookmarks with real-time updates
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🐳 **Docker-Based**: Everything runs in containers - no local installations needed

## Tech Stack

### Backend
- **NestJS** - Modular Node.js framework
- **Fastify** - High-performance web server
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Prerequisites

- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)

That's it! Everything else runs in containers.

## Quick Start

### 1. Clone or Navigate to Project

```bash
cd BookmarkHub
```

### 2. Start All Services

```bash
docker-compose up --build
```

This will:
- Build the backend, frontend, and database containers
- Initialize the PostgreSQL database with the schema
- Start all services with hot-reload enabled

### 3. Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### 4. Test the Application

1. Register a new account at http://localhost:3000/register
2. Login with your credentials
3. Create a bookmark by clicking "+ Create Bookmark"
4. Vote on bookmarks (upvote/downvote)
5. Log out and verify the public feed still works

## Project Structure

```
BookmarkHub/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── bookmarks/         # Bookmarks module
│   │   ├── votes/             # Votes module
│   │   ├── common/            # Shared utilities
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   ├── components/        # React components
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # Utilities & API client
│   │   └── types/             # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── schema.sql             # Database schema
├── docker-compose.yml          # Docker orchestration
└── README.md
```

## API Endpoints

### Authentication

**POST /auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Bookmarks

**GET /bookmarks** (Public)
- Returns all bookmarks with vote counts
- Shows user's votes if authenticated

**POST /bookmarks** (Protected)
```json
{
  "title": "My Bookmark",
  "url": "https://example.com"
}
```

### Votes

**POST /votes** (Protected)
```json
{
  "bookmarkId": 1,
  "voteType": 1  // 1 = upvote, -1 = downvote, 0 = remove
}
```

## Development Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services

```bash
docker-compose down
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### Access Database

```bash
# Connect to PostgreSQL
docker exec -it bookmarkhub-postgres psql -U postgres -d bookmarkhub

# Run queries
SELECT * FROM users;
SELECT * FROM bookmarks;
SELECT * FROM votes;
```

### Access Container Shell

```bash
# Backend
docker exec -it bookmarkhub-backend sh

# Frontend
docker exec -it bookmarkhub-frontend sh
```

## Database Schema

The application uses three main tables:

### Users
- `id` (Primary Key)
- `email` (Unique)
- `password_hash`
- `created_at`, `updated_at`

### Bookmarks
- `id` (Primary Key)
- `title` (max 200 chars)
- `url`
- `user_id` (Foreign Key → users)
- `created_at`, `updated_at`

### Votes
- `user_id` (Primary Key, Foreign Key → users)
- `bookmark_id` (Primary Key, Foreign Key → bookmarks)
- `vote_type` (-1 or 1)
- `created_at`, `updated_at`

Composite primary key `(user_id, bookmark_id)` ensures one vote per user per bookmark.

## Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

### Backend
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=bookmarkhub`
- `JWT_SECRET=your-super-secret-jwt-key-change-in-production`
- `FRONTEND_URL=http://localhost:3000`

### Frontend
- `NEXT_PUBLIC_API_URL=http://localhost:3001`

**⚠️ Important**: Change `JWT_SECRET` before deploying to production!

## Key Features Explained

### Authentication Flow
1. User registers/logs in
2. Backend returns JWT token (valid for 7 days)
3. Frontend stores token in localStorage
4. Token sent with every protected API request

### Voting System
- **Upvote**: Click up arrow (turns orange)
- **Downvote**: Click down arrow (turns blue)
- **Remove Vote**: Click same arrow again
- **Switch Vote**: Click opposite arrow
- **Optimistic Updates**: UI updates immediately, reverts on error

### Public vs Protected Routes
- **Public**: Home page (feed), login, register
- **Protected**: Create bookmark, vote on bookmarks
- Unauthenticated users can view but not interact

## Troubleshooting

### Port Already in Use

If ports 3000, 3001, or 5432 are already in use:

1. Stop the conflicting service
2. Or modify ports in `docker-compose.yml`

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart postgres

# Check logs
docker logs bookmarkhub-postgres
```

### Frontend Not Loading

```bash
# Clear Next.js cache
docker exec -it bookmarkhub-frontend rm -rf .next

# Restart frontend
docker-compose restart frontend
```

### Backend Not Starting

```bash
# Check logs
docker logs bookmarkhub-backend

# Rebuild backend
docker-compose up --build backend
```

## Testing

### Manual Testing Checklist

- [ ] Register a new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Create a bookmark
- [ ] Upvote a bookmark
- [ ] Downvote a bookmark
- [ ] Toggle vote off
- [ ] Switch from upvote to downvote
- [ ] Logout
- [ ] View public feed while logged out
- [ ] Try to vote while logged out (should show alert)

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get bookmarks (public)
curl http://localhost:3001/bookmarks

# Create bookmark (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/bookmarks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","url":"https://example.com"}'

# Vote (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/votes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookmarkId":1,"voteType":1}'
```

## Production Deployment

Before deploying to production:

1. **Change JWT Secret**: Update `JWT_SECRET` to a strong random value
2. **Update CORS**: Set `FRONTEND_URL` to your production domain
3. **Secure Database**: Use strong PostgreSQL credentials
4. **Enable HTTPS**: Configure SSL/TLS certificates
5. **Environment Variables**: Use proper secret management
6. **Database Migrations**: Set `synchronize: false` in TypeORM config
7. **Add Rate Limiting**: Protect authentication endpoints
8. **Setup Monitoring**: Add logging and error tracking
9. **Backup Strategy**: Configure automated database backups

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Docker logs: `docker-compose logs -f`
3. Verify all services are running: `docker ps`
4. Open an issue with detailed error messages

## Acknowledgments

Built with ❤️ using modern web technologies and best practices.

---

**Happy Bookmarking! 🚀**

