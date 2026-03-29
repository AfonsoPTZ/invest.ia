# Backend Architecture - Doorkeeper Pattern

## Overview

**Doorkeeper pattern:** Each layer has one job.

```
Controller (HTTP) → Service (Orchestrator) → Validator (Check data) → Repository (DB)
```

## Layers

| Layer | Responsibility |
|-------|-----------------|
| **Controller** | Get request, call service, return HTTP response |
| **Service** | Validate data → Business logic → Call repository |
| **Validator** | Check if data is valid, return clean data |
| **Repository** | Database CRUD only |

## Flow Example: User Registration

1. **Controller** extracts name/email/cpf/phone/password from request
2. **Service** calls validator to check all fields
3. **Validator** verifies CPF format, email format, phone DDD, etc.
4. **Service** checks duplicates in DB (via repository)
5. **Service** hashes password + creates user
6. **Controller** returns success/error response

## File Structure

```
backend/
├── src/
│   ├── controllers/ (HTTP handlers)
│   ├── services/ (Business logic)
│   ├── validators/ (Data validation)
│   ├── repositories/ (Database)
│   ├── middlewares/
│   ├── routes/
│   ├── config/
│   └── server.js
└── docs/
```

## Summary

- Controller: Thin, HTTP only
- Service: Calls validator, then does business logic
- Validator: Pure data checks, returns clean data
- Repository: DB queries only

