import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/userContext";

const Home = () => {
  const { url } = useUser();
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null); // optional: for like check

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${url}/posts/allposts`, {
          withCredentials: true,
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${url}/auth/profile`, {
          withCredentials: true,
        });
        setCurrentUserId(res.data._id);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchPosts();
    fetchCurrentUser();
  }, [url]);

  const handleLike = async (postId) => {
    try {
      await axios.put(`${url}/posts/${postId}/like`, {}, { withCredentials: true });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(currentUserId)
                  ? post.likes.filter((id) => id !== currentUserId)
                  : [...post.likes, currentUserId],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentInput[postId];
    if (!text?.trim()) return;
    try {
      await axios.post(`${url}/posts/${postId}/comment`, { text }, { withCredentials: true });
      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto px-4 py-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-md mb-8 p-5 hover:shadow-lg transition-shadow duration-300"
          >
            {/* User Info */}
            <div className="flex items-center mb-4">
              <img
                src={post.user?.profilePic || "/images/default-avatar.png"}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover mr-4 border"
              />
              <div>
                <p className="font-semibold text-lg">{post.user?.username}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Media */}
            <div className="rounded-lg overflow-hidden mb-3">
              {post.mediaType === "image" ? (
                <img
                  src={post.mediaUrl}
                  alt="post"
                  className="w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <video
                  src={post.mediaUrl}
                  controls
                  className="w-full object-cover"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 my-3 text-gray-600">
              <button
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    post.likes.includes(currentUserId)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                <span className="text-sm">{post.likes.length}</span>
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments.length}</span>
              </div>
            </div>

            {/* Caption */}
            {post.caption && (
              <p className="text-sm mb-3">
                <span className="font-semibold">{post.user?.username}</span> {post.caption}
              </p>
            )}

            {/* Comments (first only) */}
            {post.comments?.[0] && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">{post.comments[0].user?.username}:</span>{" "}
                {post.comments[0].text}
              </p>
            )}

            {/* Add Comment */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput[post._id] || ""}
                onChange={(e) =>
                  setCommentInput({ ...commentInput, [post._id]: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => handleComment(post._id)}
                className="text-blue-600 font-medium text-sm mt-2 hover:underline"
              >
                Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
