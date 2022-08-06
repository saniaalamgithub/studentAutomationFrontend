import { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../../css/homepage.css";
import "../../css/common.css";

function TeacherRegistration() {
  const [errorMsg, setErrorMsg] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teacherData, setTeacherData] = useState({
    name: "",
    phoneNumber: "",
    designation: "",
    department: "",
    email: "",
    pass: ""
  });
  const [teacherPhoto, setTeacherPhoto] = useState({
    teacherPhoto: null,
    fileName: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    let getData = async () => {
      const data = await axiosApi
        .post("/departments", {
          token: localStorage.getItem("token")
        })
        .then(function (response) {
          if (response !== null) {
            console.log(response.data.data);
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
                errCode: error.response?.status
              }
            });
          }
        });
    };
    setDepartmentList([]);
    getData();
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

  const getDept = async () => {};

  const performTeacherInsertion = async (event) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
      "x-access-token": localStorage.getItem("token")
    };
    let insertableData = {
      name: teacherData.name,
      phoneNumber: teacherData.phoneNumber,
      designation: teacherData.designation,
      department: teacherData.department,
      email: teacherData.email,
      pass: teacherData.pass,
      teacherPhoto: teacherPhoto.teacherPhoto,
      fileName: teacherPhoto.fileName
    };
    console.log(insertableData);
    await axiosApi
      .post("/teacher/create", insertableData, {
        headers: headers
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

  const setTeacherDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(teacherData));
    temp[e.target.name] = e.target.value;
    setTeacherData(temp);
  };

  const setTeacherPhotoOnChange = (e) => {
    let temp = {};
    temp.teacherPhoto = e.target.files[0];
    temp.fileName = e.target.files[0].name;
    setTeacherPhoto(temp);
  };

  return (
    <div className="tpbg full-screen mt-0">
      <div className="d-flex justify-content-start">
        <div className="mt-5 mb mx-5 w-500px bg-cornsilk p-5 rounded">
          <h2 className="text-center">Teacher Registration</h2>
          <div className="mt-5">
            <label htmlFor="name">Enter Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter our name"
              name="name"
              value={teacherData.name}
              onChange={setTeacherDataOnChange}
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
              value={teacherData.phoneNumber}
              onChange={setTeacherDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label htmlFor="designation">Designation:</label>
            <input
              type="text"
              className="form-control"
              id="designation"
              placeholder="Enter your designation"
              name="designation"
              value={teacherData.designation}
              onChange={setTeacherDataOnChange}
            ></input>
          </div>
          <div className="mt-3">
            <label forhtml="teacherPhoto" className="form-label">
              Photo(JPG/PNG only)
            </label>
            <input
              className="form-control"
              type="file"
              id="teacherPhoto"
              name="teacherPhoto"
              onChange={setTeacherPhotoOnChange}
            />
          </div>
          <div className="mt-3">
            <label forhtml="department" className="form-label">
              Department
            </label>
            <select
              className="flex-fill form-control flex-grow-1"
              name="department"
              onChange={setTeacherDataOnChange}
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
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={teacherData.email}
              onChange={setTeacherDataOnChange}
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
              value={teacherData.password}
              onChange={setTeacherDataOnChange}
            ></input>
          </div>
          <div className="text-danger">{errorMsg}</div>
          <div className="mt-5 d-flex justify-content-center">
            <input
              type="submit"
              value="Add"
              className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
              onClick={performTeacherInsertion}
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

export default TeacherRegistration;
