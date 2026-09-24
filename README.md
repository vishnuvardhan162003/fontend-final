# Eduzyra by Althexus

A full front-end build of the Eduzyra EdTech platform spec: course marketplace, checkout &
mock payments, an in-browser LMS player, certificates, and Student / Instructor / Admin
dashboards. Built with React 19, React Router and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Demo login

Signup always creates a **student** account. To preview the Instructor or Admin dashboards,
go to `/login` and use the **"Demo login as"** dropdown on the form (any email/password works —
auth is mocked, see "What's mocked" below).

## Project structure

```
src/
├── components/
│   ├── common/          Logo, SectionHeading, Spinner
│   ├── layout/           Navbar (role-aware), Footer, MainLayout
│   ├── home/               Hero, TrustStrip, FeaturedCourses, HowItWorks, Testimonials, FaqSection, CtaBand
│   ├── courses/              CourseCard, CourseFilters, CourseGrid
│   ├── course-detail/          CourseHeader, CourseOutcomes, CourseSyllabus, EnrollCard
│   ├── checkout/                 OrderSummary, CouponField, PaymentMethodPicker
│   ├── learning/                   LessonSidebar, VideoLesson, QuizLesson, AssignmentLesson
│   ├── certificate/                  CertificatePreview
│   ├── auth/                           AuthForm (shared by Login + Signup)
│   ├── dashboard/                        StatCard, EnrolledCourseCard (student)
│   ├── instructor/                         InstructorCourseCard
│   └── admin/                                AdminSidebar, DataTable, Admin*Panels
│
├── pages/                One file per route — composes the components above
├── routes/                 ProtectedRoute (any logged-in user), RoleRoute (instructor/admin only)
├── context/                  AuthContext — user, role, enrolledCourseIds
├── hooks/                      useAuth, useCourses
├── services/                     courseService, paymentService, certificateService
├── constants/                      site, courses, coupons, faqs, adminData
├── utils/                            format.js, lessonPlan.js
└── styles/                             index.css (Tailwind + design tokens)
```

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/`, `/courses`, `/courses/:id`, `/about`, `/contact` | Public | Marketing site + catalog |
| `/verify-certificate`, `/certificate/:id` | Public | Certificate verification (per spec §15) |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Public | Auth |
| `/checkout/:courseId` → `/payment/success` \| `/payment/failed` | Logged in | Checkout & payment flow (spec §7) |
| `/learn/:courseId` | Logged in + enrolled | LMS lesson player (spec §12) |
| `/dashboard`, `/profile` | Logged in | Student dashboard, account settings |
| `/instructor` | role = instructor | Instructor dashboard (spec §16) |
| `/admin` | role = admin | Admin dashboard: Overview, Students, Courses, Payments, Coupons, Certificates (spec §17) |

## What's mocked (and where to plug in a real backend)

This is a front-end-only build. Every place data is faked lives in `services/` or
`constants/`, specifically so swapping in a real backend touches only those files —
no component needs to change.

| Feature | Currently | Replace in |
|---|---|---|
| Course catalog | Static array | `services/courseService.js` |
| Auth (login/signup) | Any email/password "succeeds"; no real session/token | `context/AuthContext.jsx` |
| Payments | Simulated gateway; card ending `0000` fails on purpose to demo the retry flow | `services/paymentService.js` |
| Certificates | Issued/verified from an in-memory Map (resets on reload) | `services/certificateService.js` |
| Coupons | Hardcoded list (`WELCOME10`, `EARLYBIRD500`, `BATCH2026`) | `constants/coupons.js` |
| Admin/Instructor data (students, transactions, revenue) | Static mock arrays | `constants/adminData.js` |
| Lesson content | Generated placeholder lessons from each course's syllabus, not real video/quiz content | `utils/lessonPlan.js` |
| Emails (welcome, payment confirmation, etc.) | Not sent — no backend to send from | New `services/emailService.js` once a mail provider is connected |

Not built in this pass (out of scope for a frontend-only app, per spec §20/§21):
live classes, discussion forums, AI learning assistant, job board, and anything requiring
persistent storage, a real database, or server-side payment verification.

## Design tokens

Colors, fonts and spacing live in `tailwind.config.js` (`navy`, `teal`, `amber` palette,
`Space Grotesk` / `Inter` / `IBM Plex Mono` fonts). Shared button/card styles are Tailwind
component classes in `src/styles/index.css` (`.btn-primary`, `.btn-secondary`, `.btn-accent`,
`.card-surface`, `.container-page`, `.eyebrow`).
