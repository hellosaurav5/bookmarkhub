import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw an error if no token is provided
  handleRequest(err: any, user: any) {
    // If there's a user, return it; otherwise return null (no error thrown)
    return user || null;
  }
}

