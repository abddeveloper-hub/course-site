# NEXVION AI — Production Launch Documentation

> **Platform Version**: 1.9.0 | **Deployment Target**: Firebase Hosting (nexvion-ai)

---

## 1. Local Development Setup

### Prerequisites
- Node.js 18+ (LTS)
- Firebase CLI: `npm install -g firebase-tools`

### Steps
```bash
# 1. Enter the project directory
cd "course registration"

# 2. Copy the development environment file
cp .env.development .env

# 3. Start local development server
node server.js

# 4. Open the platform
# Landing page:      http://localhost:3000/
# Admin portal:      http://localhost:3000/admin.html
# Admin login:       http://localhost:3000/admin-login.html
# Course page:       http://localhost:3000/course.html
# Student checkout:  http://localhost:3000/checkout.html
# Certificate:       http://localhost:3000/verify-certificate.html
```

---

## 2. Staging Setup

```bash
# Deploy to Firebase Hosting preview channel
firebase login
firebase hosting:channel:deploy staging --expires 7d
# Preview URL: https://nexvion-ai--staging-XXXXX.web.app
```

Use `.env.staging` values on the staging server. Use payment sandbox/test keys only.

---

## 3. Production Deployment

> WARNING: Do not deploy without explicit approval.

### Pre-Deployment Checklist
- [ ] All phase tests pass (92/92 Phase 18, 70/70 Phase 16, 71/71 Phase 15, 69/69 Phase 14, 80/80 Phase 13)
- [ ] .env.production populated with real secrets via CI/CD (never committed)
- [ ] Firestore security rules reviewed
- [ ] Storage security rules reviewed
- [ ] STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET injected from Cloud Secret Manager
- [ ] Payment webhook URL updated to production domain
- [ ] Firebase Authentication authorized domains updated
- [ ] Firestore backup schedule configured

### Deployment Commands
```bash
# 1. Deploy security rules and indexes first
firebase deploy --only firestore:rules,firestore:indexes,storage

# 2. Preview hosting
firebase hosting:channel:deploy prod-preview

# 3. After approval, deploy live
firebase deploy --only hosting

# 4. Verify at https://nexvion-ai.web.app/
```

---

## 4. Environment Variables

| Variable | Required | Exposed to Client |
|---|---|---|
| FIREBASE_API_KEY | Yes | Yes (safe — public browser SDK key) |
| FIREBASE_AUTH_DOMAIN | Yes | Yes |
| FIREBASE_PROJECT_ID | Yes | Yes |
| FIREBASE_STORAGE_BUCKET | Yes | Yes |
| FIREBASE_APP_ID | Yes | Yes |
| FIREBASE_MESSAGING_SENDER_ID | Optional | Yes |
| FIREBASE_MEASUREMENT_ID | Optional | Yes |
| PORT | Optional | No |
| HOST | Optional | No |
| NODE_ENV | Optional | No |
| ALLOWED_ORIGIN | Optional | No |
| STRIPE_SECRET_KEY | When live | NEVER |
| STRIPE_WEBHOOK_SECRET | When live | NEVER |
| GOOGLE_APPLICATION_CREDENTIALS | When CF | NEVER |

> FIREBASE_API_KEY is a public browser SDK key, NOT a service-account credential.
> Firebase security is enforced via Firestore Rules and Auth Claims.

---

## 5. Firebase Configuration

- Project ID: nexvion-ai
- Auth Domain: nexvion-ai.firebaseapp.com
- Storage Bucket: nexvion-ai.firebasestorage.app
- Hosting: https://nexvion-ai.web.app

### Authentication Setup
1. Enable Email/Password sign-in in Firebase Console.
2. Add authorized domains: nexvion-ai.web.app, nexvion-ai.firebaseapp.com.
3. Enable MFA/TOTP for Owner, Super Admin, Finance Manager roles.

### Firestore Setup
1. Create Firestore in Native mode.
2. Deploy rules: firebase deploy --only firestore:rules
3. Deploy indexes: firebase deploy --only firestore:indexes

---

## 6. Admin Roles

