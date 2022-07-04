import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import moment from "moment";
import "../../css/guardianPage.css";
import "../../css/common.css";

function GuardianHomePage() {
  const [roll, setRoll] = useState("");
  const [childData, setChildData] = useState([]);
  const [activeChild, setActiveChild] = useState({});
  const [complainList, setComplainList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosApi
      .post("/ward", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        if (response !== null) {
          setChildData(response.data.data.guardian.students);
          if (response.data.data.guardian.students.length > 0) {
            setActiveChild(response.data.data.guardian.students[0]);
            setComplainList(response.data.data.guardian.students[0].complains);
          }
        }
      })
      .catch(function (error) {
        navigate("/error");
      });
  }, []);

  function getCurrentUserInfo(data) {
    setActiveChild(data);
    setComplainList(data.complains);
  }

  function getCalculatedResult(result, isCgpa) {
    let totalGpa = 0;
    let totalCredit = 0;
    for (let i = 0; i < result.length; i++) {
      if (isCgpa) {
        let gpa = Number(result[i].grade) * Number(result[i].course.credit);
        totalGpa = totalGpa + gpa;
      }

      totalCredit = totalCredit + result[i].course.credit;
    }
    return isCgpa ? totalGpa / totalCredit : totalCredit;
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
  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="full-screen d-flex flex-column">
      <div className="d-flex justify-content-between px-4 py-2 bg-beige-gradient bottom-border-gray">
        <div className="flex-fill d-flex">
          <div className="align-self-center">
            <strong>Select your Ward = </strong>
          </div>
          {childData.length <= 0 && (
            <p>You are not yet accepted as guardian of any student</p>
          )}
          {childData !== undefined ? (
            childData.map((data) => (
              <input
                type="button"
                key={data.student_id}
                value={data.name}
                className="btn btn-warning pd-2 text-white mx-2"
                onClick={() => getCurrentUserInfo(data)}
              ></input>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="w-350px d-flex">
          <input
            type="number"
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
          <input
            type="button"
            value="Logout"
            className="btn btn-danger w-120px text-white ms-4 "
            onClick={doLogout}
          ></input>
        </div>
      </div>
      <div className="d-flex justify-content-between p-2 flex-fill">
        <div className="flex-fill p-2">
          <h2>Student Info</h2>
          <table className="table table-striped">
            <tbody>
              <tr>
                <td>
                  <strong>
                    <strong>Name</strong>
                  </strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.name === undefined
                    ? "------"
                    : activeChild.name}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>ID</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.university_student_id === undefined
                    ? "------"
                    : activeChild.university_student_id}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Phone Number</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.phone_number === undefined
                    ? "------"
                    : activeChild.phone_number}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>department</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.department === undefined ||
                  activeChild.department.name === undefined
                    ? "------"
                    : activeChild.department.name}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>joinning semester</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.semester === undefined
                    ? "------"
                    : activeChild.semester.name +
                      " " +
                      activeChild.semester.year}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>total completed credit</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.results === undefined ||
                  activeChild.results.length === 0
                    ? "------"
                    : getCalculatedResult(activeChild.results, false)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>current cgpa</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.results === undefined ||
                  activeChild.results.length === 0
                    ? "------"
                    : getCalculatedResult(activeChild.results, true).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex-fill border p-3 overflow-scroll  max-height-90vh">
          <h2>Complains</h2>
          {complainList !== undefined ? (
            complainList.map((data) => (
              <div className="container py-2 px-4 rounded my-2 bg-dark text-white">
                <h5>{data.content}</h5>
                <p className="text-right">
                  {moment(data.date).format("DD-MM-YYYY")}
                </p>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuardianHomePage;
