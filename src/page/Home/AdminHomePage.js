import { useState, useEffect } from "react";
import "../../css/common.css";
import "../../css/homepage.css";
import "../../css/admin.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import moment from "moment";
function AdminHomePage() {
  const [userList, setUserList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectionRole, setSelectionRole] = useState("");
  const [oldData, setOldData] = useState([]);
  const [activeActionArea, setActiveActionArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDeptShortCode, setSearchTermDeptShortCode] = useState("");
  const [showTabTwo, setShowTabTwo] = useState(false);
  const [tabTwoErr, setTabTwoErr] = useState("");
  // const [userListFull, setUserListFull] = useState({});

  const [eMail, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const [noticeData, setNoticeData] = useState({
    title: "",
    content: "",
    formFile: null
  });
  const [deptData, setDeptData] = useState({
    name: "",
    shortCode: ""
  });

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
    }
  }, []);

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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

  async function editProfile(currentStudent) {
    // setUserListFull(currentStudent);
  }

  const addNewColumn = () => {
    setShowTabTwo(true);
    setTabTwoErr(false);
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
          setTabTwoErr("");
        }
      })
      .catch(function (error) {
        setTabTwoErr(error.message);
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
          onClick={dummy}
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
                    activeActionArea === "DEPARTMENT"||
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
                    <th></th>
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
                            {data !== undefined
                              ? data.credit
                              : ""}
                          </td>
                          <td className="align-middle">
                            {data.sections !== undefined
                              ? data.sections?.length
                              : "0"}
                          </td>
                        </>
                      )}

                      <td>
                        <input
                          type="button"
                          id="edit"
                          className="form-control"
                          value="Details >"
                          onClick={() => editProfile(activeActionArea)}
                        ></input>
                      </td>
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
        {showTabTwo === true && activeActionArea === "USER" && (
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
        {showTabTwo === true && activeActionArea === "NOTICE" && (
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
                Assosiated File(JPG/PNG/PDF/DOCX only, max 50MB)
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
        {showTabTwo === true && activeActionArea === "DEPARTMENT" && (
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
      </div>
    </div>
  );
}

export default AdminHomePage;
