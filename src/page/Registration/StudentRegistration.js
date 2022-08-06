import { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../../css/homepage.css";
import "../../css/common.css";

function StudentRegistration() {
  const [errorMsg, setErrorMsg] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [courseWithSection, setCourseWithSection] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPartTwo, setShowPartTwo] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [studentData, setStudentData] = useState({
    name: "",
    phoneNumber: "",
    studentId: "",
    department: "",
    email: "",
    pass: "",
    guardianEmail: "",
    guardianPhoneNumber: "",
  });
  const [studentPhoto, setStudentPhoto] = useState({
    studentPhoto: null,
    fileName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let getDataDept = async () => {
      const data = await axiosApi
        .post("/departments", {
          token: localStorage.getItem("token"),
        })
        .then(function (response) {
          if (response !== null) {
            console.log(response.data.data);
            setDepartmentList([]);
            setDepartmentList(response.data.data);
          }
        })
        .catch(function (error) {
          if (error.response?.status === 404) {
            setDepartmentList([]);
          } else {
            navigate("/error", {
              state: {
                msg: error.response?.statusText,
                errCode: error.response?.status,
              },
            });
          }
        });
    };
    let getDataSemester = async () => {
      const data = await axiosApi
        .post("/semesters", {
          token: localStorage.getItem("token"),
        })
        .then(function (response) {
          if (response !== null) {
            console.log(response.data.data);
            setSemesterList([]);
            setSemesterList(response.data.data);
          }
        })
        .catch(function (error) {
          if (error.response?.status === 404) {
            setSemesterList([]);
          } else {
            navigate("/error", {
              state: {
                msg: error.response?.statusText,
                errCode: error.response?.status,
              },
            });
          }
        });
    };
    let getCourseList = async () => {
      const data = await axiosApi
        .post("/sections", {
          token: localStorage.getItem("token"),
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
                errCode: error.response?.status,
              },
            });
          }
        });
    };

    getDataDept();
    getDataSemester();
    getCourseList();
  }, []);

  const dummy = () => {
    return "";
  };

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("active");
  }

  function goBackToLogin() {
    navigate("/");
  }

  const performStudentInsertion = async (event) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
      "x-access-token": localStorage.getItem("token"),
    };
    let insertableData = {
      name: studentData.name,
      phoneNumber: studentData.phoneNumber,
      studentId: studentData.studentId,
      department: studentData.department,
      email: studentData.email,
      joinedAt: studentData.joinedAt,
      pass: studentData.pass,
      studentPhoto: studentPhoto.studentPhoto,
      fileName: studentPhoto.fileName,
    };
    console.log(insertableData);
    await axiosApi
      .post("/student/create", insertableData, {
        headers: headers,
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          setShowModal(true);
          doLogout();
        }
      })
      .catch(function (error) {
        setErrorMsg(error.message);
      });
  };

  const setStudentDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(studentData));
    temp[e.target.name] = e.target.value;
    setStudentData(temp);
  };

  const setStudentPhotoOnChange = (e) => {
    let temp = {};
    temp.studentPhoto = e.target.files[0];
    temp.fileName = e.target.files[0].name;
    setStudentPhoto(temp);
  };

  return (
    <div className="spbg full-screen mt-0">
      <div className="d-flex justify-content-start">
        <div
          className={
            showPartTwo
              ? "d-none"
              : "mt-5 mb mx-5 w-500px bg-aliceblue p-5 rounded trans"
          }
        >
          <h2 className="text-center">Student Registration</h2>
          <div className="mt-3">
            <label htmlFor="name">Enter Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter our name"
              name="name"
              value={studentData.name}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="number"
              className="form-control"
              id="phoneNumber"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={studentData.phoneNumber}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label htmlFor="studentId">Student Id</label>
            <input
              type="text"
              className="form-control"
              id="studentId"
              placeholder="Enter your studentId"
              name="studentId"
              value={studentData.studentId}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label forhtml="studentPhoto" className="form-label">
              Photo(JPG/PNG only)
            </label>
            <input
              className="form-control"
              type="file"
              id="studentPhoto"
              name="studentPhoto"
              onChange={setStudentPhotoOnChange}
            />
          </div>
          <div className="mt-3">
            <label forhtml="department" className="form-label">
              Department
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="department"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {departmentList.map((data, i) => (
                <option value={data.department_id} key={i}>
                  {data.short_code}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label forhtml="department" className="form-label">
              Joining Semester
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="department"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {semesterList.map((data, i) => (
                <option value={data.semester_id} key={i}>
                  {data.name + " (" + data.year + ")"}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={studentData.email}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label htmlFor="pass">Your Password:</label>
            <input
              type="password"
              className="form-control"
              id="pass"
              placeholder="Enter your password"
              name="pass"
              value={studentData.password}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="text-danger">{errorMsg}</div>
          <div className="mt-3 d-flex justify-content-center">
            <input
              type="submit"
              value="Next"
              className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
              onClick={() => setShowPartTwo(true)}
            ></input>
          </div>
        </div>
        <div
          className={
            showPartTwo
              ? "mt-5 mb mx-5 w-500px bg-aliceblue p-5 rounded trans"
              : "op-0"
          }
        >
          <h2 className="text-center">Student Registration</h2>

          <div className="mt-3">
            <label htmlFor="guardianPhoneNumber">Guardian Phone Number:</label>
            <input
              type="number"
              className="form-control"
              id="guardianPhoneNumber"
              placeholder="Enter phone number"
              name="guardianPhoneNumber"
              value={studentData.guardianPhoneNumber}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label htmlFor="guardianEmail">Guardian Email:</label>
            <input
              type="guardianEmail"
              className="form-control"
              id="guardianEmail"
              placeholder="Enter your Guardian Email"
              name="guardianEmail"
              value={studentData.guardianEmail}
              onChange={setStudentDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label forhtml="crs1" className="form-label">
              Course 1
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="crs1"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {courseList.map((data, i) => (
                <option value={data.section_id} key={i}>
                  {data.course?.name+" ("+data.section_name+")"}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-3">
            <label forhtml="crs2" className="form-label">
              Course 2
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="crs2"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {courseList.map((data, i) => (
                <option value={data.section_id} key={i}>
                  {data.course?.name+" ("+data.section_name+")"}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label forhtml="crs3" className="form-label">
              Course 3
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="crs3"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {courseList.map((data, i) => (
                <option value={data.section_id} key={i}>
                  {data.course?.name+" ("+data.section_name+")"}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label forhtml="crs4" className="form-label">
              Course 4
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="crs4"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {courseList.map((data, i) => (
                <option value={data.section_id} key={i}>
                  {data.course?.name+" ("+data.section_name+")"}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label forhtml="crs5" className="form-label">
              Course 5
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="crs5"
              onChange={setStudentDataOnChange}
            >
              <option value="0" key="0">
                Please select
              </option>
              {courseList.map((data, i) => (
                <option value={data.section_id} key={i}>
                  {data.course?.name+" ("+data.section_name+")"}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-danger">{errorMsg}</div>
          <div className="mt-3 d-flex justify-content-center">
            <input
              type="submit"
              value="Done"
              className="btn btn-success px-5 text-white mx-2 text-center add_btn_position"
              onClick={performStudentInsertion}
            ></input>
          </div>
        </div>
      </div>
      {showModal === true ? (
        <Modal show={showModal} onHide={dummy}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Please Log In Again with new email and password</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={goBackToLogin}>
              Logout
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
