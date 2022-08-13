import { useState, useEffect } from "react";
import "../../css/common.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";

function TeacherHomePage() {
  const [currentSectionData, setCurrentSectionData] = useState({});
  const [teacherData, setTeacherData] = useState({});
  const [currentActionId, setCurrentActionId] = useState(0);
  const [checked, setChecked] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);
  const [complainData, setComplainData] = useState([]);
  const [messageData, setMessageData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [eventRole, setEventRole] = useState("");

  const [eventIdEditing, setEventIdEditing] = useState(0);
  const [noticeIdEditing, setNoticeIdEditing] = useState(0);
  const [complainIdEditing, setComplainIdEditing] = useState(0);

  const [eventDate, setEventDate] = useState({
    id: 0,
    year: "",
    month: "",
    date: "",
    hour: "",
    minute: ""
  });

  const [oneNoticeData, setOneNoticeData] = useState({
    title: "",
    content: "",
    formFile: null
  });

  const [oneComplainData, setOneComplainData] = useState({
    content: "",
    date: "",
    studentId: "",
    notify_parent: false
  });

  const eventList = ["QUIZ", "MID", "FINAL", "ASSIGNMENT", "PRESENTATION"];
  const sideMenu = [
    "Attendence",
    "Discussion",
    "Student List",
    "Complain",
    "Result",
    "Notice",
    "Event"
  ];
  const month = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
  ];

  const navigate = useNavigate();
  const handleClose = () => setShowModal(false);

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
        console.log(error);
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
    localStorage.removeItem("active");
    navigate("/");
  }

  const handleOptionButtonClick = async (sectionId) => {
    await getAttendenceFromApi(sectionId);
    await getEventFromApi(sectionId);
    await getNoticeFromApi(sectionId);
    await getComplainFromApi(sectionId);
    await getMessageFromApi(sectionId);
  };

  const getAttendenceFromApi = async (sectionId) => {
    let cSection;
    teacherData.sections.forEach((data) => {
      if (data.section_id === sectionId) {
        cSection = data;
        setCurrentSectionData(cSection);
      }
    });
    await axiosApi
      .post("/attendence/" + sectionId, {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        let studentAttendenceData = [];
        let oldDbData = response.data.data;
        console.log("oldData->", oldDbData, cSection);
        if (oldDbData.length !== 0) {
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
          cSection.course_takens?.forEach((innerElement) => {
            let oneStudentAttendenceData = {
              is_present: false,
              studentStudentId: innerElement.student.student_id,
              sectionSectionId: sectionId,
              studentName: innerElement.student.name,
              studentRoll: innerElement.student.university_student_id
            };
            studentAttendenceData.push(oneStudentAttendenceData);
          });
        }
        setChecked(studentAttendenceData);
      })
      .catch(function (error) {
        console.log("2", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const getEventFromApi = async (sectionId) => {
    await axiosApi
      .post("/section/" + sectionId + "/event", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        console.log(response.data, "===");
        if (response.data !== undefined) {
          setEventData(response.data);
        }
      })
      .catch(function (error) {
        console.log("3", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const getNoticeFromApi = async (sectionId) => {
    await axiosApi
      .post("/section/" + sectionId + "/notice", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        console.log(response.data, "===notice");
        if (response.data !== undefined) {
          setNoticeData(response.data.data);
        }
      })
      .catch(function (error) {
        console.log("3", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const getComplainFromApi = async (sectionId) => {
    let cSection;
    let studentList = [];
    teacherData.sections.forEach((data) => {
      if (data.section_id === sectionId) {
        cSection = data;
      }
    });

    cSection.course_takens?.forEach((element) => {
      studentList.push(element.student?.student_id);
    });

    await axiosApi
      .post("/students/complain", {
        token: localStorage.getItem("token"),
        ids: studentList
      })
      .then(function (response) {
        console.log(response.data, "===complain");
        if (response.data !== undefined) {
          setComplainData(response.data.data);
        }
      })
      .catch(function (error) {
        console.log("3", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const getMessageFromApi = async (sectionId) => {
    await axiosApi
      .post("/section/" + sectionId + "/message", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        console.log(response.data, "===");
        if (response.data !== undefined) {
          console.log("mmmm", response.data);
          setMessageData(response.data);
        }
      })
      .catch(function (error) {
        console.log("mm", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const handleAttendence = (i) => {
    let z = [...checked];
    z[i].is_present = !checked[i].is_present;
    setChecked(z);
  };

  const deleteEvents = async (eventId) => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };

    await axiosApi
      .delete(
        "/event/" + eventId,
        {},
        {
          headers: headers
        }
      )
      .then(function (response) {
        getEventFromApi(currentSectionData.section_id);
      })
      .catch(function (error) {
        console.log("2", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const deleteNotice = async (noticeId) => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };

    await axiosApi
      .delete(
        "/notice/" + noticeId,
        {},
        {
          headers: headers
        }
      )
      .then(function (response) {
        getNoticeFromApi(currentSectionData.section_id);
      })
      .catch(function (error) {
        console.log("2", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
  };

  const deleteComplain = async (complainId) => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };

    await axiosApi
      .delete(
        "/complain/" + complainId,
        {},
        {
          headers: headers
        }
      )
      .then(function (response) {
        getComplainFromApi(currentSectionData.section_id);
      })
      .catch(function (error) {
        console.log("2", error);
        navigate("/error", {
          state: {
            msg: error.response?.statusText,
            errCode: error.response?.status
          }
        });
      });
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

  const setDateOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(eventDate));
    temp[e.target.name] = e.target.value;
    setEventDate(temp);
  };

  const setComplainDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(oneComplainData));
    if (e === true || e === false) {
      temp["notify_parent"] = e;
    } else {
      temp[e.target.name] = e.target.value;
    }
    setOneComplainData(temp);
  };

  const performEventInsertion = async () => {
    console.log("lal ishq");
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    let oneEventData = {};
    oneEventData.id = eventIdEditing;
    oneEventData.role = eventRole;
    oneEventData.date = new moment(
      new Date(
        eventDate.year,
        eventDate.month,
        eventDate.date,
        eventDate.hour,
        eventDate.minute
      )
    )
      .toDate();
    // for BD Timezone 6 hour added with GMT

    oneEventData.sectionId = currentSectionData.section_id;
    if (oneEventData.date === "Invalid Date") {
      setUpdateStatus("Invalid Date");
      setShowModal(true);
    } else {
      console.log("oneEventData", oneEventData);
      await axiosApi
        .post("/event/create", oneEventData, {
          headers: headers
        })
        .then(function (response) {
          console.log("=>", response);
          if (response !== null && response !== undefined) {
            console.log("should update", oneEventData.sectionId, response);
            getEventFromApi(oneEventData.sectionId);
          }
        })
        .catch(function (error) {
          console.log("->", error);
          setUpdateStatus(error.message);
          setShowModal(true);
        });
    }
  };

  const setNoticeDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(oneNoticeData));
    if (e.target.name === "formFile") {
      console.log(e.target.files);
      temp.formFile = e.target.files[0];
      temp.fileName = e.target.files[0].name;
    } else {
      temp[e.target.name] = e.target.value;
    }
    setOneNoticeData(temp);
  };

  const performNoticeInsertion = async (event) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
      "x-access-token": localStorage.getItem("token")
    };
    let temp = oneNoticeData;
    temp.id = noticeIdEditing;
    temp.sectionSectionId = currentSectionData.section_id;
    console.log(temp);
    await axiosApi
      .post("/notice/create", temp, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          getNoticeFromApi(currentSectionData.section_id);
        }
      })
      .catch(function (error) {
        console.log("->", error);
        setUpdateStatus(error.message);
        setShowModal(true);
      });
  };

  const performComplainInsertion = async () => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    let temp = {};
    temp = oneComplainData;
    temp.id = complainIdEditing;
    temp.date = moment();
    temp.teacherId = teacherData.teacher_id;
    console.log("oneComplainData temp", temp);
    await axiosApi
      .post("/complain/create", temp, {
        headers: headers
      })
      .then(function (response) {
        console.log("=>", response);
        if (response !== null && response !== undefined) {
          getComplainFromApi(currentSectionData.section_id);
        }
      })
      .catch(function (error) {
        console.log("->", error);
        setUpdateStatus(error.message);
        setShowModal(true);
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
          {teacherData !== {} &&
            teacherData.sections !== undefined &&
            teacherData.sections.map((data, i) => (
              <input
                type="button"
                key={i}
                value={data.course.name + " (" + data.section_name + ") "}
                className="btn btn-warning pd-2 text-white mx-2 button-active"
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

      <div
        className={
          Object.keys(currentSectionData).length !== 0
            ? "flex-fill d-flex trans"
            : "op-0"
        }
      >
        {/* Left Navigation Bar */}
        <div className="border d-flex flex-column bg-secondary pt-4">
          {sideMenu.map((data, i) => (
            <input
              type="button"
              key={i}
              value={data}
              className="btn btn-light w-120px mx-2 mb-2 p-1 "
              onClick={() => setCurrentActionId(i)}
            ></input>
          ))}
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

        {currentActionId === 1 && (
          <div className="d-flex flex-fill flex-column p-2 mb-2">
            <h4>Discussion Area</h4>
            <div className="row ms-2">
              <div className="col-sm-6 border p-3">
                {messageData?.map((data, i) => (
                  <div className="mb-2 d-flex" key={i}>
                    <div
                      className={
                        teacherData.user?.user_id === data.user?.user_id
                          ? "d-flex ms-auto p-3 rounded bg-secondary"
                          : "d-flex me-auto p-3 rounded bg-info"
                      }
                    >
                      <div>
                        <img
                          className="me-2"
                          width="32px"
                          height="32px"
                          src={
                            data.teacher
                              ? "http://localhost:4001/u/" +
                                data.teacher?.filePath
                              : "http://localhost:4001/u/" +
                                data.student?.filePath
                          }
                        />
                      </div>
                      <div className="text-white">{data.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentActionId === 2 && (
          <div className="d-flex flex-fill flex-column p-2 mb-2">
            <h4>Student List</h4>
            <table className="table table-striped overflow-auto">
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>Name</th>
                  <th>University ID</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {currentSectionData.course_takens?.map((data, i) => (
                  <tr className="mb-1" key={i}>
                    <td className="text-truncate">{i}</td>
                    <td className="text-truncate">{data.student?.name}</td>
                    <td className="text-truncate">
                      {data.student?.university_student_id}
                    </td>
                    <td className="text-truncate">
                      {data.student?.phone_number}
                    </td>
                  </tr>
                ))}
                {console.log("*", currentSectionData)}
              </tbody>
            </table>
          </div>
        )}

        {currentActionId === 3 && (
          <div className="w-100 p-3">
            <h4>Complain List</h4>
            <div className="row p-2">
              <div
                className={
                  noticeData.length === 0 ? "op-0 h-0px" : "col-sm-8 trans"
                }
              >
                <table className="table table-striped overflow-auto">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th className="w-300px">Content</th>
                      <th>By</th>
                      <th>For</th>
                      <th>Date</th>
                      <th>Notify Parent</th>
                      <th className="w-130px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {complainData?.map((data, i) => (
                      <tr className="mb-1" key={i}>
                        <td className="text-truncate">{i + 1}</td>
                        <td className="w-300px">{data.content}</td>
                        <td className="">{data.teacher?.name}</td>
                        <td className="">
                          {data.student?.name +
                            "(" +
                            data.student?.university_student_id +
                            ")"}
                        </td>
                        <td className="">
                          {moment(data.date).format("DD-MM-YYYY")}
                        </td>
                        <td className="text-truncate">
                          {data.notify_parent ? "YES" : "NO"}
                        </td>
                        <td className="w-130px">
                          {data.sectionSectionId !== null && (
                            <>
                              <input
                                value="X"
                                onClick={(e) =>
                                  deleteComplain(data.complain_id)
                                }
                                type="button"
                                className="btn btn-danger w-50px br-left"
                              ></input>
                              <input
                                value=">>"
                                onClick={(e) =>
                                  setComplainIdEditing(data.complain_id)
                                }
                                type="button"
                                className="btn btn-secondary w-50px ms-2 br-right"
                              ></input>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-sm-4 trans">
                <div className="mt-3 mb-3">
                  <label forhtml="content">Content:</label>
                  <textarea
                    type="content"
                    className="form-control"
                    id="content"
                    placeholder="Enter Complain"
                    name="content"
                    value={oneComplainData?.content}
                    onChange={setComplainDataOnChange}
                  />
                </div>
                <div className="mb-3">
                  <label forhtml="studentId">
                    Student Id to Complain Against:
                  </label>
                  <select
                    className="flex-fill form-control flex-grow-1"
                    name="studentId"
                    onChange={(e) => setComplainDataOnChange(e)}
                  >
                    <option>Select Student"</option>
                    {currentSectionData.course_takens?.map((data, i) => (
                      <option value={data.student.student_id} key={i}>
                        {data.student?.name +
                          "(" +
                          data.student?.university_student_id +
                          ")"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 d-flex">
                  <label
                    forhtml="notify_parent"
                    className=" align-self-center me-3"
                  >
                    Notify Parent:
                  </label>
                  <Switch
                    name="notify_parent"
                    onChange={setComplainDataOnChange}
                    checked={oneComplainData?.notify_parent}
                    className="react-switch my-2"
                  />
                </div>

                <div className="my-3 d-flex justify-content-center">
                  <input
                    type="submit"
                    value={complainIdEditing === 0 ? "Add" : "Update"}
                    className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                    onClick={performComplainInsertion}
                  ></input>
                  <input
                    type="button"
                    value="Cancel"
                    className="btn btn-warning px-5 text-white mx-2 text-center add_btn_position"
                    onClick={(e) => setComplainIdEditing(0)}
                    hidden={complainIdEditing === 0}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentActionId === 5 && (
          <div className="w-100 p-3">
            <h4>Notice List</h4>
            <div className="row p-2">
              <div
                className={
                  noticeData.length === 0 ? "op-0 h-0px" : "col-sm-8 trans"
                }
              >
                <table className="table table-striped overflow-auto">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th>Title</th>
                      <th className="w-300px">Details</th>
                      <th>File</th>
                      <th>Created By</th>
                      <th>For</th>
                      <th className="w-130px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {noticeData?.map((data, i) => (
                      <tr className="mb-1" key={i}>
                        <td className="text-truncate">{i + 1}</td>
                        <td className="">{data.title}</td>
                        <td className="w-300px">{data.content}</td>
                        <td className="text-truncate">
                          {data.filePath !== null && (
                            <input
                              type="button"
                              key="btnDownload"
                              value="Download"
                              className="btn btn-info pd-2 text-white mx-2"
                              onClick={() => downloadFile(data.filePath)}
                            ></input>
                          )}
                        </td>
                        <td className="text-truncate">
                          {data.userUserId === null
                            ? "Admin"
                            : data.user?.teacher?.name}
                        </td>
                        <td className="text-truncate">
                          {data.sectionSectionId === null
                            ? "All"
                            : "This Course"}
                        </td>
                        <td className="w-130px">
                          {data.sectionSectionId !== null && (
                            <>
                              <input
                                value="X"
                                onClick={(e) => deleteNotice(data.notice_id)}
                                type="button"
                                className="btn btn-danger w-50px br-left"
                              ></input>
                              <input
                                value=">>"
                                onClick={(e) =>
                                  setNoticeIdEditing(data.notice_id)
                                }
                                type="button"
                                className="btn btn-secondary w-50px ms-2 br-right"
                              ></input>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-sm-4 trans">
                <div className="mb-3 mt-3">
                  <label forhtml="title">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter Title"
                    name="title"
                    value={oneNoticeData?.title}
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
                    value={oneNoticeData?.content}
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
                    value={noticeIdEditing === 0 ? "Add" : "Update"}
                    className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                    onClick={performNoticeInsertion}
                  ></input>
                  <input
                    type="button"
                    value="Cancel"
                    className="btn btn-warning px-5 text-white mx-2 text-center add_btn_position"
                    onClick={(e) => setNoticeIdEditing(0)}
                    hidden={noticeIdEditing === 0}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentActionId === 6 && (
          <div className="w-100 p-3">
            <h4>Event List</h4>
            <div className="row p-2">
              <div
                className={
                  eventData.length === 0 ? "op-0 h-0px" : "col-sm-8 trans"
                }
              >
                <table className="table table-striped overflow-auto">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th>Event Type</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventData?.map((data, i) => (
                      <tr className="mb-1" key={i}>
                        <td className="text-truncate">{i + 1}</td>
                        <td className="text-truncate">{data.role}</td>
                        <td className="text-truncate">
                          {moment(data.date).format("D MMM YYYY (HH:mm)")}
                        </td>
                        <td className="w-130px">
                          <input
                            value="X"
                            onClick={(e) => deleteEvents(data.class_event_id)}
                            type="button"
                            className="btn btn-danger w-50px br-left"
                          ></input>
                          <input
                            value=">>"
                            onClick={(e) =>
                              setEventIdEditing(data.class_event_id)
                            }
                            type="button"
                            className="btn btn-secondary w-50px ms-2 br-right"
                          ></input>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-sm-4 trans">
                <div className="mb-3">
                  <label forhtml="date">Role</label>
                  <select
                    className="form-control flex-grow-1 me-2"
                    onChange={(e) => setEventRole(e.target.value)}
                  >
                    <option>Select Event Type</option>
                    {eventList.map((data, i) => (
                      <option value={data} key={i}>
                        {data}
                      </option>
                    ))}
                  </select>
                  <input
                    name="id"
                    onChange={(e) => setDateOnChange(e)}
                    hidden
                  ></input>
                  <div className="mb-3">
                    <label forhtml="year">Year</label>
                    <input
                      className="form-control flex-grow-1"
                      type="number"
                      max="2025"
                      min="2016"
                      name="year"
                      value={eventDate.year}
                      onChange={(e) => setDateOnChange(e)}
                    ></input>
                  </div>
                  <div className="my-3">
                    <label forhtml="month">Month</label>
                    <select
                      name="month"
                      className="form-control flex-grow-1"
                      onChange={(e) => setDateOnChange(e)}
                    >
                      <option>Select Month</option>
                      {month.map((data, i) => (
                        <option value={i} key={i}>
                          {data}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label forhtml="date">Date</label>
                    <input
                      className="form-control flex-grow-1"
                      type="number"
                      max="31"
                      min="1"
                      name="date"
                      value={eventDate.date}
                      onChange={(e) => setDateOnChange(e)}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label forhtml="hour">Hour</label>
                    <input
                      className="form-control flex-grow-1"
                      type="number"
                      max="23"
                      min="0"
                      name="hour"
                      value={eventDate.hour}
                      onChange={(e) => setDateOnChange(e)}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label forhtml="minute">Minute</label>
                    <input
                      className="form-control flex-grow-1"
                      type="number"
                      max="59"
                      min="0"
                      name="minute"
                      value={eventDate.minute}
                      onChange={(e) => setDateOnChange(e)}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <div className="my-3 d-flex justify-content-center">
                      <input
                        type="button"
                        value={eventIdEditing === 0 ? "Add" : "Update"}
                        className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
                        onClick={performEventInsertion}
                      ></input>
                      <input
                        type="button"
                        value="Cancel"
                        className="btn btn-warning px-5 text-white mx-2 text-center add_btn_position"
                        onClick={(e) => setEventIdEditing(0)}
                        hidden={eventIdEditing === 0}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal === true ? (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sorry</Modal.Title>
          </Modal.Header>

          <Modal.Body>{updateStatus}</Modal.Body>

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

export default TeacherHomePage;
