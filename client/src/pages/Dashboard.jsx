import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://login-backend-kc4u.onrender.com/api/dashboard",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setData(res.data.message);

      } catch {
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-lg">My App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center w-96">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

          <p className="text-gray-600 mb-6 text-lg">{data}</p>

          <div className="text-sm text-gray-400">
            You are successfully logged in 🎉
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;