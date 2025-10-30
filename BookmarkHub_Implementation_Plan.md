# BookmarkHub - Complete Implementation Plan with Docker
## AI Coding Assistant Ready Guide

**Generated:** October 27, 2025  
**Target Platform:** Docker (No Local Installations)  
**Tech Stack:** Next.js, NestJS, Fastify, PostgreSQL, Zustand, TypeScript

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Docker Architecture](#2-docker-architecture)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [Docker Configuration Files](#7-docker-configuration-files)
8. [Step-by-Step Implementation](#8-step-by-step-implementation)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Component Specifications](#10-component-specifications)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Checklist](#12-deployment-checklist)

---

## 1. Project Overview

### What is BookmarkHub?
A social bookmarking platform (like Reddit/Hacker News) where users:
- Share interesting links (bookmarks)
- Vote on bookmarks (upvote/downvote)
- View a feed of all bookmarks sorted by recency
- Public feed accessible without authentication
- Protected features require login

### Core Requirements
- **Authentication:** JWT-based with bcrypt password hashing
- **Public Access:** Anyone can view feed
- **Protected Actions:** Creating bookmarks and voting require authentication
- **Voting Logic:** One vote per user per bookmark, can toggle/switch votes
- **Real-time Updates:** Optimistic UI updates for votes

---

## 2. Docker Architecture

### Services Overview
```
bookmarkhub/
├── frontend (Next.js on port 3000)
├── backend (NestJS on port 3001)
└── postgres (PostgreSQL on port 5432)
```

### Network Configuration
- All services run on `bookmarkhub-network`
- Backend connects to PostgreSQL via service name `postgres`
- Frontend connects to backend via service name `backend`
- Ports exposed to host: 3000 (frontend), 3001 (backend), 5432 (postgres)

### Volume Management
- PostgreSQL data persisted in `postgres-data` volume
- Backend and frontend use bind mounts for hot-reload during development

---

## 3. Project Structure

```
bookmarkhub/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Home page (public feed)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx                # Register page
│   │   │   ├── layout.tsx                  # Root layout
│   │   │   └── globals.css                 # Global styles
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx              # Reusable button
│   │   │   │   ├── Input.tsx               # Reusable input
│   │   │   │   └── Modal.tsx               # Reusable modal
│   │   │   ├── BookmarkCard.tsx            # Single bookmark display
│   │   │   ├── BookmarkFeed.tsx            # List of bookmarks
│   │   │   ├── CreateBookmarkModal.tsx     # Create bookmark form
│   │   │   ├── VoteControls.tsx            # Vote buttons + count
│   │   │   ├── AuthForm.tsx                # Shared auth form
│   │   │   └── Navbar.tsx                  # Navigation bar
│   │   ├── stores/
│   │   │   ├── authStore.ts                # Zustand auth state
│   │   │   └── bookmarksStore.ts           # Zustand bookmarks state
│   │   ├── lib/
│   │   │   ├── api.ts                      # API client with interceptors
│   │   │   └── utils.ts                    # Helper functions
│   │   └── types/
│   │       ├── bookmark.ts                 # Bookmark interfaces
│   │       └── auth.ts                     # Auth interfaces
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── decorators/
│   │   │       └── public.decorator.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── bookmarks/
│   │   │   ├── bookmarks.module.ts
│   │   │   ├── bookmarks.controller.ts
│   │   │   ├── bookmarks.service.ts
│   │   │   ├── dto/
│   │   │   │   └── create-bookmark.dto.ts
│   │   │   └── entities/
│   │   │       └── bookmark.entity.ts
│   │   ├── votes/
│   │   │   ├── votes.module.ts
│   │   │   ├── votes.controller.ts
│   │   │   ├── votes.service.ts
│   │   │   ├── dto/
│   │   │   │   └── vote.dto.ts
│   │   │   └── entities/
│   │   │       └── vote.entity.ts
│   │   ├── common/
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   └── interceptors/
│   │   │       └── logging.interceptor.ts
│   │   ├── app.module.ts
│   │   └── main.ts                         # Bootstrap with Fastify
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── database/
│   ├── schema.sql                          # Complete database schema
│   └── init-db.sh                          # Initialization script
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 4. Database Schema

### Complete SQL Schema

```sql
-- Create database
CREATE DATABASE bookmarkhub;

-- Connect to database
\c bookmarkhub;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Bookmarks table
CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- Votes table with composite primary key
CREATE TABLE votes (
    user_id INTEGER NOT NULL,
    bookmark_id INTEGER NOT NULL,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, bookmark_id),
    CONSTRAINT fk_vote_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vote_bookmark FOREIGN KEY (bookmark_id) 
        REFERENCES bookmarks(id) ON DELETE CASCADE
);

-- Create index for bookmark vote lookups
CREATE INDEX idx_votes_bookmark_id ON votes(bookmark_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at
    BEFORE UPDATE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at
    BEFORE UPDATE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Key Design Decisions

1. **Composite Primary Key on Votes**: `(user_id, bookmark_id)` ensures one vote per user per bookmark
2. **Cascade Deletes**: When user deleted, their bookmarks and votes are removed
3. **Indexes**: Optimize queries for feed (created_at DESC) and vote lookups
4. **Check Constraint**: vote_type limited to -1 (downvote) or 1 (upvote)

### Complex Query for Feed with Vote Counts

```sql
-- Get all bookmarks with vote counts and current user's vote
SELECT 
    b.id,
    b.title,
    b.url,
    b.created_at,
    u.email as created_by,
    COALESCE(SUM(v.vote_type), 0) as vote_count,
    uv.vote_type as user_vote
FROM bookmarks b
INNER JOIN users u ON b.user_id = u.id
LEFT JOIN votes v ON b.id = v.bookmark_id
LEFT JOIN votes uv ON b.id = uv.bookmark_id AND uv.user_id = $1
GROUP BY b.id, b.title, b.url, b.created_at, u.email, uv.vote_type
ORDER BY b.created_at DESC;
```

**Query Explanation:**
- Joins users to get creator email
- Left joins votes to calculate total vote count (SUM of vote_type)
- Second left join gets current user's vote (uv.user_id = $1)
- Groups by bookmark to aggregate votes
- Orders by most recent first

---

## 5. Backend Implementation

### 5.1 Main Bootstrap (main.ts)

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
```

### 5.2 App Module (app.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'bookmarkhub',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Use migrations in production
      logging: true,
    }),
    AuthModule,
    UsersModule,
    BookmarksModule,
    VotesModule,
  ],
})
export class AppModule {}
```

### 5.3 Auth Module

**auth/auth.service.ts**

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }
}
```

**auth/dto/register.dto.ts**

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
```

