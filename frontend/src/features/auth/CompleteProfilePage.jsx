import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { fetchSignupDepartments } from "../../api/authApi.js";
import { updateMyProfile } from "../../api/userApi.js";

const semesterOptions = Array.from({ length: 12 }, (_, index) => index + 1);

// Shown right after a Google sign-in for an account that's missing
// department (student/faculty) or semester (student) — Google only gives us
// name/email/photo, so this is the one thing OAuth users still have to fill
// in themselves before they can appear in any faculty roster.
export default function CompleteProfilePage() {
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.currentUser);
    const updateProfile = useAuthStore((state) => state.updateProfile);

    const needsDepartment = currentUser?.role === "student" || currentUser?.role === "faculty";
    const needsSemester = currentUser?.role === "student";

    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState(currentUser?.departmentId || "");
    const [semester, setSemester] = useState(currentUser?.semester || "");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // already complete (e.g. someone lands here manually) — nothing to do
        if (currentUser && !((needsDepartment && !currentUser.departmentId) || (needsSemester && !currentUser.semester))) {
            navigate(`/app/${currentUser.role}`, { replace: true });
            return;
        }
        fetchSignupDepartments()
            .then(setDepartments)
            .catch(() => setDepartments([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);
        try {
            const changes = {
                ...(needsDepartment ? { departmentId } : {}),
                ...(needsSemester ? { semester: Number(semester) } : {}),
            };
            const updatedUser = await updateMyProfile(changes);
            updateProfile(updatedUser);
            navigate(`/app/${currentUser.role}`, { replace: true });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Couldn't save that, please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) return null;

    return (
        <AuthLayout title="One more thing" subtitle="We need this so your courses and attendance show up correctly.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {needsDepartment && (
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Department</label>
                        <select
                            required
                            className="fieldInput"
                            value={departmentId}
                            onChange={(event) => setDepartmentId(event.target.value)}
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
                        <select
                            required
                            className="fieldInput"
                            value={semester}
                            onChange={(event) => setSemester(event.target.value)}
                        >
                            <option value="" disabled>
                                Select your semester
                            </option>
                            {semesterOptions.map((option) => (
                                <option key={option} value={option}>
                                    Semester {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                    Continue
                </Button>
            </form>
        </AuthLayout>
    );
}