import { useState } from "react";
import "../../css/common.css";
import "../../css/homepage.css";
import "../../css/admin.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
function AdminHomePage() {
  const [userList, setUserList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectionRole, setSelectionRole] = useState("");
  const [oldData, setOldData] = useState([]);
  const [userType, setUserType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDeptShortCode, setSearchTermDeptShortCode] = useState("");
  // const [userListFull, setUserListFull] = useState({});

  const roleList = ["ADMIN", "STUDENT", "TEACHER", "GUARDIAN"];

  const navigate = useNavigate();

  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  async function getUserData(type) {
    let path = "";

    switch (type) {
      case "USER":
        setUserType("USER");
        path = "/users";
        break;
      case "TEACHER":
        setUserType("TEACHER");
        path = "/teachers";
        break;
      case "STUDENT":
        setUserType("STUDENT");
        path = "/students";
        break;
      case "GUARDIAN":
        setUserType("GUARDIAN");
        path = "/guardians";
        break;
      default:
        navigate("/error");
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
        }
      })
      .catch(function (error) {
        navigate("/error");
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
        navigate("/error");
      });
  }

  // const resetData = () => {
  //   setUserList(oldData);
  // };

  const searchData = () => {
    let result = oldData.filter((data) =>
      data.university_student_id.toString().includes(searchTerm)
    );
    setUserList(result);
  };

  const searchDataByDepartment = () => {
    let result;
    if (userType === "USER") {
      console.log(selectionRole);
      if (selectionRole === "" || selectionRole === "0") {
        result = oldData;
      } else {
        result = oldData.filter((data) => data.role === selectionRole);
      }
    } else if (userType === "STUDENT" || userType === "TEACHER") {
      if (searchTermDeptShortCode === "0") {
        result = oldData;
      } else {
        result = oldData.filter(
          (data) => data.department.short_code === searchTermDeptShortCode
        );
        if (userType === "STUDENT" && searchTerm !== "") {
          result = result.filter((data) =>
            data.university_student_id.toString().includes(searchTerm)
          );
        }
      }
    }
    setUserList(result);
  };

  async function editProfile(currentStudent) {
    // setUserListFull(currentStudent);
  }

  const dummy = () => {
    return "";
  };

  function handleSelectChange(event) {
    setSearchTermDeptShortCode(event.target.value);
  }

  function handleSelectChangeRole(event) {
    setSelectionRole(event.target.value);
  }

  return (
    <div className="full-screen d-flex flex-column">
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
            onClick={dummy}
          ></input>
          <input
            type="button"
            key="btn5"
            value="Notice"
            className="btn btn-warning pd-2 text-white mx-2"
            onClick={dummy}
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
      <div className="flex-fill d-flex justify-content-between p-2">
        <div
          className={
            userType !== ""
              ? "d-flex flex-column p-3 h-100 border border-secondary"
              : ""
          }
        >
          {userType && (
            <h1 className="text-center bg-dark text-white">
              {`${userType[0].toUpperCase()}${userType.slice(1).toLowerCase()}`}{" "}
              List
            </h1>
          )}
          {userType === "STUDENT" && (
            <div className="d-flex mt-2">
              <input
                type="number"
                id="studentId"
                className="form-control flex-fill"
                placeholder="Type student ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></input>
              <input
                type="button"
                value="Search"
                className="btn btn-success w-120px text-white mx-2"
                onClick={searchData}
              ></input>
            </div>
          )}

          {(userType === "TEACHER" || userType === "STUDENT") && (
            <div className="d-flex mt-2">
              <select
                className="flex-fill form-control"
                onChange={(event) => handleSelectChange(event)}
              >
                <option value="0" key="0">
                  ALL
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
                onClick={searchDataByDepartment}
              ></input>
            </div>
          )}

          {userType === "USER" && (
            <div className="d-flex mt-2">
              <select
                className="flex-fill form-control"
                onChange={(event) => handleSelectChangeRole(event)}
              >
                <option value="0" key="0">
                  ALL
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
                onClick={searchDataByDepartment}
              ></input>
            </div>
          )}

          <div className=" mt-2 flex-fill">
            <table className="table table-striped overflow-auto">
              {userType !== "" && (
                <thead>
                  <tr>
                    {(userType === "STUDENT" || userType === "TEACHER") && (
                      <th>Name</th>
                    )}
                    {userType === "STUDENT" && <th>ID</th>}
                    {userType === "TEACHER" && <th>Designation</th>}
                    {(userType === "STUDENT" || userType === "TEACHER") && (
                      <th>Department</th>
                    )}
                    {userType === "USER" && <th>Email</th>}
                    {userType === "USER" && <th>Role</th>}

                    <th></th>
                  </tr>
                </thead>
              )}
              <tbody>
                {(userList.length !== 0 || userType !== "") &&
                  userList.map((data, i) => (
                    <tr key={i}>
                      {userType === "USER" && (
                        <td className="align-middle">{data.email}</td>
                      )}
                      {userType === "USER" && (
                        <td className="align-middle">{data.role}</td>
                      )}
                      {(userType === "STUDENT" || userType === "TEACHER") && (
                        <td className="align-middle">{data.name}</td>
                      )}
                      {userType === "STUDENT" && (
                        <td className="align-middle">
                          {data.university_student_id}
                        </td>
                      )}
                      {userType === "TEACHER" && (
                        <td className="align-middle">{data.designation}</td>
                      )}
                      {(userType === "TEACHER" || userType === "STUDENT") && (
                        <td className="align-middle">
                          {data.department !== undefined
                            ? data.department.short_code
                            : ""}
                        </td>
                      )}
                      <td>
                        <input
                          type="button"
                          id="edit"
                          className="form-control"
                          value="Details >"
                          onClick={() => editProfile(userType)}
                        ></input>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {userType === "USER" && (
            <input
              type="button"
              value="Add New"
              className="btn btn-primary w-100 pd-2 text-white mx-2 text-center add_btn_position"
              onClick={dummy}
            ></input>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
