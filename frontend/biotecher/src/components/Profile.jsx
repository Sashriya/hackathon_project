import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:8000/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      onLogout();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">👤 My Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={onLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>

        <button
          onClick={deleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;