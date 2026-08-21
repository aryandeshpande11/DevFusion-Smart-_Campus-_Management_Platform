-- Link a course to the single faculty member who teaches it.
-- Nullable so existing courses don't break; assign faculty via the admin UI after this runs.
ALTER TABLE "courses" ADD COLUMN "faculty_id" TEXT;

ALTER TABLE "courses" ADD CONSTRAINT "courses_faculty_id_fkey"
    FOREIGN KEY ("faculty_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;