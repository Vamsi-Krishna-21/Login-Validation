import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

  setError("");
  setLoading(true);

  try {

    const res = await axios.post(
  "https://login-backend-kc4u.onrender.com/api/auth/login",
  {
    emailOrUsername: identifier,
    password
  }
);

    localStorage.setItem("token", res.data.token);

    navigate("/dashboard");

  }

  catch(err){

    setError(

      err.response?.data?.message ||

      "Invalid email/username or password"

    );

  }

  setLoading(false);

};

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email or Username"
          onChange={(e)=>setIdentifier(e.target.value)}
        />

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded mb-3"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
          />

          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={()=>setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
 className="text-center text-sm mt-4 text-blue-500 cursor-pointer"
 onClick={() => navigate("/register")}
>
 Create new account
</p>

<p
 className="text-center text-sm mt-2 text-blue-500 cursor-pointer"
 onClick={() => navigate("/forgot-password")}
>
 Forgot password?
</p>

      </div>

    </div>

  );

}

export default Login;
