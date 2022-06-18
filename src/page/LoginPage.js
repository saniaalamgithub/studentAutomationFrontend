import { useState } from "react";
import axiosApi from "../api/axiosApi";
import { useNavigate } from "react-router-dom";
import "../css/Loginpage.css";
import "../css/common.css";
import AnimatedText from "react-animated-text-content";
import Dropdown from "react-bootstrap/Dropdown";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  const performLoginByEnterPress = (e) => {
    console.log("===", e.keyCode);
    if (e.keyCode === 13) {
      return performLogin();
    }
  };

  const performLogin = () => {
    axiosApi
      .post("/login", {
        email: username,
        password: password
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        switch (response.data.role) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "STUDENT":
            navigate("/student");
            break;
          case "TEACHER":
            navigate("/teacher");
            break;
          case "GUARDIAN":
            navigate("/guardian");
            break;
          default:
            navigate("/error");
        }
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
          <label htmlFor="name" className="text-size-label">
            username
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => performLoginByEnterPress(e)}
          ></input>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="pass" className=" text-size-label">
            password
          </label>
          <input
            type="password"
            id="pass"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => performLoginByEnterPress(e)}
          ></input>
        </div>
        <div className="d-flex justify-content-between">
          <input
            type="button"
            value="login"
            className="btn btn-kolapata btn-lg mt-2 w-120px"
            onClick={performLogin}
          ></input>
          {/* 
          <input
            type="button"
            value="Register"
            className="btn btn-warning btn-lg mt-2 w-120px"
            onClick={performLogin}
          ></input> */}
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="btn btn-warning btn-lg mt-2 w-120px"
            >
              Register
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Student</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Teacher</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Guardian</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="p-3">
          <AnimatedText
            className="text-danger animated-paragraph"
            type="throw" // animate words or chars
            animation={{
              x: "200px",
              y: "-20px",
              scale: 1.1,
              ease: "ease-in-out"
            }}
            animationType="float"
            interval={0.06}
            duration={0.8}
            tag="h5"
            includeWhiteSpaces
            threshold={0.1}
            rootMargin="20%"
          >
            {result}
          </AnimatedText>
          ;
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
