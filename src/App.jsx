import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://registration-form-env.eba-g3epv6jx.us-east-1.elasticbeanstalk.com/api/register";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Processing..." });

    try {
      await axios.post(API, formData);

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
      });

      fetchUsers();

      setStatus({ type: "success", msg: "Registration successful!" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setStatus({
        type: "error",
        msg: "Registration failed. Check server connection.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30">

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">

        {/* LEFT SIDE - FORM */}
        <div className="flex-1 p-10 md:p-16">
          <header className="mb-10">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
              Register
            </h1>
            <p className="text-slate-400 text-lg">
              Create your account to join our community.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="input"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              className="input"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={status.type === "loading"}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition disabled:opacity-50"
            >
              {status.type === "loading" ? "Registering..." : "Submit Registration"}
            </button>

            {status.msg && (
              <div
                className={`mt-4 p-3 rounded-xl text-center text-sm font-bold ${
                  status.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {status.msg}
              </div>
            )}
          </form>
        </div>

        {/* RIGHT SIDE - USERS */}
        <div className="w-full md:w-[380px] bg-slate-900/60 p-10 border-l border-slate-800/50 flex flex-col">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold text-white uppercase">Members</h3>
            <span className="bg-white text-black text-xs px-2 py-1 rounded">
              {users.length} TOTAL
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[400px]">
            {users.length > 0 ? (
              users.map((user, i) => (
                <div
                  key={user.id || i}
                  className="p-3 bg-slate-800/40 rounded-xl"
                >
                  <p className="text-white font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-indigo-400 text-sm">
                    @{user.username}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center">
                Awaiting Users...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tailwind Reusable Input Style */}
      <style>
        {`
          .input {
            width: 100%;
            background: rgba(30,41,59,0.4);
            border: 1px solid #334155;
            color: white;
            padding: 12px;
            border-radius: 12px;
            outline: none;
          }
          .input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 2px rgba(99,102,241,0.3);
          }
        `}
      </style>
    </div>
  );
}

export default App;
