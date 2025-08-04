import React from "react";

const VideoPost = ({ post }) => {
  return (
    <div className="relative group overflow-hidden rounded">
      <video
        src={post.mediaUrl}
        controls={false}
        muted
        loop
        autoPlay
        className="w-full h-full object-cover"
      ></video>
      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-sm font-medium">
        <span>❤️ {post.likes.length}</span>
        <span>💬 {post.comments.length}</span>
      </div>
    </div>
  );
};

export default VideoPost;
