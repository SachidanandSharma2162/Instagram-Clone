import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = useUser();

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      axios
        .get(`${url}/users/search?query=${query}`, { withCredentials: true })
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Search error:", err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, url]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-6 md:w-[400px] md:left-[65px] md:top-[70px] md:rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring focus:border-blue-400"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <button
          onClick={onClose}
          className="ml-3 text-gray-600 hover:text-black"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user._id}
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg"
              >
                <img
                  src={user.profilePic}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link to={`/user/${user.username}`} onClick={onClose}>
                  <div>
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchOverlay;
