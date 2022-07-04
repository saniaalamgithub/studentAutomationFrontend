import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import "../../css/common.css";
import "../../css/guardianPage.css";

function GuardianRegisterPage() {
  const [result, setResult] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [pNum, setPNum] = useState("");
  const [eMail, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [wName, setWName] = useState("");
  const navigate = useNavigate();
  const performRegistrationByEnterPress = (e) => {
    console.log("===", e.keyCode);
    if (e.keyCode === 13) {
      return performRegistraion();
    }
  };

  const performRegistraion = () => {
    axiosApi
      .post("/guardian/create", {
        email: eMail,
        password: password,
        name:guardianName,
        number:pNum,
        wardId:wName,
      })
      .then(function (response) {
        navigate("/admin");
      })
      .catch(function (error) {
        setResult(error.message);
      });
  };

  return (
    <div className="full-screen g-page-bg d-flex justify-content-end me-5">
      <div className="w-500px p-5">
        <h1>Guardian registration</h1>
        <div className="mb-3 mt-3">
          <label forhtml="gname">Guardian Name :</label>
          <input
            type="text"
            className="form-control"
            id="gname"
            placeholder="Enter name"
            name="gname"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            onKeyDown={(e) => performRegistrationByEnterPress(e)}
          />
        </div>
        <div className="mb-3 mt-3">
          <label forhtml="pnum">Phone number:</label>
          <input
            type="number"
            className="form-control"
            id="pnum"
            placeholder="Enter number"
            name="pnum"
            value={pNum}
            onChange={(e) => setPNum(e.target.value)}
            onKeyDown={(e) => performRegistrationByEnterPress(e)}
          />
        </div>
        <div className="mb-3 mt-3">
          <label forhtml="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            name="email"
            value={eMail}
            onChange={(e) => setEMail(e.target.value)}
            onKeyDown={(e) => performRegistrationByEnterPress(e)}
          />
        </div>
        <div className="mb-3">
          <label forhtml="pwd">Password:</label>
          <input
            type="password"
            className="form-control"
            id="pwd"
            placeholder="Enter password"
            name="pswd"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => performRegistrationByEnterPress(e)}
          />
        </div>
        <div className="mb-3 mt-3">
          <label forhtml="wname">Son/Daughter/Ward student id:</label>
          <input
            type="number"
            className="form-control"
            id="wname"
            placeholder="Enter student id"
            name="wname"
            value={wName}
            onChange={(e) => setWName(e.target.value)}
            onKeyDown={(e) => performRegistrationByEnterPress(e)}
          />
        </div>
        <div className="p-3">
          <p className="text-danger">{result}</p>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuardianRegisterPage;
