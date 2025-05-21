import { Link } from "react-router-dom";

import Logo from "../components/Logo";
import Form from "../components/Form";
import Footer from "../components/Footer";

const Login = () => {  
  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Logo classValue="absolute m-5" theme="dark"/>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-96">
          <h2 className="text-2xl font-bold text-center mb-5">
            Masuk ke Akun<br/>
          </h2>
          <Form />
          <div className="flex flex-col items-center justify-center">
            <div className="mt-4 text-sm text-gray-600 mb-1.5">
              Belum punya akun? <Link to="/register" className="text-purple-500 hover:text-purple-700 hover:underline">Daftar</Link> terlebih dahulu.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
