import { useState, useEffect } from "react";
import "../../css/common.css";
import "../../css/homepage.css";
import "../../css/admin.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import Switch from "react-switch";
function AdminHomePage() {
  const modalMsg = {
    initial:
      "Please remember this password. There is no way to recover it,\
    if you forget",
    success: "Updated, Please Login again",
    error: "Failed, Please Login again"
  };
  const [userList, setUserList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectionRole, setSelectionRole] = useState("");
  const [oldData, setOldData] = useState([]);
  const [activeActionArea, setActiveActionArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDeptShortCode, setSearchTermDeptShortCode] = useState("");
  const [showTabTwo, setShowTabTwo] = useState(false);
  const [tabTwoErr, setTabTwoErr] = useState("");
  const [showTabThree, setShowTabThree] = useState(false);
  const [tabThreeErr, setTabThreeErr] = useState("");
  const [tabTwoDetailsMode, setTabTwoDetailsMode] = useState(false);
  const [tabThreeDetailsMode, setTabThreeDetailsMode] = useState(false);

  const [timeslots, setTimeslots] = useState([]);
  const [teacherList, setTeacherList] = useState({});
  // const [userListFull, setUserListFull] = useState({});

  const [courseData, setCourseData] = useState({
    name: "",
    short_code: "",
    credit: 0,
    department: "",
    active: false
  });
  const [sectionData, setSectionData] = useState({
    name: "",
    teacher_id: "",
    timeslot_id: "",
    course_id: ""
  });

  const [eMail, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const [showModal, setShowModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(modalMsg.initial);

  const [noticeData, setNoticeData] = useState({
    title: "",
    content: "",
    formFile: null
  });
  const [deptData, setDeptData] = useState({
    name: "",
    shortCode: ""
  });
  const [detailsData, setDetailsData] = useState({});
  const [detailsDataTabThree, setDetailsDataTabThree] = useState({});

  const [usernameToUpdate, setUsernameToUpdate] = useState("");
  const [passwordToUpdate, setPasswordToUpdate] = useState("");

  const roleList = ["ADMIN", "STUDENT", "TEACHER", "GUARDIAN"];

  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("token") === undefined ||
      localStorage.getItem("role" !== "ADMIN")
    ) {
      navigate("/error", {
        state: {
          msg: "Something is wrong with the token, Please login Again",
          errCode: "401"
        }
      });
    } else {
      axiosApi
        .post("/timeslots", {
          token: localStorage.getItem("token")
        })
        .then(function (response) {
          if (response !== null) {
            setTimeslots(response.data.data);
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

      axiosApi
        .post("/teachers", {
          token: localStorage.getItem("token")
        })
        .then(function (response) {
          if (response !== null) {
            setTeacherList(response.data.data);
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
  }, []);

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("active");
    navigate("/");
  }

  async function getUserData(type) {
    let path = "";

    switch (type) {
      case "USER":
        setActiveActionArea("USER");
        path = "/users";
        break;
      case "TEACHER":
        setActiveActionArea("TEACHER");
        path = "/teachers";
        break;
      case "STUDENT":
        setActiveActionArea("STUDENT");
        path = "/students";
        break;
      case "GUARDIAN":
        setActiveActionArea("GUARDIAN");
        path = "/guardians";
        break;
      case "DEPARTMENT":
        setActiveActionArea("DEPARTMENT");
        path = "/departments";
        break;
      case "COURSE":
        setActiveActionArea("COURSE");
        path = "/courses";
        break;
      case "NOTICE":
        setActiveActionArea("NOTICE");
        path = "/notices";
        break;
      case "COMPLAIN":
        setActiveActionArea("COMPLAIN");
        path = "/complains";
        break;
      default:
        navigate("/error", {
          state: {
            msg: "User Role Unknown",
            errCode: "400"
          }
        });
    }

    await axiosApi
      .post(path, {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          setUserList(response.data.data);
          setOldData(response.data.data);
          setShowTabTwo(false);
          setShowTabThree(false);
          setTabTwoDetailsMode(false);
          setTabThreeDetailsMode(false);
        }
      })
      .catch(function (error) {
        if (error.response?.status === 404) {
          setUserList([]);
        } else {
          navigate("/error", {
            state: {
              msg: error.response?.statusText,
              errCode: error.response?.status
            }
          });
        }
      });

    await axiosApi
      .post("/departments", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        if (response !== null) {
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
  }

  // const resetData = () => {
  //   setUserList(oldData);
  // };

  const searchData = () => {
    let result;
    if (searchTermDeptShortCode === "0") {
      result = oldData;
    } else {
      result = oldData.filter(
        (data) => data.department.short_code === searchTermDeptShortCode
      );
    }
    if (activeActionArea === "STUDENT") {
      result = result.filter((data) =>
        data.university_student_id.toString().includes(searchTerm)
      );
    }
    setUserList(result);
  };

  const searchDataByRole = () => {
    let result;
    if (selectionRole === "" || selectionRole === "0") {
      result = oldData;
    } else {
      result = oldData.filter((data) => data.role === selectionRole);
    }
    setUserList(result);
  };

  const showDetails = (data) => {
    console.log(data);
    setShowTabTwo(true);
    setShowTabThree(false);
    setTabTwoDetailsMode(true);
    setTabTwoErr(false);
    setDetailsData(data);

    // setUserListFull(currentStudent);
  };

  const showDetailsSection = (data) => {
    console.log(data);
    setShowTabThree(true);
    setTabThreeDetailsMode(true);
    setTabThreeErr(false);
    setDetailsDataTabThree(data);
    // setUserListFull(currentStudent);
  };

  const addNewColumn = () => {
    setShowTabTwo(true);
    setShowTabThree(false);
    setTabTwoDetailsMode(false);
    setTabThreeDetailsMode(false);
    setTabTwoErr(false);
  };

  const addNewSection = () => {
    console.log("adding section panel");
    setShowTabThree(true);
    setTabThreeDetailsMode(false);
    setTabThreeErr(false);
    let temp = JSON.parse(JSON.stringify(sectionData));
    temp.course_id = detailsData.course_id;
    setSectionData(temp);
  };

  const dummy = () => {
    return "";
  };

  function handleSelectChange(event) {
    setSearchTermDeptShortCode(event.target.value);
  }

  function handleSelectChangeRole(event) {
    setSelectionRole(event.target.value);
  }

  const performUserInsertion = async () => {
    console.log(eMail + " - " + password + " - " + role);
    await axiosApi
      .post("/user/create", {
        token: localStorage.getItem("token"),
        email: eMail,
        password: password,
        role: role
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          getUserData("USER");
          setEMail("");
          setPassword("");
          setRole("STUDENT");
          setShowTabTwo(false);
          setShowTabThree(false);
          setTabTwoDetailsMode(false);
          setTabThreeDetailsMode(false);
          setTabTwoErr("");
        }
      })
      .catch(function (error) {
        setTabTwoErr(error.message);
      });
  };

  const setDeptDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(deptData));
    temp[e.target.name] = e.target.value;
    setDeptData(temp);
  };

  const performDeptInsertion = async (event) => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    console.log(deptData);
    await axiosApi
      .post("/department/create", deptData, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          getUserData("DEPARTMENT");
          setShowTabTwo(false);
          setShowTabThree(false);
          setTabTwoDetailsMode(false);
          setTabThreeDetailsMode(false);
          setTabTwoErr("");
        }
      })
      .catch(function (error) {
        setTabTwoErr(error.message);
      });
  };

  const setNoticeDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(noticeData));
    if (e.target.name === "formFile") {
      console.log(e.target.files);
      temp.formFile = e.target.files[0];
      temp.fileName = e.target.files[0].name;
    } else {
      temp[e.target.name] = e.target.value;
    }
    setNoticeData(temp);
  };

  const setSectionDataOnChange = (e) => {
    console.log(e.target.value);
    let temp = JSON.parse(JSON.stringify(sectionData));
    temp[e.target.name] = e.target.value;
    setSectionData(temp);
  };

  const performCourseInsertion = async (e) => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    console.log(courseData);
    await axiosApi
      .post("/course/create", courseData, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          getUserData("COURSE");
          setShowTabTwo(false);
          setShowTabThree(false);
          setTabThreeDetailsMode(false);
          setTabThreeErr("");
        }
      })
      .catch(function (error) {
        setTabTwoErr(error.message);
      });
  };

  const setCourseDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(courseData));
    if (e === true || e === false) {
      temp.active = e;
    } else {
      temp[e.target.name] = e.target.value;
    }
    setCourseData(temp);
  };

  const performNoticeInsertion = async (event) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
      "x-access-token": localStorage.getItem("token")
    };
    console.log(noticeData);
    await axiosApi
      .post("/notice/create", noticeData, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          getUserData("NOTICE");
          setEMail("");
          setPassword("");
          setRole("STUDENT");
          setShowTabTwo(false);
          setShowTabThree(false);
          setTabTwoDetailsMode(false);
          setTabThreeDetailsMode(false);
          setTabTwoErr("");
        }
      })
      .catch(function (error) {
        setTabTwoErr(error.message);
      });
  };

  const performSectionInsertion = async (event) => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    console.log(sectionData);
    await axiosApi
      .post("/section/create", sectionData, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          getUserData("COURSE");
          setShowTabThree(false);
          setTabThreeDetailsMode(false);
          setTabThreeErr("");
        }
      })
      .catch(function (error) {
        setTabTwoErr(error.message);
      });
  };

  const handleClose = () => setShowModal(false);

  const updateAdminInfo = async () => {
    await axiosApi
      .put("/admin", {
        token: localStorage.getItem("token"),
        email: usernameToUpdate,
        password: passwordToUpdate
      })
      .then(function (response) {
        setUpdateStatus(modalMsg.success);
      })
      .catch(function (error) {
        setUpdateStatus(modalMsg.error);
      });
  };

  const downloadFile = async (filePath) => {
    await axiosApi
      .post(
        "/download",
        {
          token: localStorage.getItem("token"),
          path: filePath
        },
        { responseType: "blob" }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const fileName = filePath.split("_").slice(0, -1).join("_");
        link.href = url;
        link.setAttribute(
          "download",
          fileName + "." + filePath.split(".").pop()
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="full-screen d-flex flex-column">
      {/* Top Navigation Bar */}
      <div className="d-flex justify-content-between px-4 py-2 bg-beige-gradient bottom-border-gray">
        <div className="flex-fill d-flex">
          <input
            type="button"
            key="btn0"
            value="All User"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("USER")}
          ></input>
          <input
            type="button"
            key="btn1"
            value="Teacher"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("TEACHER")}
          ></input>
          <input
            type="button"
            key="btn2"
            value="Student"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("STUDENT")}
          ></input>
          <input
            type="button"
            key="btn3"
            value="Guardian"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("GUARDIAN")}
          ></input>
          <input
            type="button"
            key="btn4"
            value="Course"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("COURSE")}
          ></input>
          <input
            type="button"
            key="btn5"
            value="Department"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("DEPARTMENT")}
          ></input>
          <input
            type="button"
            key="btn6"
            value="Notice"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("NOTICE")}
          ></input>
          <input
            type="button"
            key="btn7"
            value="Complain"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={() => getUserData("COMPLAIN")}
          ></input>
        </div>
        <input
          type="button"
          key="btn5"
          value="Update Own Info"
          className="btn btn-secondary pd-2 text-white mx-2"
          onClick={() => setShowModal(true)}
        ></input>
        <input
          type="button"
          value="Logout"
          className="btn btn-danger w-120px text-white ms-4 "
          onClick={doLogout}
        ></input>
      </div>
      <div className="d-flex p-2">
        {/* Current Data List */}
        <div
          className={
            activeActionArea !== ""
              ? "d-flex flex-column p-3 h-100 border border-secondary w-32p"
              : ""
          }
        >
          {activeActionArea && (
            <h1 className="text-center py-2 bg-beige-gradient-dark  rounded ">
              {`${activeActionArea[0].toUpperCase()}${activeActionArea
                .slice(1)
                .toLowerCase()}`}{" "}
              List
            </h1>
          )}

          {(activeActionArea === "TEACHER" ||
            activeActionArea === "COURSE" ||
            activeActionArea === "STUDENT") && (
            <div className="d-flex mt-2">
              {activeActionArea === "STUDENT" && (
                <input
                  type="number"
                  id="studentId"
                  className="form-control flex-grow-1 me-2"
                  placeholder="Type student ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                ></input>
              )}

              <select
                className="flex-fill form-control flex-grow-1"
                onChange={(event) => handleSelectChange(event)}
              >
                <option value="0" key="0">
                  ALL Department
                </option>
                {departmentList.map((data, i) => (
                  <option value={data.id} key={i}>
                    {data.short_code}
                  </option>
                ))}
              </select>
              <input
                type="button"
                value="Search"
                className="btn btn-success w-120px text-white mx-2"
                onClick={searchData}
              ></input>
            </div>
          )}

          {activeActionArea === "USER" && (
            <div className="d-flex mt-2">
              <select
                className="flex-fill form-control"
                onChange={(event) => handleSelectChangeRole(event)}
              >
                <option value="0" key="0">
                  ALL Role
                </option>
                {roleList.map((data, i) => (
                  <option value={data} key={i}>
                    {data}
                  </option>
                ))}
              </select>
              <input
                type="button"
                value="Search"
                className="btn btn-success w-120px text-white mx-2"
                onClick={searchDataByRole}
              ></input>
            </div>
          )}

          <div className=" mt-2 flex-fill">
            <table className="table table-striped overflow-auto">
              {activeActionArea !== "" && (
                <thead>
                  <tr>
                    {(activeActionArea === "STUDENT" ||
                      activeActionArea === "DEPARTMENT" ||
                      activeActionArea === "COURSE" ||
                      activeActionArea === "TEACHER") && <th>Name</th>}
                    {activeActionArea === "STUDENT" && <th>ID</th>}
                    {activeActionArea === "TEACHER" && <th>Designation</th>}
                    {(activeActionArea === "STUDENT" ||
                      activeActionArea === "TEACHER") && <th>Department</th>}
                    {activeActionArea === "USER" && <th>Email</th>}
                    {activeActionArea === "USER" && <th>Role</th>}
                    {activeActionArea === "GUARDIAN" && <th>Name</th>}
                    {activeActionArea === "GUARDIAN" && <th>Guardian Of</th>}
                    {activeActionArea === "GUARDIAN" && <th>Phone No</th>}
                    {activeActionArea === "NOTICE" && <th>Title</th>}
                    {activeActionArea === "NOTICE" && <th>Date</th>}
                    {activeActionArea === "NOTICE" && <th>By</th>}
                    {activeActionArea === "DEPARTMENT" && <th>ShortCode</th>}
                    {activeActionArea === "COMPLAIN" && <th>Complaint</th>}
                    {activeActionArea === "COMPLAIN" && <th>By</th>}
                    {activeActionArea === "COMPLAIN" && <th>For</th>}
                    {activeActionArea === "COURSE" && <th>Department</th>}
                    {activeActionArea === "COURSE" && <th>Credit</th>}
                    {activeActionArea === "COURSE" && <th>Total Sections</th>}
                    {activeActionArea === "USER" && <th>Active</th>}
                    {activeActionArea !== "USER" && <th></th>}
                  </tr>
                </thead>
              )}
              <tbody>
                {(userList.length !== 0 || activeActionArea !== "") &&
                  userList.map((data, i) => (
                    <tr key={i}>
                      {activeActionArea === "USER" && (
                        <td className="align-middle">{data.email}</td>
                      )}
                      {activeActionArea === "USER" && (
                        <td className="align-middle">{data.role}</td>
                      )}
                      {(activeActionArea === "STUDENT" ||
                        activeActionArea === "TEACHER" ||
                        activeActionArea === "COURSE" ||
                        activeActionArea === "DEPARTMENT") && (
                        <td className="align-middle">{data.name}</td>
                      )}
                      {activeActionArea === "STUDENT" && (
                        <td className="align-middle">
                          {data.university_student_id}
                        </td>
                      )}
                      {activeActionArea === "TEACHER" && (
                        <td className="align-middle">{data.designation}</td>
                      )}
                      {(activeActionArea === "TEACHER" ||
                        activeActionArea === "STUDENT") && (
                        <td className="align-middle">
                          {data.department !== undefined
                            ? data.department.short_code
                            : ""}
                        </td>
                      )}
                      {activeActionArea === "NOTICE" && (
                        <td className="align-middle">
                          {data.title !== undefined ? data.title : ""}
                        </td>
                      )}
                      {activeActionArea === "NOTICE" && (
                        <td className="align-middle">
                          {data.createdAt !== undefined
                            ? moment(data.createdAt).format("D MMM YYYY")
                            : ""}
                        </td>
                      )}
                      {activeActionArea === "NOTICE" && (
                        <td className="align-middle">
                          {data.user
                            ? data.user.role === "TEACHER"
                              ? data.user.teacher?.name
                              : "Admin"
                            : "Unknown"}
                        </td>
                      )}
                      {activeActionArea === "DEPARTMENT" && (
                        <td className="align-middle">
                          {data.short_code !== undefined ? data.short_code : ""}
                        </td>
                      )}

                      {activeActionArea === "COMPLAIN" && (
                        <>
                          <td className="align-middle">
                            {data.content !== undefined ? data.content : ""}
                          </td>
                          <td className="align-middle">
                            {data.teacher !== undefined
                              ? data.teacher?.name +
                                "(" +
                                data.teacher?.department?.short_code +
                                ")"
                              : ""}
                          </td>
                          <td className="align-middle">
                            {data.student !== undefined
                              ? data.student?.name +
                                "(" +
                                data.student?.university_student_id +
                                ")"
                              : ""}
                          </td>
                        </>
                      )}

                      {activeActionArea === "GUARDIAN" && (
                        <>
                          <td className="align-middle">
                            {data.guardian !== undefined
                              ? data.guardian?.name
                              : ""}
                          </td>
                          <td className="align-middle">
                            {data !== undefined
                              ? data.name +
                                "(" +
                                data.university_student_id +
                                ")"
                              : ""}
                          </td>
                          <td className="align-middle">
                            {data.guardian !== undefined
                              ? data.guardian?.phone_number
                              : ""}
                          </td>
                        </>
                      )}

                      {activeActionArea === "COURSE" && (
                        <>
                          <td className="align-middle">
                            {data.department !== undefined
                              ? data.department?.short_code
                              : ""}
                          </td>
                          <td className="align-middle">
                            {data !== undefined ? data.credit : ""}
                          </td>
                          <td className="align-middle">
                            {data.sections !== undefined
                              ? data.sections?.length
                              : "0"}
                          </td>
                        </>
                      )}
                      {activeActionArea !== "USER" && (
                        <td>
                          <input
                            type="button"
                            id="edit"
                            className="form-control"
                            value="Details >"
                            onClick={() => showDetails(data)}
                          ></input>
                        </td>
                      )}
                      {activeActionArea === "USER" && (
                        <td className="align-middle">
                          {data.is_active ? "YES" : "NO"}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {(activeActionArea === "USER" ||
            activeActionArea === "NOTICE" ||
            activeActionArea === "COURSE" ||
            activeActionArea === "DEPARTMENT") && (
            <input
              type="button"
              value="Add New"
              className="btn btn-primary w-100 pd-2 text-white mx-2 text-center add_btn_position"
              onClick={addNewColumn}
            ></input>
          )}
        </div>

        {/* Add User */}
        {showTabTwo === true &&
          !tabTwoDetailsMode &&
          activeActionArea === "USER" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
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
                />
              </div>
              <div className="mb-3">
                <label forhtml="pwd">Role:</label>
                <select
                  className="flex-fill form-control flex-grow-1"
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roleList
                    .filter((ut) => ut !== "ADMIN")
                    .map((data, i) => (
                      <option value={data} key={i}>
                        {data}
                      </option>
                    ))}
                </select>
              </div>
              <div className="my-3 d-flex justify-content-center">
                <input
                  type="button"
                  value="Add"
                  className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                  onClick={performUserInsertion}
                ></input>
              </div>
              <p className="fw-bold text-danger">{tabTwoErr}</p>
            </div>
          )}

        {/* Add Notice */}
        {showTabTwo === true &&
          !tabTwoDetailsMode &&
          activeActionArea === "NOTICE" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <div className="mb-3 mt-3">
                <label forhtml="title">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter Title"
                  name="title"
                  value={noticeData?.title}
                  onChange={setNoticeDataOnChange}
                />
              </div>
              <div className="mb-3">
                <label forhtml="content">Details:</label>
                <textarea
                  type="content"
                  className="form-control"
                  id="content"
                  placeholder="Enter details"
                  name="content"
                  value={noticeData?.content}
                  onChange={setNoticeDataOnChange}
                />
              </div>
              <div className="mb-3">
                <label forhtml="formFile" className="form-label">
                  Assosiated File(JPG/PNG/PDF/DOCX only, max 500MB)
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  name="formFile"
                  onChange={setNoticeDataOnChange}
                />
              </div>
              <div className="my-3 d-flex justify-content-center">
                <input
                  type="submit"
                  value="Add"
                  className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                  onClick={performNoticeInsertion}
                ></input>
              </div>
              <p className="fw-bold text-danger">{tabTwoErr}</p>
            </div>
          )}

        {/* Add Department */}
        {showTabTwo === true &&
          !tabTwoDetailsMode &&
          activeActionArea === "DEPARTMENT" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <div className="mb-3 mt-3">
                <label forhtml="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter Department Name"
                  name="name"
                  value={deptData?.name}
                  onChange={setDeptDataOnChange}
                />
              </div>
              <div className="mb-3 mt-3">
                <label forhtml="name">Short Code:</label>
                <input
                  type="text"
                  className="form-control"
                  id="shortCode"
                  placeholder="Enter Department Short Code"
                  name="shortCode"
                  value={deptData?.shortCode}
                  onChange={setDeptDataOnChange}
                />
              </div>
              <div className="my-3 d-flex justify-content-center">
                <input
                  type="submit"
                  value="Add"
                  className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                  onClick={performDeptInsertion}
                ></input>
              </div>
              <p className="fw-bold text-danger">{tabTwoErr}</p>
            </div>
          )}

        {/* Add Course */}
        {showTabTwo === true &&
          !tabTwoDetailsMode &&
          activeActionArea === "COURSE" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <div className="mb-3 mt-3">
                <label forhtml="name">Course Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter Course Name"
                  name="name"
                  value={courseData.name}
                  onChange={(e) => setCourseDataOnChange(e)}
                />
              </div>
              <div className="mb-3 mt-3">
                <label forhtml="short_code">Course Short Code:</label>
                <input
                  type="text"
                  className="form-control"
                  id="short_code"
                  placeholder="Enter Course Short Code"
                  name="short_code"
                  value={courseData.short_code}
                  onChange={(e) => setCourseDataOnChange(e)}
                />
              </div>
              <div className="mb-3 mt-3">
                <label forhtml="credit">Course Credit:</label>
                <input
                  type="number"
                  className="form-control"
                  id="credit"
                  placeholder="Enter Course Total Credit"
                  name="credit"
                  value={courseData.credit}
                  onChange={(e) => setCourseDataOnChange(e)}
                />
              </div>

              <div className="mb-3 mt-3">
                <label forhtml="pwd">Course Department:</label>
                <select
                  className="flex-fill form-control flex-grow-1"
                  name="department"
                  onChange={(e) => setCourseDataOnChange(e)}
                >
                  <option value="" >
                      Select Department
                    </option>
                  {departmentList.map((data, i) => (
                    <option value={data.department_id} key={i}>
                      {data.short_code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 mt-3 d-flex justify-content-between">
                <label forhtml="pwd" className="align-middle">
                  Currently Offered:
                </label>
                <Switch
                  name="active"
                  onChange={(e) => setCourseDataOnChange(e)}
                  checked={courseData.active}
                  className="react-switch my-2"
                />
              </div>
              <div className="my-3 d-flex justify-content-center">
                <input
                  type="button"
                  value="Add"
                  className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                  onClick={performCourseInsertion}
                ></input>
              </div>
              <p className="fw-bold text-danger">{tabTwoErr}</p>
            </div>
          )}

        {/* Details Complain */}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "COMPLAIN" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">
                Complain No {detailsData.complain_id}
              </h2>
              <table className="table table-striped overflow-auto">
                <tbody>
                  <tr>
                    <th colSpan={1}>Content</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.content}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>By</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.teacher?.name}(
                      {detailsData.teacher?.department?.name})
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>For</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.student?.name}(Roll ={" "}
                      {detailsData.student?.university_student_id})
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Date</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.date !== undefined
                        ? moment(detailsData.date).format("D MMM YYYY")
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Notify Parents</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.notify_parent === true ? "YES" : "NO"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Details Notice */}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "NOTICE" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">Notice No {detailsData.notice_id}</h2>
              <table className="table table-striped overflow-auto">
                <tbody>
                  <tr>
                    <th colSpan={1}>Title</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.title}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Content</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.content}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Date</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.createdAt !== undefined
                        ? moment(detailsData.createdAt).format("D MMM YYYY")
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Attachment</th>
                    <td colSpan={3} className="text-left">
                      <input
                        type="button"
                        key="btnDownload"
                        value="Download"
                        className="btn btn-info pd-2 text-white mx-2"
                        onClick={() => downloadFile(detailsData.filePath)}
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Created By</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.user?.teacher
                        ? detailsData.user?.teacher?.name +
                          " (" +
                          detailsData.user?.teacher?.department?.name +
                          ")"
                        : "Admin"}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Created For</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.sectionSectionId
                        ? detailsData.section.course.name +
                          " ( Section-> " +
                          detailsData.section.section_name +
                          " )"
                        : "ALL"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Details Department */}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "DEPARTMENT" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">
                Department Number: {detailsData.department_id}
              </h2>
              <table className="table table-striped overflow-auto">
                <tbody>
                  <tr>
                    <th colSpan={1}>Name</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.name}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Short Code</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.short_code}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Teacher List</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.teachers?.map((teacher, i) => (
                        <div key={i}>{teacher.name}</div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Course List</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.courses?.map((course, i) => (
                        <div key={i}>{course.name}</div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Details Guaedian*/}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "GUARDIAN" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">
                Guardian No: {detailsData.guardian?.guardian_id}
              </h2>
              <table className="table table-striped overflow-auto">
                <tbody>
                  <tr>
                    <th colSpan={1}>Name</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.guardian?.name}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Phone Number</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.guardian?.phone_number}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Guadian Of</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.name}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Details Teacher*/}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "TEACHER" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">
                Teacher No: {detailsData.teacher_id}
              </h2>
              <table className="table table-striped overflow-auto">
                <tbody>
                  <tr>
                    <th colSpan={1}>Name</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.name}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Phone Number</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.phone_number}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Designation</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.designation}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Department</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.department?.name}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Image</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.filePath && (
                        <img
                          width="100px"
                          height="75px"
                          src={
                            "http://localhost:4001/u/" + detailsData.filePath
                          }
                        />
                      )}
                      {!detailsData.filePath && "Not Available"}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Current Semester Class List</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.sections?.map((section, i) => (
                        <div key={i}>
                          {section.course?.name +
                            " (" +
                            section.section_name +
                            ")"}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Details Student*/}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "STUDENT" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">
                Student No: {detailsData.student_id}
              </h2>
              <table className="table table-striped overflow-auto">
                <tbody>
                  <tr>
                    <th colSpan={1}>Name</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.name}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Phone Number</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.phone_number}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Student ID</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.university_student_id}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Image</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.filePath && (
                        <img
                          width="100px"
                          height="75px"
                          src={
                            "http://localhost:4001/u/" + detailsData.filePath
                          }
                        />
                      )}
                      {!detailsData.filePath && "Not Available"}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Department</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.department?.name}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Joined At</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.semester?.name +
                        " " +
                        detailsData.semester?.year}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Guardian</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.guardian?.name +
                        "( Phone-> " +
                        detailsData.guardian?.phone_number +
                        " )"}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={1}>Current Courses</th>
                    <td colSpan={3} className="text-left">
                      {detailsData.course_takens?.map((ct, i) => (
                        <div key={i}>
                          {ct.section?.course?.name +
                            " (" +
                            ct.section?.section_name +
                            ")"}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Details Course*/}
        {showTabTwo === true &&
          tabTwoDetailsMode &&
          activeActionArea === "COURSE" && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p mx-3">
              <h2 className="text-center">
                Course No: {detailsData.course_id}
              </h2>
              <div className="flex-fill">
                <table className="table table-striped overflow-auto">
                  <tbody>
                    <tr>
                      <th colSpan={1}>Name</th>
                      <td colSpan={3} className="text-left">
                        {detailsData.name}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Short Code</th>
                      <td colSpan={3} className="text-left">
                        {detailsData.short_code}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Credit</th>
                      <td colSpan={3} className="text-left">
                        {detailsData.credit}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Is Offered</th>
                      <td colSpan={3} className="text-left">
                        {detailsData.credit ? "YES" : "NO"}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Department</th>
                      <td colSpan={3} className="text-left">
                        {detailsData.department?.name}
                      </td>
                    </tr>

                    <tr>
                      <th colSpan={1}>Sections</th>
                      <td colSpan={3} className="text-left">
                        {detailsData.sections?.map((section, i) => (
                          <div
                            className="d-flex justify-content-between mb-1"
                            key={i}
                          >
                            <div className="align-self-center">
                              {section.section_name +
                                " (" +
                                section.teacher?.name +
                                ")"}
                            </div>
                            <div className="w-100px">
                              <input
                                type="button"
                                id="edit"
                                className="form-control w-100px"
                                value="Details >"
                                onClick={() => showDetailsSection(section)}
                              ></input>
                            </div>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <input
                type="button"
                id="edit"
                className="form-control w-100px"
                value="Add Section >"
                onClick={addNewSection}
              ></input>
            </div>
          )}

        {/* Details Section */}
        {showTabThree === true &&
          activeActionArea === "COURSE" &&
          tabThreeDetailsMode && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p">
              <h2 className="text-center">
                Section No: {detailsDataTabThree.section_id}
              </h2>
              <div className="flex-fill">
                <table className="table table-striped overflow-auto">
                  <tbody>
                    <tr>
                      <th colSpan={1}>Name</th>
                      <td colSpan={3} className="text-left">
                        {detailsDataTabThree.section_name}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Class Taken By</th>
                      <td colSpan={3} className="text-left">
                        {detailsDataTabThree.teacher?.name}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Time Table</th>
                      <td colSpan={3} className="text-left">
                        {detailsDataTabThree.timeslot?.day +
                          " " +
                          moment(
                            detailsDataTabThree.timeslot?.start_time
                          ).format("hh:mm A") +
                          " -> " +
                          moment(detailsDataTabThree.timeslot?.end_time).format(
                            "hh:mm A"
                          )}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Student List</th>
                      <td colSpan={3} className="text-left">
                        {detailsDataTabThree.course_takens?.map((ct, i) => (
                          <div
                            className="d-flex justify-content-between mb-1"
                            key={i}
                          >
                            <div className="align-self-center">
                              {ct.student?.name +
                                " (" +
                                ct.student?.university_student_id +
                                ")"}
                            </div>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Add Section */}
        {showTabThree === true &&
          activeActionArea === "COURSE" &&
          !tabThreeDetailsMode && (
            <div className="d-flex flex-column p-3 h-100 border border-secondary w-32p">
              <h2 className="text-center">Add New Section</h2>
              <div className="flex-fill">
                <table className="table table-striped overflow-auto">
                  <tbody>
                    <tr>
                      <th colSpan={1}>Name</th>
                      <td colSpan={3} className="text-left">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Enter Section Name"
                          name="name"
                          value={sectionData.name}
                          onChange={(e) => setSectionDataOnChange(e)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Teacher</th>
                      <td colSpan={3} className="text-left">
                        <select
                          className="flex-fill form-control flex-grow-1"
                          name="teacher_id"
                          onChange={(e) => setSectionDataOnChange(e)}
                        >
                          <option value="">Select Teacher</option>
                          {teacherList.map((data, i) => (
                            <option value={data.teacher_id} key={i}>
                              {data.name +
                                " (" +
                                data.department?.short_code +
                                ")"}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={1}>Timeslot</th>
                      <td colSpan={3} className="text-left">
                        <select
                          className="flex-fill form-control flex-grow-1"
                          name="timeslot_id"
                          onChange={(e) => setSectionDataOnChange(e)}
                        >
                          <option value="">Select Timeslot</option>
                          {timeslots.map((data, i) => (
                            <option value={data.timeslot_id} key={i}>
                              {data.day +
                                " (" +
                                moment(data.start_time).format("hh:mm A") +
                                " - " +
                                moment(data.end_time).format("hh:mm A") +
                                ")"}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <input
                type="button"
                id="edit"
                className="form-control w-100px  bg-primary text-white"
                value="Add"
                onClick={performSectionInsertion}
              ></input>
              <p className="fw-bold text-danger">{tabTwoErr}</p>
            </div>
          )}
      </div>

      {showModal === true ? (
        <Modal
          show={showModal}
          onHide={updateStatus === modalMsg.success ? dummy : handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Admin Info</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="mb-3 mt-3">
              <label htmlFor="name" className="text-size-label">
                Email
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={usernameToUpdate}
                onChange={(e) => setUsernameToUpdate(e.target.value)}
              ></input>
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="pass" className=" text-size-label">
                password
              </label>
              <input
                type="password"
                id="pass"
                className="form-control"
                value={passwordToUpdate}
                onChange={(e) => setPasswordToUpdate(e.target.value)}
              ></input>
            </div>
            <p
              className={
                updateStatus === modalMsg.success
                  ? "text-success"
                  : "text-danger"
              }
            >
              {updateStatus}
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="success"
              onClick={updateAdminInfo}
              className={updateStatus === modalMsg.success ? "d-none" : ""}
            >
              Update
            </Button>
            <Button
              variant="secondary"
              onClick={doLogout}
              className={updateStatus === modalMsg.success ? "" : "d-none"}
            >
              Logout
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              className={updateStatus === modalMsg.success ? "d-none" : ""}
            >
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

export default AdminHomePage;