**auth/dto/login.dto.ts**

```typescript
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

**auth/strategies/jwt.strategy.ts**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}
```

**auth/guards/jwt-auth.guard.ts**

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

**auth/decorators/public.decorator.ts**

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**auth/auth.controller.ts**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

**auth/auth.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### 5.4 Users Module

**users/entities/user.entity.ts**

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { Vote } from '../../votes/entities/vote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
```

**users/users.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: { email: string; passwordHash: string }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
```

**users/users.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### 5.5 Bookmarks Module

**bookmarks/entities/bookmark.entity.ts**

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vote } from '../../votes/entities/vote.entity';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  url: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.bookmarks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Vote, (vote) => vote.bookmark)
  votes: Vote[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**bookmarks/dto/create-bookmark.dto.ts**

```typescript
import { IsString, IsUrl, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsUrl({}, { message: 'Must be a valid URL starting with http:// or https://' })
  @IsNotEmpty()
  url: string;
}
```

**bookmarks/bookmarks.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  async create(userId: number, createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    const bookmark = this.bookmarksRepository.create({
      ...createBookmarkDto,
      userId,
    });
    return this.bookmarksRepository.save(bookmark);
  }

  async findAll(userId?: number) {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.url,
        b.created_at as "createdAt",
        u.email as "createdBy",
        COALESCE(SUM(v.vote_type), 0)::INTEGER as "voteCount",
        uv.vote_type as "userVote"
      FROM bookmarks b
      INNER JOIN users u ON b.user_id = u.id
      LEFT JOIN votes v ON b.id = v.bookmark_id
      LEFT JOIN votes uv ON b.id = uv.bookmark_id AND uv.user_id = $1
      GROUP BY b.id, b.title, b.url, b.created_at, u.email, uv.vote_type
      ORDER BY b.created_at DESC
    `;

    return this.bookmarksRepository.query(query, [userId || null]);
  }

  async findOne(id: number): Promise<Bookmark | null> {
    return this.bookmarksRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
```

**bookmarks/bookmarks.controller.ts**

```typescript
import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Public()
  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.userId || null;
    return this.bookmarksService.findAll(userId);
  }

  @Post()
  async create(@Req() req: any, @Body() createBookmarkDto: CreateBookmarkDto) {
    const userId = req.user.userId;
    return this.bookmarksService.create(userId, createBookmarkDto);
  }
}
```

**bookmarks/bookmarks.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
```

### 5.6 Votes Module

**votes/entities/vote.entity.ts**

```typescript
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

@Entity('votes')
export class Vote {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'bookmark_id' })
  bookmarkId: number;

  @Column({ name: 'vote_type' })
  voteType: number; // -1 or 1

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bookmark, (bookmark) => bookmark.votes)
  @JoinColumn({ name: 'bookmark_id' })
  bookmark: Bookmark;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**votes/dto/vote.dto.ts**

