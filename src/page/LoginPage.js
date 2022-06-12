import { useState } from "react";
import axiosApi from "../api/axiosApi";
import { useNavigate } from 'react-router-dom';
import "../css/Loginpage.css";
import "../css/common.css";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  const performLogin = () => {
    axiosApi
      .post("/login", {
        email: username,
        password: password,
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        navigate('/home')
      })
      .catch(function (error) {
        setResult(error.message);
      });
  };

  return (
    <div className="mainpage-bg full-screen mt-0 d-flex">
      <div className=" pt-5 mx-5 width-300px">
        <h1>Login</h1>

        <div className="mb-3 mt-3">
          <label for="name" className="text-size-label">username</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className="mb-3 mt-3">
          <label for="pass"  className=" text-size-label">password</label>
          <input
            type="password"
            id="pass"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <input
            type="button"
            value="login"
            className="btn btn-warning btn-lg mt-2"
            onClick={performLogin}
          ></input>
        </div>
        <div className="p-3">
          <p className="text-danger">{result}</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
