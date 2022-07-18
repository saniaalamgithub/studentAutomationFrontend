import { useState, useEffect } from "react";
import "../../css/common.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

function TeacherHomePage() {
  const [currentSectionData, setCurrentSectionData] = useState([]);
  const [teacherData, setTeacherData] = useState({});
  const [currentActionId, setCurrentActionId] = useState(0);
  const [checked, setChecked] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosApi
      .post("/teacher", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        if (response !== null) {
          setTeacherData(response.data.data.teacher);
        }
      })
      .catch(function (error) {
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  }, []);

  const dummy = () => {
    return "";
  };
  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }
  const handleAttendence = (i) => {
    let z = [...checked];
    z[i].is_present = !checked[i].is_present;
    setChecked(z);
  };
  const performAttendence = () => {
    let attendenceData = [...checked];
    for (let i = 0; i < attendenceData.length; i++) {
      attendenceData[i].date = new Date().toISOString().slice(0, 10);
    }
    console.log(attendenceData);
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token")
    };
    axiosApi
      .post(
        "/attendence",
        {
          attendenceData
        },
        {
          headers: headers
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };
  const handleOptionButtonClick = (sectionId) => {
    teacherData.sections.forEach((element) => {
      if (element.section_id === sectionId) {
        setCurrentSectionData(element);
        axiosApi
          .post("/attendence/" + sectionId, {
            token: localStorage.getItem("token")
          })
          .then(function (response) {
            let studentAttendenceData = [];
            if (response.data.data.length !== 0) {
              let oldDbData = response.data.data;
              oldDbData.forEach((data) => {
                let oneStudentAttendenceData = {
                  attendence_id: data.attendence_id,
                  is_present: data.is_present,
                  studentStudentId: data.studentStudentId,
                  sectionSectionId: data.sectionSectionId,
                  studentName: data.student.name,
                  studentRoll: data.student.university_student_id
                };
                studentAttendenceData.push(oneStudentAttendenceData);
              });
            } else {
              element.course_takens.forEach((innerElement) => {
                let oneStudentAttendenceData = {
                  is_present: false,
                  studentStudentId: innerElement.student.student_id,
                  sectionSectionId: element.section_id,
                  studentName: innerElement.student.name,
                  studentRoll: innerElement.student.university_student_id
                };
                studentAttendenceData.push(oneStudentAttendenceData);
              });
              setChecked(studentAttendenceData);
            }
            setChecked(studentAttendenceData);
          })
          .catch(function (error) {
            navigate("/error", {
              state: {
                msg: error.response?.statusText,
                errCode: error.response?.status
              }
            });
          });
      }
    });
  };

  return (
    <div className="full-screen d-flex flex-column">
      <div className="d-flex justify-content-between px-4 py-2 bg-beige-gradient bottom-border-gray">
        <div className="flex-fill d-flex">
          {teacherData !== {} &&
            teacherData.sections !== undefined &&
            teacherData.sections.map((data, i) => (
              <input
                type="button"
                key={i}
                value={data.course.name + " (" + data.section_name + ") "}
                className="btn btn-warning pd-2 text-white mx-2"
                onClick={() => handleOptionButtonClick(data.section_id)}
              ></input>
            ))}
        </div>
        <input
          type="button"
          key="btn5"
          value="Update Own Info"
          className="btn btn-secondary pd-2 text-white mx-2"
          onClick={dummy}
        ></input>
        <input
          type="button"
          value="Logout"
          className="btn btn-danger w-120px text-white ms-4 "
          onClick={doLogout}
        ></input>
      </div>
      <div className="flex-fill d-flex">
        <div className="border d-flex flex-column bg-secondary">
          <input
            type="button"
            value="Attendence"
            className="btn btn-light w-120px mx-2 mb-2 mt-4 p-1 "
            onClick={() => setCurrentActionId(0)}
          ></input>
          <input
            type="button"
            value="Discussion"
            className="btn btn-light w-120px m-2 p-1 "
            onClick={() => setCurrentActionId(1)}
          ></input>
          <input
            type="button"
            value="Notice"
            className="btn btn-light w-120px m-2 p-1 "
            onClick={() => setCurrentActionId(2)}
          ></input>
          <input
            type="button"
            value="StudentList"
            className="btn btn-light w-120px m-2 p-1 "
            onClick={() => setCurrentActionId(2)}
          ></input>
          <input
            type="button"
            value="Complain"
            className="btn btn-light w-120px m-2 p-1 "
            onClick={() => setCurrentActionId(3)}
          ></input>
          <input
            type="button"
            value="Result"
            className="btn btn-light w-120px m-2 p-1 "
            onClick={() => setCurrentActionId(4)}
          ></input>
        </div>
        {currentActionId === 0 && (
          <div className="d-flex flex-fill flex-column p-2">
            <h4>Today's Attendence</h4>
            {checked !== undefined &&
              checked.length !== 0 &&
              checked.map((ch, i) => (
                <div className="d-flex border-bottom" key={i}>
                  <div className="text-truncate align-self-center w-350px h-100">
                    {ch.studentName + " (" + ch.studentRoll + ") "}
                  </div>
                  <Switch
                    onChange={() => handleAttendence(i)}
                    checked={ch.is_present}
                    className="react-switch my-2"
                  />
                </div>
              ))}
            {checked !== undefined && checked.length !== 0 && (
              <input
                type="button"
                value="Submit"
                className="btn btn-kolapata btn-lg mt-2 w-120px"
                onClick={performAttendence}
              ></input>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherHomePage;
