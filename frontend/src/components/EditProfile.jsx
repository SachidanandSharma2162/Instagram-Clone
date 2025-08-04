import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function EditProfile() {
  const { url } = useUser();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.put(`${url}/users/update-profile-pic`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile picture updated!");
      setUser(res.data.user);
      setUser((prev) => ({ ...prev, profilePic: res.data.user.profilePic }));
      setUser(res.data.user);
      setUser((prev) => ({ ...prev, profilePic: res.data.user.profilePic }));
      setUser(res.data.user); 
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile picture.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${url}/users/me`, {
          withCredentials: true,
        });
        const userData = res.data.user;
        setUser(userData);
        setBio(userData.bio || "");
        setGender(userData.gender || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${url}/users/update`,
        { bio, gender },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Navbar */}
      <div className="w-64 h-full hidden md:block">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 py-10 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-8">Edit Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <img
            src={user?.profilePic || "/images/default.jpg"}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className="text-center sm:text-left">
            <p className="font-semibold">{user?.username}</p>
            <p className="text-gray-500 text-sm">{user?.fullName}</p>
          </div>
          <label className="ml-auto bg-blue-500 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600 cursor-pointer">
  Change photo
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageUpload}
  />
</label>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              disabled
              className="w-full bg-gray-100 border px-4 py-2 rounded text-sm cursor-not-allowed"
              placeholder="Website"
            />
            <p className="text-xs text-gray-500 mt-1">
              Editing your links is only available on mobile.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={4}
              className="w-full border px-4 py-2 rounded text-sm resize-none"
              placeholder={
                user?.bio?.trim() ? user.bio : "Tell us about yourself..."
              }
            ></textarea>
            <p className="text-xs text-gray-500 text-right">{bio.length}/150</p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border px-4 py-2 rounded text-sm"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Custom">Custom</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This won't be part of your public profile.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium text-sm"
          >
            Submit
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-10">
          Certain profile info, like your name, bio and links, is visible to
          everyone.
        </p>
      </div>
    </div>
  );
}

export default EditProfile;
