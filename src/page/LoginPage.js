import { useState, useEffect } from "react";
import axiosApi from "../api/axiosApi";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../css/loginPage.css";
import "../css/common.css";

import Dropdown from "react-bootstrap/Dropdown";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    let active = localStorage.getItem("active");
    if (token && role && active) {
      console.log("all ok");
      if (active === "true") {
        switch (role) {
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
            navigate("/error", {
              state: {
                msg: "User Role Unknown, Contact Support",
                errCode: "401"
              }
            });
        }
      } else {
        console.log("all not ok", role, token, active);
        switch (role) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "STUDENT":
            navigate("/student/new");
            break;
          case "TEACHER":
            navigate("/teacher/new");
            break;
          // case "GUARDIAN":
          //   navigate("/guardian/new");
          //   break;
          default:
            navigate("/error", {
              state: {
                msg: "User Role Unknown, Contact Support",
                errCode: "401"
              }
            });
        }
      }
    }
  }
, []);

  const performLoginByEnterPress = (e) => {
    console.log("===", e.keyCode);
    if (e.keyCode === 13) {
      return performLogin();
    }
  };

  const handleClose = () => setShowModal(false);

  const performLogin = () => {
    axiosApi
      .post("/login", {
        email: username,
        password: password
      })
      .then(function(response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        console.log(response.data.active);
        let isActive = response.data.active == "1" ? true : false;
        localStorage.setItem("active", isActive);
        if (isActive) {
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
              navigate("/error", {
                state: {
                  msg: "User Role Unknown, Contact Support",
                  errCode: "401"
                }
              });
          }
        } else {
          switch (response.data.role) {
            case "ADMIN":
              navigate("/admin");
              break;
            case "STUDENT":
              navigate("/student/new");
              break;
            case "TEACHER":
              navigate("/teacher/new");
              break;
            case "GUARDIAN":
              navigate("/guardian/new");
              break;
            default:
              navigate("/error", {
                state: {
                  msg: "User Role Unknown, Contact Support",
                  errCode: "401"
                }
              });
          }
        }
      })
      .catch(function(error) {
        setResult(error.message);
      });
  };

  return (
    <div className="mainpage-bg full-screen mt-0 d-flex">
      <div className=" pt-5 mx-5 width-300px">
        <h1>Login</h1>

        <div className="mb-3 mt-3">
          <label htmlFor="name" className="text-size-label">
            Email
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
              <Dropdown.Item onClick={() => setShowModal(true)}>
                Student
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowModal(true)}>
                Teacher
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowModal(true)}>
                Guardian
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="p-3">
          <p className="text-danger">{result}</p>
        </div>
        {showModal === true ? (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Sorry</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                You cant register from here, please ask the admin for username
                and password
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
