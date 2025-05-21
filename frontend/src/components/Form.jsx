import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import Button from "./Button";

const Form = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return document.cookie.includes("rememberMe=true");
  });

  useEffect(() => {
    if (rememberMe) {
      document.cookie = "rememberMe=true; path=/; max-age=604800"; // 7 days
    } else {
      document.cookie = "rememberMe=false; path=/; max-age=0";
    }
  }, [rememberMe]);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (msg || error) {
      const timer = setTimeout(() => {
        setMsg("");
        setError("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [msg, error]);

  const handleInputChange = (e, type) => {
    setError("");
    if (type === "user") {
      setUser(e.target.value);
    } else if (type === "pass") {
      setPass(e.target.value);
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi input jika username atau password kosong
    if (user === "") {
      setError("Username harus dimasukkan.");
      return;
    }
  
    if (pass === "") {
      setError("Password harus dimasukkan.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: user, password: pass }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (!data || !data.result) {
        setError("Respon dari server tidak terduga.");
        return;
      }
  
      // Jika username tidak ditemukan
      if (data.result.includes("tidak ditemukan")) {
        setError("Username tidak ditemukan.");
      } 
      // Jika password salah
      else if (data.result.includes("salah")) {
        setError("Password yang dimasukkan salah.");
      } 
      // Jika login berhasil dan data valid
      else {
        setMsg(data.result);
  
        setTimeout(() => {
          // Navigasi berdasarkan peran user
          if (data.role === "admin") {
            navigate("/admin");
          } else if (data.role === "backoffice") {
            navigate("/dashboard");
          } else {
            navigate("/dashboard-user");
          }
        }, 2000);
      }
    } catch (err) {
      setError("Login gagal. Silakan coba lagi.");
      console.error(err);
    }
  };  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loginSubmit(e);
    }
  };

  return (
    <div className="relative px-4 sm:px-0">
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

      <form className="flex flex-col gap-4 max-w-sm mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => handleInputChange(e, "user")}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={pass}
            onChange={(e) => handleInputChange(e, "pass")}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            className="mr-2"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-700">Remember me</label>
        </div>

        <Button text="Login" onClick={loginSubmit} />
      </form>
    </div>
  );
};

export default Form;
