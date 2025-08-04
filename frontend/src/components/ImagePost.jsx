import React from "react";

const ImagePost = ({ post }) => {
  return (
    <div className="relative group overflow-hidden rounded">
      <img
        src={post.mediaUrl}
        alt={post.caption}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-sm font-medium">
        <span>❤️ {post.likes?.length || 0}</span>
        <span>💬 {post.comments?.length || 0}</span>
      </div>
    </div>
  );
};

export default ImagePost;
