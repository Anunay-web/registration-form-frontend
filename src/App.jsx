import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "", email: ""
  });
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://registration-form-env.eba-g3epv6jx.us-east-1.elasticbeanstalk.com/api/register");
      if (Array.isArray(res.data)) setUsers(res.data);
    } catch (err) {
      console.error("Backend unreachable. Ensure server is running on port 8080.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Processing..." });
    try {
      await axios.post("http://registration-form-env.eba-g3epv6jx.us-east-1.elasticbeanstalk.com/api/register", formData);
      setFormData({ firstName: "", lastName: "", username: "", email: "" });
      fetchUsers();
      setStatus({ type: "success", msg: "Registration successful!" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    } catch (err) {
      setStatus({ type: "error", msg: "Registration failed. Check server connection." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* LEFT: THE REGISTER FORM */}
        <div className="flex-1 p-10 md:p-16">
          <header className="mb-10">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
              Register
            </h1>
            <p className="text-slate-400 text-lg">Create your account to join our community.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
                <input
                  className="w-full bg-slate-800/40 border border-slate-700 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  type="text" name="firstName" placeholder="Anunay"
                  value={formData.firstName} onChange={handleChange} required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
                <input
                  className="w-full bg-slate-800/40 border border-slate-700 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  type="text" name="lastName" placeholder="Kumar"
                  value={formData.lastName} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">@</span>
                <input
                  className="w-full bg-slate-800/40 border border-slate-700 text-white p-4 pl-10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  type="text" name="username" placeholder="anunaykumar"
                  value={formData.username} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
              <input
                className="w-full bg-slate-800/40 border border-slate-700 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                type="email" name="email" placeholder="anunay@example.com"
                value={formData.email} onChange={handleChange} required
              />
            </div>

            <button
              type="submit"
              disabled={status.type === "loading"}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-900/40 transition-all active:scale-[0.97] disabled:opacity-50 uppercase tracking-widest mt-4"
            >
              {status.type === "loading" ? "Registering..." : "Submit Registration"}
            </button>

            {status.msg && (
              <div className={`mt-4 p-4 rounded-2xl text-center text-sm font-bold border ${
                status.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {status.msg}
              </div>
            )}
          </form>
        </div>

       
        <div className="w-full md:w-[380px] bg-slate-900/60 p-10 border-l border-slate-800/50 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Members</h3>
            <span className="bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-md">
              {users.length} TOTAL
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[500px]">
            {users.length > 0 ? (
              users.map((user, i) => (
                <div key={user.id || i} className="group flex items-center gap-4 p-4 bg-slate-800/30 rounded-[1.5rem] border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                    {user.firstName ? user.firstName[0].toUpperCase() : "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate leading-none mb-1">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-indigo-400 text-xs font-medium truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                <div className="w-16 h-16 border-4 border-dashed border-slate-600 rounded-full mb-4 animate-spin-slow"></div>
                <p className="text-sm font-bold uppercase tracking-widest text-white">Awaiting Users</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;