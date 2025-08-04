import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ImagePost from "../components/ImagePost";
import VideoPost from "../components/VideoPost";
import { useUser } from "../context/userContext";

const Explore = () => {
  
  const [posts, setPosts] = useState([]);
  const { url } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${url}/posts/explore`, {
          withCredentials: true,
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, [url]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navbar */}
      <div className="hidden sm:block sticky top-0 h-screen z-10">
        <Navbar />
      </div>

      {/* Posts Grid */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Explore</h1>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {posts.map((post) =>
            post.mediaType === "image" ? (
              <ImagePost key={post._id} post={post} />
            ) : (
              <VideoPost key={post._id} post={post} />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
