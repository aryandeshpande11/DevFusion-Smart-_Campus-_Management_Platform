import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { fetchSignupDepartments } from "../../api/authApi.js";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "coordinator", label: "Coordinator" },
];

const semesterOptions = Array.from({ length: 12 }, (_, index) => index + 1);

// signup form — role picker decides which dashboard the person lands in
// (admin accounts are provisioned separately, not self-served here)
export default function SignupPage() {
  const { signUp } = useAuth();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    departmentId: "",
    semester: "",
  });
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // department applies to students and faculty; semester is student-only
  const needsDepartment = formValues.role === "student" || formValues.role === "faculty";
  const needsSemester = formValues.role === "student";

  useEffect(() => {
    fetchSignupDepartments()
        .then(setDepartments)
        .catch(() => setDepartments([]));
  }, []);

  const updateField = (fieldName) => (event) =>
      setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      // only send what's relevant to the chosen role — the backend also
      // enforces this, but no point submitting a stale semester picked
      // before switching the role toggle
      const payload = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
        ...(needsDepartment && formValues.departmentId ? { departmentId: formValues.departmentId } : {}),
        ...(needsSemester && formValues.semester ? { semester: Number(formValues.semester) } : {}),
      };
      await signUp(payload);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Couldn't create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <AuthLayout title="Create your account" subtitle="Set up access for your campus role.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full name</label>
            <input
                required
                placeholder="Ananya Sharma"
                className="fieldInput"
                value={formValues.name}
                onChange={updateField("name")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">College email</label>
            <input
                type="email"
                required
                placeholder="name@college.edu"
                className="fieldInput"
                value={formValues.email}
                onChange={updateField("email")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="fieldInput"
                value={formValues.password}
                onChange={updateField("password")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((option) => (
                  <button
                      type="button"
                      key={option.value}
                      onClick={() => setFormValues((current) => ({ ...current, role: option.value }))}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                          formValues.role === option.value
                              ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-white/10"
                              : "border-border text-muted dark:border-white/10"
                      }`}
                  >
                    {option.label}
                  </button>
              ))}
            </div>
          </div>

          {needsDepartment && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Department</label>
                <select
                    required
                    className="fieldInput"
                    value={formValues.departmentId}
                    onChange={updateField("departmentId")}
                >
                  <option value="" disabled>
                    {departments.length ? "Select your department" : "Loading departments…"}
                  </option>
                  {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name} ({department.code})
                      </option>
                  ))}
                </select>
              </div>
          )}

          {needsSemester && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Semester</label>
                <select required className="fieldInput" value={formValues.semester} onChange={updateField("semester")}>
                  <option value="" disabled>
                    Select your semester
                  </option>
                  {semesterOptions.map((semester) => (
                      <option key={semester} value={semester}>
                        Semester {semester}
                      </option>
                  ))}
                </select>
              </div>
          )}

          <p className="text-xs text-muted">
            Don't see your department, or unsure of your semester? You can pick your best guess now — a faculty
            member or admin can correct it later, or you can update it yourself from your profile.
          </p>

          {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </AuthLayout>
  );
}