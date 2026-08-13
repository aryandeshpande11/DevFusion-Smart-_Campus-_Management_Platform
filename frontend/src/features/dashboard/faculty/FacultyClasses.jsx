import React from "react";
import { BookOpen } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listCourses } from "../../../api/analyticsApi.js";

// courses this faculty member teaches — jumping-off point for
// attendance sessions and study material uploads
export default function FacultyClasses() {
  const { data: courses, isLoading } = useFetch(listCourses);

  if (isLoading) return <Loader label="Loading your classes" />;

  return (
    <div>
      <PageHeader title="Classes" description="Courses you teach this semester." />

      {(!courses || courses.length === 0) && (
        <EmptyState icon={BookOpen} title="No classes assigned yet" description="Courses assigned to you by admin will appear here." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Card key={course.id}>
            <p className="font-medium">{course.name}</p>
            <p className="mt-1 text-sm text-muted">{course.code} · Semester {course.semester}</p>
            <p className="mt-3 text-sm text-muted">{course.studentCount ?? 0} students enrolled</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
