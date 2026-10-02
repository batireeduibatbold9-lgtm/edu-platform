# Edu Platform — Supabase + HTML/CSS/JavaScript

A starter learning platform with:
- Teacher / Student authentication
- Classes, subjects and lessons
- PDF materials stored in Supabase Storage
- Teacher-created exams and questions
- Timed exams using server-stored `ends_at`
- Auto grading
- Results and leaderboard
- In-app notifications
- RLS policies
- Optional email notification Edge Function
- Optional scheduled expiry job

## 1. Create Supabase project

Create a new Supabase project.

Open **SQL Editor**, paste the whole file:

`supabase/schema.sql`

Run it.

Then create the Storage bucket if the SQL did not create it automatically:
- Storage → New bucket
- Name: `materials`
- Public: OFF

## 2. Configure frontend

Open:

`js/config.js`

Put your Supabase project URL and anon key there.

The anon key is safe to expose in browser code when RLS is configured correctly. NEVER put a service-role key in frontend files.

## 3. Run locally

Use VS Code + Live Server, or any static web server.

Do not open `index.html` directly with `file://` if your browser blocks modules.

Example:
- VS Code → Live Server → Open with Live Server.

## 4. Create accounts

Use the Sign Up page. The profile trigger creates a profile automatically.

For the first teacher:
1. Sign up.
2. In Supabase Table Editor → profiles, change that user's `role` to `teacher`.

Later, you can build an admin screen to assign roles.

## 5. Email

The main app uses in-app notifications without needing a secret key.

For real Gmail/email delivery, deploy:

`supabase/functions/send-exam-email/index.ts`

Set these Supabase secrets:
- RESEND_API_KEY
- FROM_EMAIL

Then call the function after creating an exam.

## 6. Important exam behavior

The browser displays the countdown, but the database stores `ends_at`.
The client cannot extend the exam by changing JavaScript.

When a student opens/submits an exam, the database function checks the server time. If `ends_at` has passed, the attempt is treated as expired.

For fully automatic expiry while a student is offline, enable the optional pg_cron section at the bottom of `schema.sql`.
