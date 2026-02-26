import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:8000/contact", {
        name,
        email,
        message,
      });

      setSuccess("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📩 Contact Us</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-xl h-32"
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          Send Message
        </button>

        {success && (
          <p className="text-green-600 font-semibold mt-4">
            {success}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactUs;