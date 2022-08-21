import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import moment from "moment";
import "../../css/guardianPage.css";
import "../../css/common.css";

function GuardianHomePage() {
  const [childData, setChildData] = useState([]);
  const [activeChild, setActiveChild] = useState({});
  const [complainList, setComplainList] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);
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

            //set Attendence on load
            // set Attendence
            let data = response.data.data.guardian.students[0];
            let attendenceDataTemp = [];
            data.course_takens.forEach((element) => {
              let temp = {};
              temp.sectionSectionId = element.section?.section_id;
              let totalClass = 0;
              let totalAttendence = 0;
              element.section?.attendences.forEach((innerElement) => {
                if (innerElement.studentStudentId === data.student_id) {
                  totalClass++;
                  if (innerElement.is_present) {
                    totalAttendence++;
                  }
                }
              });
              temp.totalClass = totalClass;
              temp.totalAttended = totalAttendence;
              temp.attendencePercentage = isNaN(totalAttendence / totalClass)
                ? 0
                : 100 * (totalAttendence / totalClass);
              attendenceDataTemp.push(temp);
            });
            console.log("attendenceDataTemp", attendenceDataTemp);
            setAttendenceData(attendenceDataTemp);
          }
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

  function getCurrentUserInfo(data) {
    setActiveChild(data);
    setComplainList(data.complains);
    // set Attendence
    let attendenceDataTemp = [];
    data.course_takens.forEach((element) => {
      let temp = {};
      temp.sectionSectionId = element.section?.section_id;
      let totalClass = 0;
      let totalAttendence = 0;
      element.section?.attendences.forEach((innerElement) => {
        if (innerElement.studentStudentId === data.student_id) {
          totalClass++;
          if (innerElement.is_present) {
            totalAttendence++;
          }
        }
      });
      temp.totalClass = totalClass;
      temp.totalAttended = totalAttendence;
      temp.attendencePercentage = isNaN(totalAttendence / totalClass)
        ? 0
        : 100 * (totalAttendence / totalClass);
      attendenceDataTemp.push(temp);
    });
    console.log("attendenceDataTemp", attendenceDataTemp);
    setAttendenceData(attendenceDataTemp);
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

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("active");
    navigate("/");
  }

  const getAttendenceForSection = (secId, getType) => {
    if (attendenceData.length !== 0) {
      let z = attendenceData.filter((data) => data.sectionSectionId === secId);
      console.log(secId, z[0]);
      if (getType === 1) {
        return z[0].attendencePercentage;
      } else if (getType === 2) {
        return z[0].totalClass;
      }
      if (getType === 3) {
        return z[0].totalAttended;
      }
    } else return 0;
  };

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
        <div className="w-350px d-flex justify-content-end">
          <input
            type="button"
            value="Logout"
            className="btn btn-danger w-120px text-white me-4 "
            onClick={doLogout}
          ></input>
        </div>
      </div>
      <div className="d-flex justify-content-between p-2 w-100">
        <div className="w-75 p-2">
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
                  <strong>Current CGPA</strong>
                </td>
                <td>
                  {Object.keys(activeChild).length === 0 ||
                  activeChild.results === undefined ||
                  activeChild.results.length === 0
                    ? "------"
                    : getCalculatedResult(activeChild.results, true).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Attendence Report</strong>
                </td>
                <td>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Total Class</th>
                        <th>Attended Class</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeChild.course_takens?.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {data.section?.course?.short_code}
                            {data.section?.section_name}){" "}
                          </td>
                          <td>
                            {getAttendenceForSection(
                              data.section?.section_id,
                              2
                            )}
                          </td>
                          <td>
                            {getAttendenceForSection(
                              data.section?.section_id,
                              3
                            )}
                          </td>
                          <td>
                            {getAttendenceForSection(
                              data.section?.section_id,
                              1
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-25 border p-3 overflow-scroll  max-height-90vh">
          <h2>Complains</h2>
          {complainList !== undefined ? (
            complainList.map((data, i) => (
              <div
                key={i}
                className="container py-2 px-4 rounded my-2 bg-dark text-white"
              >
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
