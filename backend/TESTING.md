# Inframate Testing Guide

## Overview
This guide covers how to run and maintain tests for the Inframate application.

## Backend Testing

### Prerequisites
```bash
cd backend
npm install
```

### Running Tests

#### Unit Tests
```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch

# Run specific test file
npm test auth.service.spec.ts
```

#### E2E/API Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- auth.e2e-spec
```

### Test Structure

#### Unit Tests
Located in: `src/modules/*/**.spec.ts`

**Coverage:**
- `auth.service.spec.ts`: Login, registration, password validation
- `issues.service.spec.ts`: Issue creation, assignment, status updates
- `sla.service.spec.ts`: SLA deadline calculation, breach detection

**Mocking Strategy:**
- Prisma methods mocked using `jest.fn()`
- External services (JwtService, NotificationsService) mocked
- Bcrypt password hashing tested with real library

#### E2E Tests
Located in: `test/*.e2e-spec.ts`

**Coverage:**
- `auth.e2e-spec.ts`: Login/register endpoints
- `issues.e2e-spec.ts`: Issue CRUD operations with authentication

**Database:**
- Uses actual database connection
- Requires seeded data (`admin@demo.edu`, `staff@demo.edu`, `student@demo.edu`)

### Coverage Goals

| Module | Target | Current |
|--------|--------|---------|
| Auth   | >80%   | ✅      |
| Issues | >60%   | ✅      |
| SLA    | >70%   | ✅      |

### Viewing Coverage
```bash
npm run test:cov
open coverage/lcov-report/index.html
```

## Frontend Testing

### Prerequisites
```bash
cd frontend
npm install @testing-library/react @testing-library/jest-dom --save-dev
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch
```

### Test Structure
Located in: `src/**/*.test.tsx`

**Critical Flows:**
- Login page rendering and form submission
- Issue card display and status badges
- Dashboard layout and navigation

### Frontend Coverage Goal
- Target: >40% (critical user flows only)

## Writing New Tests

### Unit Test Example
```typescript
import { Test } from '@nestjs/testing';
import { MyService } from './my.service';

describe('MyService', () => {
    let service: MyService;
    
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [MyService],
        }).compile();
        
        service = module.get<MyService>(MyService);
    });
    
    it('should do something', () => {
        expect(service.doSomething()).toBe(expected);
    });
});
```

### E2E Test Example
```typescript
import * as request from 'supertest';

describe('/endpoint (POST)', () => {
    it('should return 200', () => {
        return request(app.getHttpServer())
            .post('/endpoint')
            .set('Authorization', `Bearer ${token}`)
            .send({ data: 'value' })
            .expect(200);
    });
});
```

## CI/CD Integration

### GitHub Actions (Recommended)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

### Pre-commit Hook
```bash
# .husky/pre-commit
npm test
```

## Troubleshooting

### Common Issues

**Database connection errors in E2E tests:**
```bash
# Ensure .env has correct DATABASE_URL
# Run migrations
npx prisma migrate dev
npx prisma db seed
```

**Timeout errors:**
```typescript
// Increase timeout for slow tests
jest.setTimeout(10000);
```

**Mock not working:**
```typescript
// Clear mocks between tests
afterEach(() => {
    jest.clearAllMocks();
});
```

## Best Practices

1. **Test naming**: Use descriptive names (`should return 401 for invalid credentials`)
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Isolation**: Each test should be independent
4. **Coverage**: Focus on critical paths, not 100% coverage
5. **Speed**: Keep unit tests fast (<1s each)
6. **E2E**: Use sparingly for critical user flows only

## Maintenance

- **Review coverage monthly**: Ensure critical services stay >60%
- **Update tests with features**: New features require tests
- **Refactor brittle tests**: If tests break often, simplify
- **Monitor E2E performance**: Keep E2E suite < 2 minutes

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Library](https://testing-library.com/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
