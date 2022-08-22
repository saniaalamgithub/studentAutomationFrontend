import { useState, useEffect } from "react";
import axiosApi from "../api/axiosApi";
import { useNavigate } from "react-router-dom";
import "../css/common.css";
import "../css/homepage.css";
import { Modal, Button } from "react-bootstrap";

function AddCoursePage() {
  const [advisingMode, setAdvisingMode] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [restrictedCourseIds, setRestrictedCourseIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [studentData, setStudentData] = useState({
    crs1: "",
    crs2: "",
    crs3: "",
    crs4: "",
    crs5: ""
  });

  const navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    let active = localStorage.getItem("active");
    if (token && role === "STUDENT" && active) {
      let getConfig = async () => {
        axiosApi
          .get("/getConfig")
          .then(function (response) {
            if (response !== null) {
              console.log(response.data?.courseInsertable);
              setAdvisingMode(response.data?.courseInsertable);
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
      };

      let getSection = async () => {
        axiosApi
          .post("/sections", {
            token: localStorage.getItem("token")
          })
          .then(function (response) {
            if (response !== null) {
              console.log(response.data.data);
              setCourseList([]);
              setCourseList(response.data.data);
            }
          })
          .catch(function (error) {
            if (error.response?.status === 404) {
              setCourseList([]);
            } else {
              navigate("/error", {
                state: {
                  msg: error.response?.statusText,
                  errCode: error.response?.status
                }
              });
            }
          });
      };

      let getResult = async () => {
        axiosApi
          .post("/results", {
            token: localStorage.getItem("token")
          })
          .then(function (response) {
            if (response !== null) {
              console.log(response?.data.data, "**********************");
              let oldCourse = [];
              response?.data.data.forEach((element) => {
                console.log(element, "**********************");
                oldCourse.push(element.courseCourseId);
              });
              setRestrictedCourseIds(oldCourse);
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
      };

      getConfig();
      getResult();
      getSection();
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  const setStudentDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(studentData));
    temp[e.target.name] = e.target.value;
    setStudentData(temp);
  };

  const performStudentCourseInsertion = () => {
    let sIds = [
      studentData.crs1,
      studentData.crs2,
      studentData.crs3,
      studentData.crs4,
      studentData.crs5
    ].filter((id) => id !== "" && id !== "0");
    console.log(sIds, "sIds");
    if (checkIfDuplicateExists(sIds)) {
      setShowModal(true);
      setModalMsg("Cant take same section twice");
    } else {
      let cIds = [];
      sIds.forEach((element) => {
        for (let index = 0; index < courseList.length; index++) {
          if (courseList[index].section_id == element) {
            cIds.push(courseList[index].course?.course_id);
            break;
          }
        }
      });
      if (checkIfDuplicateExists(cIds)) {
        setShowModal(true);
        setModalMsg("Cant take multiple section of same course");
      } else {
        axiosApi
          .post("student/course/new", {
            token: localStorage.getItem("token"),
            sIds
          })
          .then(function (response) {
            if (response !== null) {
              console.log(response);
              navigate("/student");
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
      }
    }
  };

  function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length;
  }

  return (
    <div className="cpbg full-screen ">
      {!advisingMode && (
        <div className="h1 text-center mt-4">
          You can only add courses during advising period
        </div>
      )}
      {advisingMode && (
        <div className="d-flex justify-content-center">
          <div className="mt-5 mb mx-5 w-500px bg-cornflowerblue p-5 rounded">
            <div className="h3 text-center mb-3">Add Courses</div>
            <ul className="text-warning my-3">
              <li>If you take less than 5 courses, keep the rest unselected</li>
              <li>You cant change selection after submission</li>
            </ul>
            {[...Array(5)].map((j, i) => (
              <div className="mt-3" key={i}>
                <label forhtml={"crs" + (i + 1)} className="form-label">
                  {"Course " + (i + 1)}
                </label>
                <select
                  className="flex-fill form-control flex-grow-1"
                  name={"crs" + (i + 1)}
                  onChange={setStudentDataOnChange}
                >
                  <option value="0" key="0">
                    Please select
                  </option>
                  {courseList
                    .filter(
                      (cl) =>
                        !restrictedCourseIds.includes(cl.course?.course_id)
                    )
                    .map((data, j) => (
                      <option value={data.section_id} key={j}>
                        {data.course?.name + " (" + data.section_name + ")"}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="mt-5 d-flex justify-content-center">
              <input
                type="submit"
                value="Done"
                className="btn btn-secondary px-5 text-white mx-2 text-center add_btn_position"
                onClick={() => performStudentCourseInsertion()}
              ></input>
            </div>
          </div>
        </div>
      )}
      {showModal === true ? (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="mb-3 mt-3">{modalMsg}</div>
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
  );
}

export default AddCoursePage;
