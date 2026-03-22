import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    setLoading(true);
    setMessage("");
    setError("");

    try {

      const res = await axios.post(
 "https://login-backend-kc4u.onrender.com/api/auth/forgot-password",
 { email }
);

      // show success message
      setMessage(res.data.message);

    }
    catch {

      setError("Error sending reset link");

    }

    setLoading(false);

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 shadow rounded w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <input
          className="border p-2 mb-3 w-full"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* success message */}

        {message && (

          <p className="mt-3 text-green-600 text-sm text-center">
            {message}
          </p>

        )}

        {/* error */}

        {error && (

          <p className="mt-3 text-red-500 text-sm text-center">
            {error}
          </p>

        )}

      </div>

    </div>

  );

}

export default ForgotPassword;