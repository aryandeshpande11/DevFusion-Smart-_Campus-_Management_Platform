# Smart Campus Management Platform — System Design

**Stack:** React (Vite) · Node.js/Express · PostgreSQL · Docker · Render (backend) + Vercel (frontend)

---

## 1. High-Level Architecture

```
                         ┌─────────────────────────┐
                         │        Vercel           │
                         │  React SPA (Vite + TS)  │
                         │  - Axios/React Query     │
                         │  - Zustand/Redux store   │
                         └───────────┬──────────────┘
                                     │ HTTPS (REST + WS)
                                     ▼
                         ┌─────────────────────────┐
                         │         Render          │
                         │   Node.js/Express API    │
                         │  - Auth middleware        │
                         │  - RBAC middleware        │
                         │  - Rate limiter            │
                         │  - Controllers/Services    │
                         │  - Socket.IO (real-time)   │
                         └───────────┬──────────────┘
                          ┌──────────┼───────────┐
                          ▼          ▼           ▼
                 ┌───────────┐ ┌──────────┐ ┌───────────────┐
                 │ PostgreSQL│ │  Redis    │ │ Cloudinary/S3  │
                 │ (Render)  │ │ (sessions,│ │ (files, resumes,│
                 │           │ │  cache,   │ │  banners, PFPs) │
                 │           │ │  queue)   │ │                │
                 └───────────┘ └──────────┘ └───────────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │ Nodemailer / Resend│  (email verification, OTP, reminders)
                 └───────────────────┘
```

- Everything containerized: separate `Dockerfile` for frontend (build → static) and backend, plus a `docker-compose.yml` for local dev (api + postgres + redis).
- Production: frontend on **Vercel**, backend + Postgres on **Render**, Docker image used for both local dev parity and CI.
- Socket.IO (or a lightweight SSE fallback) handles real-time notifications, live attendance sessions, and chat (bonus).

---

## 2. Backend Folder Structure

```
server/
├── src/
│   ├── config/            # db.js, env.js, redis.js, cloudinary.js, passport.js
│   ├── models/             # Sequelize/Prisma models (User, Role, ...)
│   ├── controllers/        # request handlers, thin
│   ├── services/            # business logic (attendanceService, eventService...)
│   ├── routes/               # route definitions per module
│   ├── middlewares/          # auth.js, rbac.js, rateLimit.js, upload.js, errorHandler.js
│   ├── validators/           # zod/joi schemas per route
│   ├── sockets/               # socket.io namespaces/handlers
│   ├── jobs/                   # cron jobs (deadline reminders, digest emails)
│   ├── utils/                   # jwt.js, otp.js, logger.js, response.js
│   └── app.js
├── prisma/ or migrations/
├── tests/
├── Dockerfile
└── server.js
```

## 3. Frontend Folder Structure

```
client/
├── src/
│   ├── api/                # axios instance + endpoint wrappers per module
│   ├── components/          # shared UI (Button, Card, Modal, Table...)
│   ├── features/             # feature-sliced: auth, dashboard, attendance, events...
│   ├── layouts/                # RoleLayout (StudentLayout, FacultyLayout, AdminLayout)
│   ├── routes/                   # ProtectedRoute, RoleRoute, router config
│   ├── store/                     # Zustand/Redux slices
│   ├── hooks/                      # useAuth, useSocket, useDebounce...
│   ├── theme/                       # Tailwind config, dark/light tokens
│   └── main.tsx
├── Dockerfile
```

---

## 4. Database Design (PostgreSQL)

### Core Tables

**users**
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | varchar | |
| email | varchar unique | |
| password_hash | varchar nullable | null if Google-only |
| google_id | varchar nullable unique | |
| phone | varchar | |
| role_id | FK → roles | |
| department_id | FK → departments | |
| roll_number | varchar nullable | students |
| semester | int nullable | |
| skills | text[] | |
| linkedin_url | varchar | |
| github_url | varchar | |
| resume_url | varchar | |
| bio | text | |
| avatar_url | varchar | |
| is_email_verified | boolean | |
| is_active | boolean | for soft delete/ban |
| created_at / updated_at | timestamp | |

