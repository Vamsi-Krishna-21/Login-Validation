import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // password strength checker
  const getStrength = () => {

    if(password.length < 6) return "Weak";

    if(
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@$!%*?&]/.test(password)
    ){
      return "Strong";
    }

    return "Medium";
  };

  const strength = getStrength();

  const handleRegister = async () => {

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

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          username,
          email,
          password
        }
      );

      setSuccess("Account created successfully");

      setTimeout(()=>{
        navigate("/");
      },1500);

    }
    catch{

      setError("Registration failed");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Username"
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        {/* password */}

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded mb-1"
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

        {/* strength */}

        {password && (

          <p className={
            strength === "Weak"
            ? "text-red-500 text-sm"
            : strength === "Medium"
            ? "text-yellow-600 text-sm"
            : "text-green-600 text-sm"
          }>

            Strength: {strength}

          </p>

        )}

        {/* checklist */}

        <div className="text-sm mt-1">

          <p className={password.length >= 6 ? "text-green-600" : "text-gray-400"}>
            ✔ minimum 6 characters
          </p>

          <p className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"}>
            ✔ 1 uppercase letter
          </p>

          <p className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-400"}>
            ✔ 1 number
          </p>

        </div>

        {/* confirm password */}

        <input
          type={showPassword ? "text" : "password"}
          className="w-full p-2 border rounded mt-3 mb-3"
          placeholder="Re-enter Password"
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
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>

        <p
          className="text-center text-sm mt-4 text-blue-500 cursor-pointer"
          onClick={()=>navigate("/")}
        >
          Already have an account? Login
        </p>

      </div>

    </div>

  );

}

export default Register;