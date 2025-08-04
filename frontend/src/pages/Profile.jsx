import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useUser } from "../context/userContext";
import ImagePost from "../components/ImagePost";
import VideoPost from "../components/VideoPost";
import { useNavigate } from "react-router-dom";
function Profile() {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/users/me`, {
          withCredentials: true,
        });
        setProfileUser(res.data.user);
        const postsRes = await axios.get(`${url}/posts/userpost`, {
          withCredentials: true,
        });
        setUserPosts(postsRes.data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username, url]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!profileUser)
    return <div className="text-center mt-10">User not found</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <Navbar />

      <div className="flex-1 p-4 sm:p-10 max-w-6xl mx-auto">
        {/* Top Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-16 mb-10">
          {/* Profile Pic */}
          <div className="mx-auto sm:mx-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
            <img
              src={profileUser.profilePic || "/images/default.jpg"}
              alt="profile"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Details */}
          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-semibold">
                {profileUser.fullName}
              </h1>
              <button
                className="px-4 py-1 border rounded-md text-sm font-medium hover:bg-gray-100"
                onClick={() => navigate(`/edit/${profileUser.username}`)}
              >
                Edit Profile
              </button>
              <button className="text-xl">⚙️</button>
            </div>

            <div className="flex justify-center sm:justify-start gap-6 text-sm mb-4">
              <span>
                <strong>{userPosts.length}</strong> posts
              </span>
              <span>
                <strong>{profileUser.followers?.length || 0}</strong> followers
              </span>
              <span>
                <strong>{profileUser.following?.length || 0}</strong> following
              </span>
            </div>

            <div>
              <p className="font-semibold">{profileUser.username}</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {profileUser.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 mb-6" />

        {/* Tabs */}
        <div className="flex justify-center gap-10 uppercase text-xs tracking-widest font-semibold text-gray-500 border-t pt-4">
          <button className="text-black border-t-2 border-black">Posts</button>
          <button className="hover:text-black">Saved</button>
          <button className="hover:text-black">Tagged</button>
        </div>

        {/* Post Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {userPosts.map((post) =>
            post.mediaType === "image" ? (
              <ImagePost key={post._id} post={post} />
            ) : (
              <VideoPost key={post._id} post={post} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