**roles** — `id, name (student/faculty/coordinator/admin), permissions (jsonb)`

**departments** — `id, name, code`

**courses** — `id, name, code, department_id, semester`

**attendance_sessions** — `id, course_id, faculty_id, date, start_time, end_time, qr_token, status`

**attendance_records** — `id, session_id, student_id, status (present/absent/late), marked_at, method (manual/qr/face)`

**assignments** — `id, course_id, faculty_id, title, description, attachments (jsonb), rubric (jsonb), deadline, created_at`

**assignment_submissions** — `id, assignment_id, student_id, file_url, github_link, submitted_at, is_late, marks, feedback, status (pending/reviewed)`

**events** — `id, title, description, banner_url, venue, seats_total, seats_filled, registration_deadline, speakers (jsonb), qr_code, created_by, status`

**event_registrations** — `id, event_id, student_id, registered_at, status (registered/cancelled), qr_pass_url, checked_in`

**clubs** — `id, name, description, coordinator_id, banner_url`

**club_memberships** — `id, club_id, student_id, status (pending/approved/rejected), joined_at`

**placements** — `id, company_name, job_role, eligibility (jsonb), ctc, deadline, description, created_by`

**placement_applications** — `id, placement_id, student_id, resume_url, status (applied/shortlisted/rejected/selected), applied_at`

**notices/announcements** — `id, title, content, target_role, target_department, created_by, created_at`

**notifications** — `id, user_id, type, title, message, is_read, link, created_at`

**settings** — `id, user_id, theme, notification_prefs (jsonb), language`

**activity_logs** — `id, actor_id, action, entity_type, entity_id, metadata (jsonb), created_at`

### Relationships (summary)
- `users.role_id → roles.id` (1:N)
- `users.department_id → departments.id` (1:N)
- `courses.department_id → departments.id`
- `attendance_sessions.course_id → courses.id`, `.faculty_id → users.id`
- `attendance_records.session_id → attendance_sessions.id`, `.student_id → users.id`
- `assignments.course_id → courses.id`
- `assignment_submissions.assignment_id / student_id`
- `events.created_by → users.id`; `event_registrations.event_id / student_id`
- `club_memberships.club_id / student_id`
- `placement_applications.placement_id / student_id`

