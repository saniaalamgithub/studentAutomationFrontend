import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import "../../css/loginPage.css";
import "../../css/common.css";

function GuardianHomePage() {
  const [roll, setRoll] = useState("");
  const [childData, setChildData] = useState([]);
  const [activeChild, setActiveChild] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosApi
      .post("/ward", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        if (response !== null) {
          setChildData(response.data.data.guardian.students);
        }
      })
      .catch(function (error) {
        navigate("/error");
      });
  }, []);

  function getCurrentUserInfo(data) {
    setActiveChild(data);
  }

  function addWard() {
    axiosApi
      .post("/add-ward", {
        university_student_id: roll
      })
      .then(function (response) {
        //
      })
      .catch(function (error) {
        //
      });
  }

  return (
    <div>
      <div className="d-flex justify-content-between px-4 py-2 bg-beige-gradient">
        <div className="flex-fill d-flex">
          <div className="align-self-center">
            <strong>Select your Ward =></strong>
          </div>
          {childData.length <= 0 && (
            <p>You are not yet accepted as guardian of any student</p>
          )}
          {childData.map((data) => (
            <input
              type="button"
              key={data.student_id}
              value={data.name}
              className="btn btn-warning pd-2 text-white mx-2"
              onClick={() => getCurrentUserInfo(data)}
            ></input>
          ))}
        </div>
        <div className="w-250px d-flex">
          <input
            type="text"
            id="name"
            className="form-control w-150px"
            placeholder="type student ID"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          ></input>
          <input
            type="button"
            value="Add"
            className="btn btn-warning w-120px text-white"
            onClick={addWard}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default GuardianHomePage;
