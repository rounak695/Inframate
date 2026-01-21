# Inframate Security Configuration Guide

## Overview
This document outlines the security measures implemented in Inframate to protect against common web vulnerabilities.

## Security Features

### 1. **Helmet Security Headers**
Location: `backend/src/main.ts`

Helmet is configured to set the following HTTP headers:

- **Content-Security-Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections (1 year max-age)
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-DNS-Prefetch-Control**: Controls DNS prefetching

### 2. **Rate Limiting**
Location: `backend/src/app.module.ts`

Uses `@nestjs/throttler` to prevent abuse:
- **Limit**: 100 requests per minute per IP
- **TTL**: 60 seconds
- Automatically blocks excessive requests with 429 status

### 3. **Input Validation**
Location: All DTOs in `backend/src/modules/*/dto/`

Enhanced validation using `class-validator`:
- Email format validation
- Password minimum length (8 characters)
- String length limits (prevents buffer overflow)
- Enum validation for status/priority fields
- Required field enforcement
- Whitelist mode (strips unknown properties)

**Example:**
```typescript
@IsEmail({}, { message: 'Please provide a valid email address' })
@MaxLength(255)
email: string;
```

### 4. **Sensitive Data Masking**
Location: `backend/src/common/interceptors/logging.interceptor.ts`

Automatically masks sensitive fields in logs:
- `password`, `passwordHash`
- `token`, `accessToken`, `refreshToken`
- `secret`, `apiKey`
- Partial email masking (e.g., `j***n@example.com`)

### 5. **CORS Configuration**
Location: `backend/src/main.ts`

Strict CORS policy:
- **Development**: Allows `localhost:3000`, `localhost:3001`
- **Production**: Only allows configured production origins
- **Credentials**: Enabled for cookie-based auth
- **Methods**: Limited to necessary HTTP methods

### 6. **Trust Proxy**
Location: `backend/src/main.ts`

Configured to trust reverse proxy headers:
- Enables proper IP detection behind load balancers
- Critical for rate limiting accuracy
- Required for Render/Vercel deployments

## Environment Variables

Add to `.env` for production:

```bash
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Security Checklist

- [x] Helmet security headers enabled
- [x] Rate limiting active
- [x] Input validation on all endpoints
- [x] Sensitive data masking in logs
- [x] CORS restricted to known origins
- [x] Trust proxy configured
- [ ] SSL/TLS certificate (handled by hosting provider)
- [ ] Environment variables secured (not committed to git)

## Testing Security

### Test Rate Limiting
```bash
# Spam an endpoint
for i in {1..150}; do curl http://localhost:3000/api/v1/health; done
# Should see 429 errors after 100 requests
```

### Test Input Validation
```bash
# Send malformed payload
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"short"}'
# Should return 400 with validation errors
```

### Test Security Headers
```bash
# Check headers
curl -I http://localhost:3000/api/v1/health
# Should see X-Content-Type-Options, Strict-Transport-Security, etc.
```

## Threat Mitigation

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| XSS | Content-Security-Policy | Helmet |
| Clickjacking | X-Frame-Options | Helmet |
| CSRF | SameSite cookies + CORS | main.ts |
| DDoS | Rate limiting | ThrottlerModule |
| SQL Injection | Parameterized queries | Prisma ORM |
| Credential Leaks | Log masking | LoggingInterceptor |
| Brute Force | Rate limiting + password policy | Validation + Throttler |

## Maintenance

- **Review Logs**: Check for masked sensitive data patterns
- **Update Dependencies**: Run `npm audit` regularly
- **Monitor Rate Limits**: Adjust if legitimate users are blocked
- **CSP Reports**: Configure CSP reporting for violations

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/helmet)