```typescript
import { IsInt, IsIn } from 'class-validator';

export class VoteDto {
  @IsInt()
  bookmarkId: number;

  @IsInt()
  @IsIn([-1, 0, 1], { message: 'Vote type must be -1 (downvote), 0 (remove vote), or 1 (upvote)' })
  voteType: number;
}
```

**votes/votes.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async vote(userId: number, voteDto: VoteDto) {
    const { bookmarkId, voteType } = voteDto;

    // If voteType is 0, remove the vote
    if (voteType === 0) {
      await this.votesRepository.delete({ userId, bookmarkId });
      return { message: 'Vote removed' };
    }

    // Check if vote exists
    const existingVote = await this.votesRepository.findOne({
      where: { userId, bookmarkId },
    });

    if (existingVote) {
      // Update existing vote
      existingVote.voteType = voteType;
      await this.votesRepository.save(existingVote);
      return existingVote;
    } else {
      // Create new vote
      const vote = this.votesRepository.create({
        userId,
        bookmarkId,
        voteType,
      });
      return this.votesRepository.save(vote);
    }
  }

  async getUserVote(userId: number, bookmarkId: number): Promise<Vote | null> {
    return this.votesRepository.findOne({
      where: { userId, bookmarkId },
    });
  }
}
```

**votes/votes.controller.ts**

```typescript
import { Controller, Post, Body, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  async vote(@Req() req: any, @Body() voteDto: VoteDto) {
    const userId = req.user.userId;
    return this.votesService.vote(userId, voteDto);
  }
}
```

**votes/votes.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
```

### 5.7 Error Handling

