import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    setError("");
    setSuccess("");

    if(password.length < 6){
      setError("Password must be at least 6 characters");
      return;
    }

    if(password !== confirmPassword){
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      await axios.post(
 `https://login-backend-kc4u.onrender.com/api/auth/reset-password/${token}`,
 { password }
);

      setSuccess("Password reset successful");

      setTimeout(()=>{
        navigate("/");
      },2000);

    }
    catch{

      setError("Invalid or expired reset link");

    }

    setLoading(false);

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {/* new password */}

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="border p-2 w-full mb-3"
            onChange={(e)=>setPassword(e.target.value)}
          />

          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={()=>setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>

        {/* confirm */}

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          className="border p-2 w-full mb-3"
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-2">
            {success}
          </p>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </div>

    </div>

  );

}

export default ResetPassword;