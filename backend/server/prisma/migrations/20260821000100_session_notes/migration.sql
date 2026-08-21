-- Free-text notes a faculty member can attach to a class session (e.g. topics covered).
ALTER TABLE "attendance_sessions" ADD COLUMN "notes" TEXT;