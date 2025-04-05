import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authAPI } from "@/api/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProfileDescription = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfileById(id);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl font-bold mb-4">{profile.fullName}</h1>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone}</p>
          <p>Location: {profile.location}</p>
          <p>Bio: {profile.bio}</p>
          <p>Skills: {profile.skills ? profile.skills.join(", ") : "No skills listed"}</p>
          {profile.experience && profile.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mt-4">Experience</h2>
              {profile.experience.map((exp, index) => (
                <div key={index} className="mb-2">
                  <p>Title: {exp.title}</p>
                  <p>Company: {exp.company}</p>
                  <p>Location: {exp.location}</p>
                  <p>From: {new Date(exp.from).toLocaleDateString()}</p>
                  <p>To: {exp.current ? "Present" : new Date(exp.to).toLocaleDateString()}</p>
                  <p>Description: {exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {profile.education && profile.education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mt-4">Education</h2>
              {profile.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p>School: {edu.school}</p>
                  <p>Degree: {edu.degree}</p>
                  <p>Field of Study: {edu.fieldOfStudy}</p>
                  <p>From: {new Date(edu.from).toLocaleDateString()}</p>
                  <p>To: {edu.current ? "Present" : new Date(edu.to).toLocaleDateString()}</p>
                  <p>Description: {edu.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileDescription;
