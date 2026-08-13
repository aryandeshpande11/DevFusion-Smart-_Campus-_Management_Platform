import React, { useState } from "react";
import { Github, Linkedin, Upload } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader.jsx";
import { Card } from "../../components/common/Card.jsx";
import Avatar from "../../components/common/Avatar.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMyProfile } from "../../api/userApi.js";
import { useToast } from "../../components/common/Toast.jsx";

// editable profile form — fields mirror the "Student Profile" section
// of the system design (name, phone, roll number, skills, links, bio...)
export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [formValues, setFormValues] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    rollNumber: currentUser?.rollNumber || "",
    linkedinUrl: currentUser?.linkedinUrl || "",
    githubUrl: currentUser?.githubUrl || "",
    bio: currentUser?.bio || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (fieldName) => (event) =>
    setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateMyProfile(formValues);
      showToast?.("Profile updated");
    } catch {
      showToast?.("Couldn't save your profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profile" description="How the rest of campus sees you." />

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4">
          <Avatar name={currentUser?.name} imageUrl={currentUser?.avatarUrl} size={64} />
          <Button variant="outline" size="sm">
            <Upload size={14} /> Change photo
          </Button>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full name</label>
            <input className="fieldInput" value={formValues.name} onChange={updateField("name")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone</label>
            <input className="fieldInput" value={formValues.phone} onChange={updateField("phone")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Roll number</label>
            <input className="fieldInput" value={formValues.rollNumber} onChange={updateField("rollNumber")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              <Github size={13} className="mr-1 inline" /> GitHub
            </label>
            <input className="fieldInput" value={formValues.githubUrl} onChange={updateField("githubUrl")} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              <Linkedin size={13} className="mr-1 inline" /> LinkedIn
            </label>
            <input className="fieldInput" value={formValues.linkedinUrl} onChange={updateField("linkedinUrl")} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Bio</label>
            <textarea
              rows={3}
              className="fieldInput"
              value={formValues.bio}
              onChange={updateField("bio")}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" isLoading={isSaving}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