**common/filters/http-exception.filter.ts**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || null;
      } else {
        message = exceptionResponse as string;
      }
    }

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).send({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

## 6. Frontend Implementation

### 6.1 TypeScript Interfaces

**types/auth.ts**

```typescript
export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
```

**types/bookmark.ts**

```typescript
export interface Bookmark {
  id: number;
  title: string;
  url: string;
  createdBy: string;
  createdAt: string;
  voteCount: number;
  userVote?: -1 | 0 | 1 | null;
}

export interface CreateBookmarkData {
  title: string;
  url: string;
}
```

### 6.2 API Client

**lib/api.ts**

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const api = new ApiClient();
```

**lib/utils.ts**

```typescript
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
```

### 6.3 Zustand Stores

**stores/authStore.ts**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          localStorage.setItem('token', response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, loading: false });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/register', credentials);
          localStorage.setItem('token', response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, loading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
```

**stores/bookmarksStore.ts**

```typescript
import { create } from 'zustand';
import { api } from '@/lib/api';
import { Bookmark, CreateBookmarkData } from '@/types/bookmark';

interface BookmarksState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;

  fetchBookmarks: () => Promise<void>;
  createBookmark: (data: CreateBookmarkData) => Promise<void>;
  vote: (bookmarkId: number, voteType: -1 | 0 | 1) => Promise<void>;
  optimisticVote: (bookmarkId: number, newVoteType: -1 | 0 | 1) => void;
  revertVote: (bookmarkId: number, oldVoteCount: number, oldUserVote: -1 | 0 | 1 | null) => void;
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  loading: false,
  error: null,

  fetchBookmarks: async () => {
    set({ loading: true, error: null });
    try {
      const bookmarks = await api.get<Bookmark[]>('/bookmarks');
      set({ bookmarks, loading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch bookmarks';
      set({ error: message, loading: false });
    }
  },

  createBookmark: async (data) => {
    try {
      const newBookmark = await api.post<Bookmark>('/bookmarks', data);
      set((state) => ({
        bookmarks: [newBookmark, ...state.bookmarks],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create bookmark';
      set({ error: message });
      throw error;
    }
  },

  optimisticVote: (bookmarkId, newVoteType) => {
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) => {
        if (bookmark.id !== bookmarkId) return bookmark;

        const oldVote = bookmark.userVote || 0;
        let voteCountChange = 0;

        if (oldVote === 0) {
          // No previous vote
          voteCountChange = newVoteType;
        } else if (newVoteType === 0) {
          // Removing vote
          voteCountChange = -oldVote;
        } else if (oldVote !== newVoteType) {
          // Switching vote
          voteCountChange = newVoteType - oldVote;
        } else {
          // Same vote (toggling off)
          voteCountChange = -oldVote;
          newVoteType = 0 as any;
        }

        return {
          ...bookmark,
          voteCount: bookmark.voteCount + voteCountChange,
          userVote: newVoteType === 0 ? null : newVoteType,
        };
      }),
    }));
  },

  revertVote: (bookmarkId, oldVoteCount, oldUserVote) => {
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId
          ? { ...bookmark, voteCount: oldVoteCount, userVote: oldUserVote }
          : bookmark
      ),
    }));
  },

  vote: async (bookmarkId, voteType) => {
    const bookmark = get().bookmarks.find((b) => b.id === bookmarkId);
    if (!bookmark) return;

    const oldVoteCount = bookmark.voteCount;
    const oldUserVote = bookmark.userVote || null;

    // Determine final vote type (toggle logic)
    let finalVoteType = voteType;
    if (bookmark.userVote === voteType) {
      finalVoteType = 0; // Remove vote
    }

    // Optimistically update UI
    get().optimisticVote(bookmarkId, finalVoteType);

    try {
      await api.post('/votes', { bookmarkId, voteType: finalVoteType });
    } catch (error: any) {
      // Revert on error
      get().revertVote(bookmarkId, oldVoteCount, oldUserVote);
      const message = error.response?.data?.message || 'Failed to vote';
      set({ error: message });
      throw error;
    }
  },
}));
```

### 6.4 UI Components

**components/ui/Button.tsx**

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
```

**components/ui/Input.tsx**

```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

**components/ui/Modal.tsx**

```typescript
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
```

### 6.5 Feature Components

**components/VoteControls.tsx**

```typescript
'use client';

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useBookmarksStore } from '@/stores/bookmarksStore';

interface VoteControlsProps {
  bookmarkId: number;
  voteCount: number;
  userVote?: -1 | 0 | 1 | null;
}

export const VoteControls: React.FC<VoteControlsProps> = ({
  bookmarkId,
  voteCount,
  userVote,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const vote = useBookmarksStore((state) => state.vote);
  const [isVoting, setIsVoting] = React.useState(false);

  const handleVote = async (voteType: 1 | -1) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }

    setIsVoting(true);
    try {
      await vote(bookmarkId, voteType);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={() => handleVote(1)}
        disabled={!isAuthenticated || isVoting}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          userVote === 1 ? 'text-orange-500' : 'text-gray-400'
        } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
        title={!isAuthenticated ? 'Login to vote' : 'Upvote'}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3l6 7h-4v7H8v-7H4l6-7z" />
        </svg>
      </button>

      <span className={`font-medium ${
        voteCount > 0 ? 'text-orange-500' : voteCount < 0 ? 'text-blue-500' : 'text-gray-600'
      }`}>
        {voteCount}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={!isAuthenticated || isVoting}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          userVote === -1 ? 'text-blue-500' : 'text-gray-400'
        } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
        title={!isAuthenticated ? 'Login to vote' : 'Downvote'}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 17l-6-7h4V3h4v7h4l-6 7z" />
        </svg>
      </button>
    </div>
  );
};
```

**components/BookmarkCard.tsx**

```typescript
'use client';

import React from 'react';
import { Bookmark } from '@/types/bookmark';
import { VoteControls } from './VoteControls';
import { getRelativeTime } from '@/lib/utils';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  return (
    <div className="flex bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <VoteControls
        bookmarkId={bookmark.id}
        voteCount={bookmark.voteCount}
        userVote={bookmark.userVote}
      />

      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {bookmark.title}
        </h3>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm break-all"
        >
          {bookmark.url}
        </a>

        <div className="mt-2 text-sm text-gray-500">
          Posted by {bookmark.createdBy} • {getRelativeTime(bookmark.createdAt)}
        </div>
      </div>
    </div>
  );
};
```

**components/BookmarkFeed.tsx**

```typescript
'use client';

import React, { useEffect } from 'react';
import { useBookmarksStore } from '@/stores/bookmarksStore';
import { BookmarkCard } from './BookmarkCard';

export const BookmarkFeed: React.FC = () => {
  const { bookmarks, loading, error, fetchBookmarks } = useBookmarksStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        No bookmarks yet. Be the first to share one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
};
```

**components/CreateBookmarkModal.tsx**

```typescript
'use client';

import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useBookmarksStore } from '@/stores/bookmarksStore';
import { validateUrl } from '@/lib/utils';

interface CreateBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBookmarkModal: React.FC<CreateBookmarkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [loading, setLoading] = useState(false);

  const createBookmark = useBookmarksStore((state) => state.createBookmark);

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateUrl(url)) {
      newErrors.url = 'Must be a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await createBookmark({ title, url });
      setTitle('');
      setUrl('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bookmark">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Enter bookmark title"
          maxLength={200}
        />

        <Input
          label="URL"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={errors.url}
          placeholder="https://example.com"
        />

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

**components/Navbar.tsx**

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { CreateBookmarkModal } from './CreateBookmarkModal';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              BookmarkHub
            </Link>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    + Create Bookmark
                  </Button>
                  <span className="text-sm text-gray-600">{user?.email}</span>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CreateBookmarkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};
```

**components/AuthForm.tsx**

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuthStore } from '@/stores/authStore';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const { login, register, loading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (mode === 'register' && password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
      router.push('/');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={localErrors.email}
        placeholder="you@example.com"
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={localErrors.password}
        placeholder="••••••••"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        {mode === 'login' ? 'Login' : 'Register'}
      </Button>
    </form>
  );
};
```

### 6.6 Pages

**app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AuthInitializer } from '@/components/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookmarkHub - Social Bookmarking Platform',
  description: 'Share and vote on interesting links',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**app/page.tsx**

```typescript
import { BookmarkFeed } from '@/components/BookmarkFeed';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Latest Bookmarks
      </h1>
      <BookmarkFeed />
    </div>
  );
}
```

**app/login/page.tsx**

```typescript
import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Login to BookmarkHub</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**app/register/page.tsx**