| Role | Financial | Students | Content | Certs | Support | Analytics |
|---|---|---|---|---|---|---|
| Owner | Full | Full | Full | Full | Full | Full |
| Super Admin | Full | Full | Full | Full | Full | Full |
| Content Manager | No | Read | Full | Read | Read | Read |
| Student Manager | No | Full | Read | Manage | Full | Read |
| Finance Manager | Full | No | No | No | No | Read |
| Comms Manager | No | No | Announcements | No | Read | No |
| Support Manager | No | Read | No | No | Full | No |
| Analyst | DENIED | No | No | No | No | Read |

---

## 7. Payment Configuration

Current status: AI Foundations is FREE. Paid tiers show "PRICE COMING SOON".

### To Enable Live Payments
1. Create Stripe account and obtain live keys.
2. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET via Cloud Secret Manager.
3. Configure webhook endpoint: /api/payments/webhook.
4. Update TIER_PRICES_REGISTRY in server.js with real prices.
5. Implement cryptographic webhook signature verification using STRIPE_WEBHOOK_SECRET.

### Security Invariants (Always Enforced)
- Server validates amount against server-side registry (client prices are rejected).
- Payment status Paid can only be set via server-side webhook or verification.
- Refunds require Finance Manager or Owner role.
- All payment events are idempotent.

---

## 8. Backup and Recovery

### Firestore Backups
```bash
# Manual export
gcloud firestore export gs://nexvion-ai-backups/$(date +%Y%m%d) --project nexvion-ai

# Restore
gcloud firestore import gs://nexvion-ai-backups/YYYYMMDD --project nexvion-ai
```

Configure automated daily exports in Cloud Console. Retain 30 days minimum.

### Storage Backups
Enable Object Versioning on the storage bucket. Retain previous versions for 90 days.

---

## 9. Rollback Plan

### Hosting Rollback (Instant)
```bash
firebase hosting:rollback
```

### Firestore Rules Rollback
```bash
git checkout <previous-commit> -- firestore.rules
firebase deploy --only firestore:rules
```

### Full Rollback
```bash
git checkout <previous-tag>
firebase deploy --only hosting,firestore:rules,firestore:indexes,storage
```

---

## 10. Monitoring

### Recommended
- Firebase Performance Monitoring (Firebase Console)
- Cloud Monitoring alerts on PERMISSION_DENIED errors, payment failures, certificate failures
- Alert on Function error rate > 1%

### Currently Available
- Audit Logs: All admin actions logged in /auditLogs collection
- GET /api/analytics for platform health metrics
- GET /api/firebase/status for collection health

---

## 11. Known Limitations Before Launch

| Limitation | Risk | Action Required |
|---|---|---|
| Payment gateway not live | No revenue | Integrate Stripe live keys with crypto webhook verification |
| FCM push notifications | In-app only | Add FCM server key |
| Email notifications | None | Configure SendGrid |
| In-memory server state | Resets on restart | Migrate sessions to Firestore |
| No MFA enforcement | Admin credential risk | Enable MFA in Firebase Auth |
| HTTPS on node server | HTTP only locally | Use Firebase Hosting (handles HTTPS) in production |

---

## 12. Backend Maintenance

- Weekly: Review audit logs for suspicious activity
- Monthly: Rotate admin passwords, review active admin users
- Quarterly: Test backup restore, review Firestore security rules, audit permissions
- Before each deploy: Run all test suites

---

## 13. Files Reference

| File | Purpose | Commit? |
|---|---|---|
| firestore.rules | Firestore access control | Yes |
| storage.rules | Cloud Storage access control | Yes |
| firebase.json | Hosting + deploy configuration | Yes |
| firestore.indexes.json | Composite query indexes | Yes |
| .env | Active runtime secrets | NO — never |
| .env.development | Dev template (no real secrets) | Yes |
| .env.example | Minimal template | Yes |
| .env.staging | Staging template | Yes |
| .env.production | Prod template (no real keys) | Yes |
| js/admin-auth.js | Admin session guard | Yes |
| js/admin-services.js | All service repositories | Yes |
| server.js | Node.js API server | Yes |

