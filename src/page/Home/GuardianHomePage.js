import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import "../../css/guardianPage.css";
import "../../css/common.css";

function EmptyTd(){
  return (<td>-----</td>)
}
function TdComponent(props){
  console.log(props.data)
  return (<td>{props.data}</td>)
}


function GuardianHomePage() {
  const [roll, setRoll] = useState("");
  const [childData, setChildData] = useState([]);
  const [activeChild, setActiveChild] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosApi
      .post("/ward", {
        token: localStorage.getItem("token"),
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
        university_student_id: roll,
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
        <div className="bg-secondary flex-fill p-2">
          <h2>Student Info</h2>
          <table className="table table-striped">
          <tbody>
            <tr>
              <td>Name</td>
              {activeChild!={} ? <TdComponent data={activeChild}/> :<EmptyTd/>}
            </tr>
            <tr>
              <td>ID</td>
              <td>-------</td>
            </tr>
            <tr>
              <td>phone number</td>
              <td>-------</td>
            </tr>
            <tr>
              <td>department</td>
              <td>-------</td>
            </tr>

            <tr>
              <td>joinning semester</td>
              <td>-------</td>
            </tr>
            <tr>
              <td>total completed credit</td>
              <td>-------</td>
            </tr>
            <tr>
              <td>current cgpa</td>
              <td>-------</td>
            </tr>
            
            
            
            
            </tbody>
          </table>
        </div>
        <div className="bg-primary flex-fill">
          <h2>Complains</h2>
        </div>
      </div>
    </div>
  );
}

export default GuardianHomePage;
