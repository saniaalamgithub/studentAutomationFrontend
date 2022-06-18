import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";

function GuardianHomePage() {
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

  return (
    <div>
      <div class="container-fluid p-2 bg-primary text-white text-center">
        <h1>Guardian Zone</h1>
      </div>
      <div className="d-flex">
        <div>Select your Ward =></div>
        <div></div>
      </div>
      {childData.map((data) => (
        <input
          type="button"
          key={data.student_id}
          value={data.name}
          className="btn btn-warning btn-lg mt-2 w-100 text-white"
          onClick={() => getCurrentUserInfo(data)}
        ></input>
      ))}
    </div>
  );
}

export default GuardianHomePage;