```typescript
import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <AuthForm mode="register" />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**components/AuthInitializer.tsx**

```typescript
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const AuthInitializer: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
};
```

**app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50;
}
```

---

## 7. Docker Configuration Files

### 7.1 Root docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: bookmarkhub-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: bookmarkhub
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - bookmarkhub-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: bookmarkhub-backend
    environment:
      NODE_ENV: development
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_NAME: bookmarkhub
      JWT_SECRET: your-super-secret-jwt-key-change-in-production
      FRONTEND_URL: http://localhost:3000
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - bookmarkhub-network
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: bookmarkhub-frontend
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - bookmarkhub-network
    depends_on:
      - backend
    command: npm run dev

networks:
  bookmarkhub-network:
    driver: bridge

volumes:
  postgres-data:
```

### 7.2 Backend Dockerfile

**backend/Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start development server
CMD ["npm", "run", "start:dev"]
```

**backend/.dockerignore**

```
node_modules
dist
.env
.git
.gitignore
README.md
```

### 7.3 Frontend Dockerfile

**frontend/Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
```

**frontend/.dockerignore**

```
node_modules
.next
.env
.git
.gitignore
README.md
```

### 7.4 Environment Variables

**.env.example** (root directory)

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=bookmarkhub

# Backend
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 8. Step-by-Step Implementation

### Phase 1: Project Setup (Day 1)

**Step 1: Create Project Structure**

```bash
# Create root directory
mkdir bookmarkhub
cd bookmarkhub

# Create subdirectories
mkdir -p frontend backend database

# Create docker-compose.yml
touch docker-compose.yml

# Create .env file
cp .env.example .env
```

**Step 2: Initialize Backend (NestJS)**

```bash
cd backend

# Initialize npm project
npm init -y

# Install dependencies
npm install @nestjs/common @nestjs/core @nestjs/platform-fastify @nestjs/typeorm @nestjs/jwt @nestjs/passport @nestjs/config
npm install typeorm pg passport passport-jwt bcrypt class-validator class-transformer
npm install -D @nestjs/cli @nestjs/testing @types/node @types/passport-jwt @types/bcrypt typescript ts-node

# Create tsconfig.json
npx tsc --init

# Update package.json scripts
# Add: "start:dev": "nest start --watch"
```

**Step 3: Initialize Frontend (Next.js)**

```bash
cd ../frontend

# Create Next.js app with TypeScript
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Install additional dependencies
npm install zustand axios
```

**Step 4: Create Database Schema**

Create `database/schema.sql` with the complete SQL schema provided in Section 4.

**Step 5: Write Dockerfiles**

Create `backend/Dockerfile` and `frontend/Dockerfile` as specified in Section 7.

**Step 6: Write docker-compose.yml**

Create root `docker-compose.yml` as specified in Section 7.1.

**Step 7: Start Docker Containers**

```bash
# From root directory
docker-compose up --build
```

**Verification:**
- PostgreSQL: Running on port 5432
- Backend: Running on port 3001
- Frontend: Running on port 3000
- Database initialized with schema

---

### Phase 2: Backend Implementation (Day 2-3)

**Step 1: Create Module Structure**

```bash
cd backend/src

