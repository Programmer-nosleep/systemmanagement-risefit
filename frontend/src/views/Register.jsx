import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (msg || error) {
      const timer = setTimeout(() => {
        setMsg("");
        setError("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [msg, error]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/backend/api/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, username: user, password: pass }),
    });

    const data = await response.json();

    if (response.ok) {
      setMsg(data.success);
      setTimeout(() => navigate("/dashboard-user"), 1500);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Logo classValue="absolute m-5" theme="dark"/>
      <div className="flex flex-1 items-center justify-center px-4 sm:px-0">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-5">Daftar Akun</h2>
          <div className="relative">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                <span>{error}</span>
              </div>
            )}
            {msg && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <span>{msg}</span>
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <Button text="Daftar" onClick={handleRegister} />
            </form>
            <div className="flex flex-col items-center justify-center">
              <div className="mt-4 text-sm text-gray-600 mb-1.5">
                Sudah punya akun? langsung{" "}
                <Link to="/" className="text-purple-500 hover:text-purple-700 hover:underline">
                  Login
                </Link>{" "}
                di sini.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
