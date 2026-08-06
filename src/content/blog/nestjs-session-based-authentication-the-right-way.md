---
title: 'Session-Based Authentication in NestJS with Passport and Redis'
description: 'A practical walkthrough of session-based authentication in NestJS using Passport, Redis, guards, and a session serializer.'
publishedAt: 2026-08-01
author: 'Wilfried Musanzi'
tags:
  - NestJS
  - Authentication
  - Passport
  - Redis
---

Session-based authentication becomes easier to understand when you follow one request through the application. In this NestJS API, Passport authenticates the user, `express-session` manages the session, and Redis stores it outside the application process.

The browser keeps only the session cookie. On later requests, Passport uses that cookie to restore the authenticated user and make it available as `request.user`.

## Configure sessions before Passport

The session middleware is registered in `src/main.ts`. A Redis client is created first and passed to `RedisStore`:

```ts
const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on('error', (error) => {
  console.error('Redis client error', error);
});
await redisClient.connect();

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: 'sess:'
    }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      maxAge: +process.env.SESSION_MAX_AGE,
      sameSite: 'lax'
    }
  })
);
app.use(passport.initialize({}));
app.use(passport.session());
```

The order matters. `express-session` must prepare `request.session` before `passport.session()` attempts to restore a user.

`saveUninitialized: false` avoids storing a new session for a request that never becomes authenticated. `resave: false` avoids writing an unchanged session back to Redis. `SESSION_MAX_AGE` controls the cookie lifetime in milliseconds, while `SESSION_SECRET` signs the session cookie.

The API also enables credentialed CORS in the same bootstrap file:

```ts
app.enableCors({
  credentials: true,
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});
```

The frontend must send requests with credentials for the browser to include the session cookie.

## Authenticate local credentials

The local sign-in endpoint is public because the user does not have a session yet. It applies `LocalAuthGuard` before the controller method runs:

```ts
@Post('signin')
@Public()
@UseGuards(LocalAuthGuard)
signIn(@Req() req: Request): Promise<IUserResponse> {
  return this.queryHandler.execute(new SignIn(req));
}
```

`LocalAuthGuard` extends Passport's local guard:

```ts
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest<Request>();

    await super.logIn(request);

    return canActivate;
  }
}
```

`super.canActivate()` invokes the strategy and places the validated user on the request. Calling `super.logIn(request)` then establishes the Passport session.

The strategy reads `email` as the username field and delegates credential validation to a CQRS query:

```ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<IUserResponse> {
    return this.queryBus.execute(new ValidateCredentials(email, password));
  }
}
```

`ValidateCredentialsHandler` loads the password explicitly, compares it with `bcryptjs`, and performs a second query that returns the public user response. Invalid credentials produce the same unauthorized response whether the email or password is wrong.

By the time the controller executes, authentication and session creation are complete. The `SignIn` query simply returns the user attached to the request:

```ts
@QueryHandler(SignIn)
export class SignInHandler implements IQueryHandler<SignIn, IUserResponse> {
  async execute(query: SignIn): Promise<IUserResponse> {
    return query.request['user'] as IUserResponse;
  }
}
```

CQRS keeps the surrounding application structure consistent, but Passport still owns the authentication lifecycle.

## Store an ID, restore a user

Passport needs to know what to write into the session and how to turn it back into a user. That responsibility belongs to `SessionSerializer`:

```ts
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly queryBus: QueryBus) {
    super();
  }

  serializeUser(user: IUserResponse, done: (err: Error | null, id?: string) => void) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: (err: Error | null, user?: IUserResponse) => void) {
    try {
      const user = await this.queryBus.execute(new FindUserById(id));
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
}
```

Only the user ID is serialized. On every authenticated request, Passport deserializes that ID through `FindUserById` and assigns the result to `request.user`. Controllers can then access it through the `CurrentUser` decorator.

## Protect routes globally

Authentication is enforced by a global guard registered with `APP_GUARD`. Routes are protected unless they carry the `@Public()` metadata:

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]) || false;
    const req = ctx.switchToHttp().getRequest<Request>();

    if (isPublic) return true;

    return req.isAuthenticated();
  }
}
```

`req.isAuthenticated()` is provided by Passport. It returns true after `passport.session()` has successfully restored the user. A separate global `RolesGuard` handles role-based authorization after authentication.

## Sign out by destroying the session

The protected sign-out endpoint sends the request to a command handler:

```ts
@CommandHandler(SignOut)
export class SignOutHandler implements ICommandHandler<SignOut, void> {
  async execute(command: SignOut): Promise<void> {
    command.request.session.destroy(() => {});
  }
}
```

Destroying the server-side session removes the state associated with the browser's cookie. A later protected request can no longer be deserialized as an authenticated user.

## Google OAuth uses the same session

Google authentication has a different way to identify the user, but it joins the same session flow. `GoogleStrategy` receives the Google profile and dispatches `FindOrCreateUser`. `GoogleAuthGuard` then logs in the returned user just like the local guard:

```ts
async canActivate(context: ExecutionContext): Promise<boolean> {
  const canActivate = (await super.canActivate(context)) as boolean;
  const request = context.switchToHttp().getRequest<Request>();

  await super.logIn(request);

  return canActivate;
}
```

After the callback, the API redirects to the configured frontend. Subsequent requests use the same serializer, Redis store, global guard, and `request.user` mechanism as local sign-in.

The application also imports `JwtModule`, but JWTs are used for the 15-minute password-reset token. Browser authentication itself remains session-based.

## The complete request lifecycle

The implementation has one consistent path:

1. A Passport strategy validates local credentials or a Google profile.
2. The matching guard calls `logIn()` to create the authenticated session.
3. `SessionSerializer` stores only the user ID.
4. Redis persists the session under the `sess:` prefix.
5. On the next request, `passport.session()` restores the user.
6. The global guard checks `req.isAuthenticated()`.
7. Controllers receive the restored user through `@CurrentUser()`.
8. Signing out destroys the session.

The important idea is that the cookie, Redis record, Passport serializer, and NestJS guards are not separate authentication mechanisms. They are successive parts of the same session lifecycle.