# Create directories
mkdir -p auth/{dto,strategies,guards,decorators}
mkdir -p users/entities
mkdir -p bookmarks/{dto,entities}
mkdir -p votes/{dto,entities}
mkdir -p common/{filters,interceptors}
```

**Step 2: Implement Users Module**

1. Create `users/entities/user.entity.ts` (Section 5.4)
2. Create `users/users.service.ts` (Section 5.4)
3. Create `users/users.module.ts` (Section 5.4)

**Step 3: Implement Auth Module**

1. Create `auth/dto/register.dto.ts` and `login.dto.ts` (Section 5.3)
2. Create `auth/strategies/jwt.strategy.ts` (Section 5.3)
3. Create `auth/guards/jwt-auth.guard.ts` (Section 5.3)
4. Create `auth/decorators/public.decorator.ts` (Section 5.3)
5. Create `auth/auth.service.ts` (Section 5.3)
6. Create `auth/auth.controller.ts` (Section 5.3)
7. Create `auth/auth.module.ts` (Section 5.3)

**Step 4: Implement Bookmarks Module**

1. Create `bookmarks/entities/bookmark.entity.ts` (Section 5.5)
2. Create `bookmarks/dto/create-bookmark.dto.ts` (Section 5.5)
3. Create `bookmarks/bookmarks.service.ts` (Section 5.5)
4. Create `bookmarks/bookmarks.controller.ts` (Section 5.5)
5. Create `bookmarks/bookmarks.module.ts` (Section 5.5)

**Step 5: Implement Votes Module**

1. Create `votes/entities/vote.entity.ts` (Section 5.6)
2. Create `votes/dto/vote.dto.ts` (Section 5.6)
3. Create `votes/votes.service.ts` (Section 5.6)
4. Create `votes/votes.controller.ts` (Section 5.6)
5. Create `votes/votes.module.ts` (Section 5.6)

**Step 6: Configure App Module**

Create `app.module.ts` with all imports (Section 5.2)

**Step 7: Configure Main Bootstrap**

Create `main.ts` with Fastify adapter (Section 5.1)

**Step 8: Add Error Handling**

Create `common/filters/http-exception.filter.ts` (Section 5.7)

**Step 9: Test Backend APIs**

```bash
# Register a user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get bookmarks (public)
curl http://localhost:3001/bookmarks

# Create bookmark (requires token)
curl -X POST http://localhost:3001/bookmarks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Bookmark","url":"https://example.com"}'

# Vote
curl -X POST http://localhost:3001/votes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookmarkId":1,"voteType":1}'
```

---

### Phase 3: Frontend Implementation (Day 3-5)

**Step 1: Create Type Definitions**

Create `types/auth.ts` and `types/bookmark.ts` (Section 6.1)

**Step 2: Create API Client**

Create `lib/api.ts` with axios interceptors (Section 6.2)
Create `lib/utils.ts` with helper functions (Section 6.2)

**Step 3: Create Zustand Stores**

Create `stores/authStore.ts` (Section 6.3)
Create `stores/bookmarksStore.ts` (Section 6.3)

**Step 4: Create UI Components**

Create `components/ui/Button.tsx` (Section 6.4)
Create `components/ui/Input.tsx` (Section 6.4)
Create `components/ui/Modal.tsx` (Section 6.4)

**Step 5: Create Feature Components**

Create `components/VoteControls.tsx` (Section 6.5)
Create `components/BookmarkCard.tsx` (Section 6.5)
Create `components/BookmarkFeed.tsx` (Section 6.5)
Create `components/CreateBookmarkModal.tsx` (Section 6.5)
Create `components/Navbar.tsx` (Section 6.5)
Create `components/AuthForm.tsx` (Section 6.5)
Create `components/AuthInitializer.tsx` (Section 6.6)

**Step 6: Create Pages**

Create `app/layout.tsx` (Section 6.6)
Create `app/page.tsx` (Section 6.6)
Create `app/login/page.tsx` (Section 6.6)
Create `app/register/page.tsx` (Section 6.6)

**Step 7: Configure Tailwind**

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 8: Configure Next.js**

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

**Step 9: Update Styles**

Create `app/globals.css` (Section 6.6)

**Step 10: Test Frontend**

1. Visit http://localhost:3000
2. Register a new account
3. Login with credentials
4. Create a bookmark
5. Vote on bookmarks
6. Logout and verify public feed still works

---

### Phase 4: Testing & Polish (Day 5-6)

**Step 1: Add Responsive Design**

Ensure all components work on mobile (320px+) and desktop

**Step 2: Add Loading States**

- Skeleton screens for feed
- Button loading spinners
- Disabled states during API calls

**Step 3: Add Error Handling**

- Display error messages in forms
- Toast notifications for votes
- Retry logic for failed requests

**Step 4: Add Validation**

- Client-side validation before API calls
- Server-side validation with class-validator
- Display validation errors clearly

**Step 5: Security Audit**

- Verify passwords are hashed (bcrypt, 10+ rounds)
- Check JWT tokens have expiration
- Ensure SQL queries use parameterized queries (TypeORM does this)
- Test CORS configuration
- Remove console.logs in production

**Step 6: Performance Optimization**

- Add database indexes
- Implement optimistic UI updates
- Lazy load modals
- Debounce form inputs

---

## 9. API Endpoints Reference

### Authentication Endpoints

**POST /auth/register**
- **Description:** Create new user account
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (201):**
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Errors:**
  - 409: Email already exists
  - 400: Validation error (invalid email, password too short)

**POST /auth/login**
- **Description:** Login with email and password
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200):** Same as register
- **Errors:**
  - 401: Invalid email or password

### Bookmarks Endpoints

**GET /bookmarks**
- **Description:** Get all bookmarks with vote counts
- **Access:** Public (but shows user's votes if authenticated)
- **Headers:** `Authorization: Bearer <token>` (optional)
- **Response (200):**
  ```json
  [
    {
      "id": 1,
      "title": "Example Bookmark",
      "url": "https://example.com",
      "createdBy": "user@example.com",
      "createdAt": "2025-10-27T18:30:00.000Z",
      "voteCount": 5,
      "userVote": 1
    }
  ]
  ```

**POST /bookmarks**
- **Description:** Create new bookmark
- **Access:** Protected (requires authentication)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "My Bookmark",
    "url": "https://example.com"
  }
  ```