*(I can generate the ER diagram image itself — say the word and I'll render it visually.)*

---

## 5. Authentication & Authorization Design

- **Signup:** email+password (bcrypt, 12 rounds) or Google OAuth (passport-google-oauth20).
- **Email verification:** signed token (JWT, 24h expiry) emailed via Nodemailer/Resend; dashboard blocked until verified (`is_email_verified` check in middleware).
- **Login:** issues **access token** (JWT, 15 min, in memory/short cookie) + **refresh token** (httpOnly secure cookie, 7 days, rotated on use, stored hashed in Redis/DB for revocation).
- **Forgot password:** OTP (6-digit, Redis with 5 min TTL) or reset link (JWT, 15 min) — pick one, OTP is simpler to demo live.
- **RBAC middleware:** `requireAuth` → `requireRole(['admin','faculty'])`, permission checks pull from `roles.permissions` JSONB so it's data-driven, not hardcoded.
- **Logout:** clears refresh cookie + deletes Redis session entry.
- **Rate limiting:** `express-rate-limit` on `/auth/*` (5 req/min) and file uploads.

---

## 6. API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/signup` | public |
| POST | `/login` | public |
| GET | `/google` / `/google/callback` | public |
| POST | `/verify-email` | public (token) |
| POST | `/resend-verification` | public |
| POST | `/forgot-password` | public |
| POST | `/verify-otp` | public |
| POST | `/reset-password` | public |
| POST | `/refresh-token` | public (cookie) |
| POST | `/logout` | auth |
| GET | `/me` | auth |

### Users / Profile (`/api/users`)
| Method | Endpoint | Access |
|---|---|---|
| GET | `/me` | auth |
| PATCH | `/me` | auth |
| POST | `/me/avatar` | auth |
| POST | `/me/resume` | auth (student) |
| GET | `/` | admin |
| GET | `/:id` | admin/faculty |
| PATCH | `/:id/role` | admin |
| PATCH | `/:id/status` | admin (activate/deactivate) |
| DELETE | `/:id` | admin |

### Departments & Courses (`/api/departments`, `/api/courses`)
| Method | Endpoint | Access |
|---|---|---|
| GET/POST | `/departments` | GET: all, POST: admin |
| PATCH/DELETE | `/departments/:id` | admin |
| GET/POST | `/courses` | GET: all, POST: admin |
| PATCH/DELETE | `/courses/:id` | admin |
| GET | `/courses/:id/students` | faculty/admin |

### Attendance (`/api/attendance`)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/sessions` | faculty (create session, generates QR token) |
| GET | `/sessions/:courseId` | faculty/student |
| POST | `/sessions/:id/mark` | faculty (manual) |
| POST | `/sessions/:id/scan` | student (QR self mark) |
| GET | `/me/history` | student |
| GET | `/me/summary` | student (% + subject-wise) |
| GET | `/reports/:courseId` | faculty |
| GET | `/reports/monthly` | admin |

### Assignments (`/api/assignments`)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | faculty |
| GET | `/course/:courseId` | student/faculty |
| GET | `/:id` | auth |
| PATCH/DELETE | `/:id` | faculty |
| POST | `/:id/submit` | student |
| GET | `/:id/submissions` | faculty |
| PATCH | `/submissions/:id/review` | faculty (marks + feedback) |
| GET | `/me/submissions` | student |

### Events (`/api/events`)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | coordinator/admin |
| GET | `/` | auth (with filters: upcoming/past) |
| GET | `/:id` | auth |
| PATCH/DELETE | `/:id` | coordinator/admin |
| POST | `/:id/register` | student |
| DELETE | `/:id/register` | student (cancel) |
| GET | `/:id/ticket` | student (QR pass) |
| GET | `/:id/attendees` | coordinator/admin |
| POST | `/:id/checkin` | coordinator (scan QR pass) |

### Clubs (`/api/clubs`)
| Method | Endpoint | Access |
|---|---|---|
| POST/GET | `/` | POST: coordinator, GET: all |
| PATCH/DELETE | `/:id` | coordinator/admin |
| POST | `/:id/join` | student |
| PATCH | `/:id/members/:userId` | coordinator (approve/reject) |
| GET | `/:id/members` | coordinator |

### Placements (`/api/placements`)
| Method | Endpoint | Access |
|---|---|---|
| POST/GET | `/` | POST: admin, GET: all |
| GET | `/:id` | auth |
| PATCH/DELETE | `/:id` | admin |
| POST | `/:id/apply` | student |
| GET | `/:id/applications` | admin |
| PATCH | `/applications/:id/status` | admin |
| GET | `/me/applications` | student |

### Notices/Announcements (`/api/notices`)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | faculty/coordinator/admin |
| GET | `/` | auth (filtered by role/dept) |
| DELETE | `/:id` | owner/admin |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access |
|---|---|---|
| GET | `/` | auth |
| PATCH | `/:id/read` | auth |
| PATCH | `/read-all` | auth |
| DELETE | `/:id` | auth |

### Search (`/api/search`)
| Method | Endpoint | Access |
|---|---|---|
| GET | `/?q=&type=` | auth — global search across students/faculty/events/assignments/placements |

### Analytics/Admin (`/api/analytics`, `/api/admin`)
| Method | Endpoint | Access |
|---|---|---|
| GET | `/analytics/overview` | admin (totals: students, faculty, dept, events) |
| GET | `/analytics/attendance` | admin |
| GET | `/analytics/placements` | admin |
| GET | `/analytics/events` | admin |
| GET | `/admin/logs` | admin (activity logs, paginated) |
| GET | `/admin/export/:entity` | admin (CSV/Excel export) |

### Settings (`/api/settings`)
| Method | Endpoint | Access |
|---|---|---|
| GET/PATCH | `/` | auth (theme, notif prefs, language) |
| POST | `/connected-accounts/google` | auth |
| DELETE | `/me` | auth (delete account) |

### WebSocket events (Socket.IO)
- `notification:new`, `attendance:session-live`, `event:seat-update`, `chat:message` (bonus)

---

## 7. Future / Extra Endpoints (v2 roadmap)

| Endpoint | Purpose |
|---|---|
| `POST /api/attendance/sessions/:id/face-scan` | face-recognition attendance |
| `POST /api/assignments/:id/plagiarism-check` | AI plagiarism detection |
| `POST /api/chat/rooms`, `GET /api/chat/rooms/:id/messages` | student↔faculty live chat |
| `GET /api/calendar/sync` | Google Calendar sync (events, deadlines) |
| `POST /api/chatbot/query` | AI FAQ chatbot (RAG over college docs) |
| `GET /api/leaderboard/:type` | gamified attendance/participation leaderboard |
| `POST /api/feedback/course/:id` | anonymous course/faculty feedback |
| `GET /api/timetable/:courseId` | full timetable module |
| `POST /api/library/reserve` | library book reservation (extension domain) |
| `GET /api/alumni` | alumni network module |
| `POST /api/payments/fee` | fee payment integration (Razorpay/Stripe) |
| `GET /api/reports/pdf/:type` | server-generated PDF reports |
| `POST /api/webhooks/email-status` | email delivery status webhook |

---

## 8. Feature Checklist Mapped to Requirements

- **Auth:** email+password, Google OAuth, email verification, OTP/reset link, JWT + refresh rotation, protected routes, RBAC (4 roles).
- **Dashboards:** distinct Student / Faculty / Coordinator / Admin dashboards, each pulling role-scoped analytics.
- **Attendance:** session creation, manual + QR self-mark, history, subject-wise %, monthly reports.
- **Assignments:** upload with deadline/attachments/rubric, submission (PDF/ZIP/GitHub link), late-flagging, review with marks+feedback.
- **Events:** creation with banner/venue/seats/speakers, QR-based registration + check-in, cancel registration.
- **Clubs:** creation, membership requests, approvals.
- **Placements:** company postings, eligibility, apply with resume, status tracking.
- **Notices/Announcements:** role/department targeted.
- **Notifications:** real-time via Socket.IO + persisted list, read/unread.
- **Search:** global search across entities.
- **Admin panel:** manage users/departments/courses/events/assignments/attendance/announcements, view logs, permissions, CSV/Excel export.
- **UI/UX:** responsive, dark/light mode, skeleton loaders, empty/error/success states, toast notifications, accessible forms.
- **Security:** bcrypt hashing, Joi/Zod validation, rate limiting, CSRF (double-submit cookie if using cookies), XSS sanitization (helmet + sanitize-html), secure httpOnly cookies, `.env` config, file-type/size validation on uploads, authorization middleware on every protected route, audit logging on sensitive admin actions.

---

## 9. Deployment

- **Frontend (Vercel):** React (Vite) build, env vars for `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`.
- **Backend (Render):** Docker web service, env vars for DB URL, JWT secrets, SMTP creds, Cloudinary keys, Redis URL.
- **Database:** Render-managed PostgreSQL (or Supabase as alt); run migrations on deploy (`prisma migrate deploy` / `sequelize-cli db:migrate`).
- **Docker Compose (local dev):**
```yaml
services:
  api:
    build: ./server
    ports: ["5000:5000"]
    env_file: .env
    depends_on: [postgres, redis]
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: campus
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
```
- CI/CD: GitHub Actions → lint/test → build Docker image → deploy to Render on push to `main`.

---

## 10. Future Scope (post-hackathon)

1. AI campus chatbot (RAG over notices/FAQs) using an LLM API.
2. Face-recognition attendance via on-device model + liveness check.
3. Native mobile app (React Native) reusing the same API.
4. Fee payment gateway integration.
5. Alumni network + mentorship module.
6. Timetable/scheduling engine with clash detection.
7. Course feedback + faculty rating system.
8. Multi-college/multi-tenant support (organization-scoped data).
9. Offline-first PWA with background sync for attendance/notices.
10. Advanced analytics: predictive at-risk-student flagging from attendance+grades trends.

---

*Want me to turn the ER diagram or the request flow (auth, attendance-marking) into a visual diagram? I can render those inline.*
