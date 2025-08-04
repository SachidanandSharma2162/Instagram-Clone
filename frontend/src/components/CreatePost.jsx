import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ closeModal }) => {
  const { user, setUser, loading, isAuthenticated, setIsAuthenticated, url } =
    useUser(); // From context
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    const toastId = toast.loading("Uploading...");

    try {
      await axios.post(`${url}/posts/createpost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.dismiss(toastId);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.dismiss(toastId);
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        console.error("Response data:", error.response.data);
        toast.error(
          `Upload failed: ${error.response.data.message || "Server error"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Check your network or server.");
      } else {
        console.error("Axios error:", error.message);
        toast.error("Error: " + error.message);
      }
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left - Preview/Upload */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 relative">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="max-h-[400px] max-w-full object-contain rounded"
              />
            ) : (
              <label
                htmlFor="upload-input"
                className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition"
              >
                <img
                  src="https://img.icons8.com/ios/100/image--v1.png"
                  alt="upload"
                  className="w-12 mb-2 opacity-60"
                />
                <p className="text-gray-500 text-sm">
                  Drag and drop a photo or video
                </p>
                <p className="text-sm text-blue-600 font-semibold mt-2">
                  Select from computer
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="upload-input"
                />
              </label>
            )}
          </div>

          {/* Right - Form */}
          <div className="w-full md:w-[40%] border-l p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
                Create New Post
              </h2>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write a caption..."
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  closeModal?.(); // Close the modal if function is passed
                  navigate(`/user/${user.username}`); // Navigate to home
                }}
                className="text-gray-600 hover:text-black transition text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