- **Response (201):**
  ```json
  {
    "id": 2,
    "title": "My Bookmark",
    "url": "https://example.com",
    "userId": 1,
    "createdAt": "2025-10-27T18:35:00.000Z",
    "updatedAt": "2025-10-27T18:35:00.000Z"
  }
  ```
- **Errors:**
  - 401: Unauthorized (missing/invalid token)
  - 400: Validation error (title too long, invalid URL)

### Votes Endpoints

**POST /votes**
- **Description:** Cast, update, or remove vote
- **Access:** Protected (requires authentication)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "bookmarkId": 1,
    "voteType": 1
  }
  ```
  - `voteType`: 1 (upvote), -1 (downvote), 0 (remove vote)
- **Response (200/201):**
  ```json
  {
    "userId": 1,
    "bookmarkId": 1,
    "voteType": 1,
    "createdAt": "2025-10-27T18:40:00.000Z",
    "updatedAt": "2025-10-27T18:40:00.000Z"
  }
  ```
- **Errors:**
  - 401: Unauthorized
  - 404: Bookmark not found

---

## 10. Component Specifications

### Button Component
- **Props:** variant, loading, disabled, onClick, children
- **Variants:** primary (blue), secondary (gray), ghost (transparent)
- **States:** default, hover, active, disabled, loading
- **Loading:** Shows spinner + "Loading..." text

### Input Component
- **Props:** label, error, type, value, onChange, placeholder
- **Features:** Label above input, error message below, red border on error
- **Validation:** Visual feedback for errors

### Modal Component
- **Props:** isOpen, onClose, title, children
- **Features:** Backdrop overlay, centered content, close on backdrop click
- **Accessibility:** Prevents body scroll when open

### VoteControls Component
- **Props:** bookmarkId, voteCount, userVote
- **Features:** Up/down arrows, count display, active state highlighting
- **Behavior:** 
  - Click same vote → remove vote
  - Click opposite vote → switch vote
  - Disabled for unauthenticated users

### BookmarkCard Component
- **Props:** bookmark (object)
- **Features:** Vote controls, title, URL link, metadata (author, time)
- **Display:** Title (truncated if long), clickable URL, relative time

### BookmarkFeed Component
- **Props:** None (uses Zustand store)
- **Features:** Loading skeletons, error display, empty state
- **Data:** Fetches on mount, displays list of BookmarkCard

### CreateBookmarkModal Component
- **Props:** isOpen, onClose
- **Features:** Form validation, loading state, error display
- **Validation:** Title max 200 chars, URL format check

### Navbar Component
- **Props:** None (uses Zustand store)
- **Features:** Logo, create button (auth only), user email, login/logout
- **Responsive:** Collapses menu on mobile

### AuthForm Component
- **Props:** mode ('login' | 'register')
- **Features:** Email/password inputs, validation, error display
- **Validation:** Email format, password min length (register only)

---

## 11. Testing Strategy

### Backend Testing

**Unit Tests**
- Test each service method in isolation
- Mock TypeORM repositories
- Test password hashing and JWT generation

**Integration Tests**
- Test API endpoints with real database (test container)
- Verify authentication guards work
- Test vote toggle logic with database

**Test File Structure:**
```
backend/test/
├── auth.e2e-spec.ts
├── bookmarks.e2e-spec.ts
└── votes.e2e-spec.ts
```

**Sample Test:**
```typescript
describe('AuthController (e2e)', () => {
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('test@example.com');
      });
  });
});
```

### Frontend Testing

**Component Tests**
- Test Button renders correctly with variants
- Test Input displays error messages
- Test VoteControls handles clicks

**Store Tests**
- Test authStore login/logout
- Test bookmarksStore optimistic updates
- Test vote toggle logic

**E2E Tests (Playwright/Cypress)**
- User registration flow
- Login and create bookmark
- Vote on bookmarks
- Logout

**Test File Structure:**
```
frontend/__tests__/
├── components/
│   ├── Button.test.tsx
│   └── VoteControls.test.tsx
├── stores/
│   ├── authStore.test.ts
│   └── bookmarksStore.test.ts
└── e2e/
    └── user-flow.spec.ts
