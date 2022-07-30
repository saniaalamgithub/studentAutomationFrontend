import { useState } from "react";
import "../../css/common.css";
import axiosApi from "../../api/axiosApi";
import { Modal, Button } from "react-bootstrap";

function StudentRegistration() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pnumber, setPnumber] = useState("");
  const [password,setPassword] = useState ("");
  const [email,setEmail] = useState ("");
  const [result, setResult] = useState("");
  const [resultDesc, setResultDesc] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const addStudent = () =>{
    console.log("Api calling")
    axiosApi
      .post("/student/create", {
        token: localStorage.getItem("token"),
        email: email,
        password: password,
        student:{
          name:name,
          id:id,
          phoneNumber:pnumber
        }
      })
      .then(function (response) {
        setShowModal(true)
        setResult("Success");
    setResultDesc("Please login with your updated username and password");
  }).catch(function (error) {
    setShowModal(true)
    setResult("Failed");
    setResultDesc(error.message);
  })
}

  return (
    <div >
        <h2>Student Registration Page</h2>
        <div className="d-flex justify-content-end">
        <div className="mt-5 mb mx-5 w-500px">
        <div className="mb-3 mt-3">
          <label htmlFor="name">Student name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="ID"> University ID:</label>
          <input
            type="number"
            className="form-control"
            id="ID"
            placeholder="Enter University ID"
            name="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          ></input>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="pnumeber">Phone Number:</label>
          <input
            type="number"
            className="form-control"
            id="pnumber"
            placeholder="Enter phone number"
            name="pnumber"
            value={pnumber}
            onChange={(e) => setPnumber(e.target.value)}
          ></input>
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Enter Email(This will be used for login from next time)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="btn btn-primary" onClick={addStudent}>
          Submit
        </button>
      </div>
        </div>
        {showModal === true ? (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{result}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                {resultDesc}
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        ) : (
          <></>
        )}
    </div>
  );
}

export default StudentRegistration;