```

---

## 12. Deployment Checklist

### Pre-Deployment

- [ ] Change JWT_SECRET to secure random value
- [ ] Update CORS origin to production URL
- [ ] Remove all console.log statements
- [ ] Set NODE_ENV to 'production'
- [ ] Enable TypeORM synchronize: false (use migrations)
- [ ] Add rate limiting on auth endpoints
- [ ] Configure database connection pooling
- [ ] Add logging service (Winston, Pino)
- [ ] Enable HTTPS for production
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)

### Docker Production Build

**Production docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - postgres-data-prod:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    env_file:
      - .env.production

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

**Backend Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/main"]
```

**Frontend Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

### Monitoring & Logging

- [ ] Setup application logging (Winston/Pino)
- [ ] Configure log aggregation (ELK stack, CloudWatch)
- [ ] Add health check endpoints
- [ ] Setup uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Add performance monitoring (New Relic, DataDog)

### Database Backups

- [ ] Setup automated PostgreSQL backups
- [ ] Test backup restoration
- [ ] Configure backup retention policy

### Documentation

- [ ] Complete README with setup instructions
- [ ] Document API endpoints (Swagger/OpenAPI)
- [ ] Add architecture diagrams
- [ ] Document environment variables
- [ ] Create deployment guide

---

## Quick Start Commands

### Initial Setup

```bash
# Clone or create project
mkdir bookmarkhub && cd bookmarkhub

# Create structure
mkdir -p frontend backend database

# Copy files from this guide into appropriate directories
# Create docker-compose.yml, Dockerfiles, etc.

# Start services
docker-compose up --build
```

### Development Workflow

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access database
docker exec -it bookmarkhub-postgres psql -U postgres -d bookmarkhub

# Run backend tests
docker exec -it bookmarkhub-backend npm test

# Run frontend tests
docker exec -it bookmarkhub-frontend npm test
```

### Troubleshooting

**Database connection issues:**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker logs bookmarkhub-postgres

# Manually test connection
docker exec -it bookmarkhub-postgres psql -U postgres -c "SELECT 1"
```

**Backend not starting:**
```bash
# Check logs
docker logs bookmarkhub-backend

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up --build backend
```

**Frontend not loading:**
```bash
# Check logs
docker logs bookmarkhub-frontend

# Clear Next.js cache
docker exec -it bookmarkhub-frontend rm -rf .next

# Restart
docker-compose restart frontend
```

---

## Conclusion

This implementation plan provides complete, step-by-step instructions for building BookmarkHub. All code examples are production-ready and follow best practices. The Docker configuration ensures no local installations are needed—everything runs in containers.

**For AI Coding Assistants:** All file paths, code snippets, and configurations are complete and ready to implement. Follow the phases sequentially, copy code exactly as shown, and refer to section numbers for cross-references.

**Key Success Metrics:**
- All 4 core features implemented (feed, auth, bookmarks, voting)
- Database schema properly normalized with constraints
- API endpoints secure with JWT authentication
- Frontend components reusable and well-typed
- Everything runs in Docker containers
- Code quality and TypeScript best practices followed

Good luck with your implementation! 🚀
