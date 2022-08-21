import { useState, useEffect, useRef } from "react";
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
  const [currentCourseTakenData, setCurrentCourseTakenData] = useState({});
  const [messageContentData, setMessageContentData] = useState([]);
  const [filePathMessageData, setFilePathMessageData] = useState({
    fileName: "",
    attachment: null
  });
  const [eventDate, setEventDate] = useState({
    id: 0,
    date: "",
    startTime: "",
    duration: 0
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
  const [attendenceDate, setAttendenceDate] = useState("");
  const [showAttendence, setShowAttendence] = useState(false);

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
  const imageInputRef = useRef();
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
    teacherData.sections.forEach((data) => {
      if (data.section_id === sectionId) {
        setCurrentSectionData(data);
      }
    });
    await getAttendenceFromApi(sectionId);
    await getEventFromApi(sectionId);
    await getNoticeFromApi(sectionId);
    await getComplainFromApi(sectionId);
    await getMessageFromApi(sectionId);
    setShowAttendence(false);
  };

  const getAttendenceFromApi = async (sectionId) => {
    let cSection;
    teacherData.sections.forEach((data) => {
      if (data.section_id === sectionId) {
        cSection = data;
      }
    });
    await axiosApi
      .post("/attendence/" + sectionId, {
        token: localStorage.getItem("token"),
        date: attendenceDate
      })
      .then(function (response) {
        let studentAttendenceData = [];
        let oldDbData = response.data.data;
        if (oldDbData.length !== 0) {
          oldDbData.forEach((data) => {
            let oneStudentAttendenceData = {
              attendence_id: data.attendence_id,
              is_present: data.is_present,
              studentStudentId: data.studentStudentId,
              sectionSectionId: data.sectionSectionId,
              studentName: data.student.name,
              studentRoll: data.student.university_student_id,
              studentResult1stTerm: "",
              studentResultMidTerm: "",
              studentResultFinal: "",
              studentResultQuiz: "",
              studentResultAssignment: "",
              studentResultAttendence: "",
              studentResult: 0,
              courseId: currentSectionData.course?.course_id
            };
            studentAttendenceData.push(oneStudentAttendenceData);
          });
          console.log("getting updated attendence", studentAttendenceData);
        } else {
          cSection.course_takens?.forEach((innerElement) => {
            console.log(innerElement, "innerElementinnerElement");
            let oneStudentAttendenceData = {
              is_present: false,
              studentStudentId: innerElement.student.student_id,
              sectionSectionId: sectionId,
              courseId: innerElement.section?.course?.course_id,
              studentName: innerElement.student.name,
              studentRoll: innerElement.student.university_student_id,
              studentResult1stTerm: "",
              studentResultMidTerm: "",
              studentResultFinal: "",
              studentResultQuiz: "",
              studentResultAssignment: "",
              studentResultAttendence: "",
              studentResult: 0
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

  const handleResult = (e, i) => {
    let z = [...checked];
    for (let index = 0; index < z.length; index++) {
      if (z[index].studentStudentId === i) {
        z[index][e.target.name] = e.target.value;
      }
    }

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
      attendenceData[i].date = attendenceDate;
    }
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
        setAttendenceDate("");
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
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    let oneEventData = {};
    oneEventData.id = eventIdEditing;
    oneEventData.role = eventRole;
    oneEventData.duration = eventDate.duration;
    oneEventData.date = new moment(eventDate.date + "T" + eventDate.startTime);
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

  const performMessageInsertion = async () => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
      "x-access-token": localStorage.getItem("token")
    };
    let temp = {};
    temp.fileName = filePathMessageData.fileName;
    temp.formFile = filePathMessageData.attachment;
    temp.content = messageContentData;
    temp.sectionSectionId = currentSectionData?.section_id;
    await axiosApi
      .post("/message/create", temp, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          setMessageContentData("");
          setFilePathMessageData({
            fileName: "",
            attachment: null
          });
          imageInputRef.current.value = "";
          getMessageFromApi(currentSectionData?.section_id);
        }
      })
      .catch(function (error) {
        console.log("->", error);
        setUpdateStatus(error.message);
        setShowModal(true);
      });
  };

  const performResultInsertion = async () => {
    const headers = {
      "x-access-token": localStorage.getItem("token")
    };
    await axiosApi
      .post(
        "/result/create",
        { data: checked },
        {
          headers: headers
        }
      )
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log("->", error);
        setUpdateStatus(error.message);
        setShowModal(true);
      });
  };

  const setMessageAttachmentOnChange = (e) => {
    let temp = {};
    temp.attachment = e.target.files[0];
    temp.fileName = e.target.files[0].name;
    setFilePathMessageData(temp);
  };

  const updateAttendenceData = async (e) => {
    setAttendenceDate(e.target.value);
    setShowAttendence(false);
  };

  const updateAttendenceDataView = async (e) => {
    await getAttendenceFromApi(currentSectionData.section_id);
    setShowAttendence(true);
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
            <div className="col-sm-4">
              <h4>Attendence</h4>
              <div className="row">
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    value={attendenceDate}
                    onChange={(e) => updateAttendenceData(e)}
                  ></input>
                </div>
                <div className="col-sm-4">
                  <input
                    className="btn btn-primary"
                    value="See Attendence"
                    type="button"
                    onClick={(e) => updateAttendenceDataView(e)}
                  ></input>
                </div>
              </div>
            </div>

            {checked !== undefined &&
              checked.length !== 0 &&
              attendenceDate !== "" &&
              showAttendence && (
                <>
                  {checked.map((ch, i) => (
                    <div className="d-flex border-bottom mt-3" key={i}>
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
                  <input
                    type="button"
                    value="Submit"
                    className="btn btn-kolapata btn-lg mt-2 w-120px"
                    onClick={performAttendence}
                  ></input>
                </>
              )}
          </div>
        )}

        {currentActionId === 1 && (
          <div className="w-100">
            <div className="d-flex flex-column justify-content-between">
              <div className="border col-sm-5 p-2">
                <h2> Post New Message </h2>
                <textarea
                  className="form-control"
                  id="messageText"
                  placeholder="Enter Your message"
                  name="messageText"
                  value={messageContentData}
                  onChange={(e) => setMessageContentData(e.target.value)}
                />
                <div className="mt-3">
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    name="formFile"
                    ref={imageInputRef}
                    onChange={setMessageAttachmentOnChange}
                  />
                </div>
                <div className="my-3 d-flex justify-content-between">
                  <input
                    type="button"
                    value="Refresh"
                    className="btn btn-secondary px-5 text-white text-center add_btn_position"
                    onClick={() =>
                      getMessageFromApi(
                        currentCourseTakenData.section?.section_id
                      )
                    }
                  ></input>
                  <input
                    type="submit"
                    value="Add"
                    className="btn btn-primary px-5 text-white text-center add_btn_position"
                    onClick={performMessageInsertion}
                  ></input>
                </div>
              </div>
              <div className="col-sm-5 border p-2 mh-700">
                {messageData?.map((data, i) => (
                  <div className="mb-2 d-flex" key={i}>
                    <div
                      className={
                        teacherData.user?.user_id === data.user?.user_id
                          ? "d-flex ms-auto flex-row-reverse"
                          : "d-flex me-auto"
                      }
                    >
                      <div className="align-self-end d-flex">
                        <img
                          className="mx-2 rounded-circle align-self-end wh-36px"
                          src={
                            data.user?.teacher
                              ? "http://localhost:4001/u/" +
                                data.user?.teacher?.filePath
                              : "http://localhost:4001/u/" +
                                data.user?.student?.filePath
                          }
                        />
                      </div>
                      <div
                        className={
                          teacherData.user?.user_id === data.user?.user_id
                            ? "text-white rounded-custom-right bg-primary p-2"
                            : data.user?.teacher
                            ? "text-white rounded-custom-left bg-danger p-2"
                            : "text-white rounded-custom-left bg-secondary p-2"
                        }
                      >
                        {teacherData.user?.user_id !== data.user?.user_id && (
                          <p className="mini-text">
                            {data.user?.teacher
                              ? data.user?.teacher.name
                              : data.user?.student?.name +
                                "( ID:" +
                                data.user?.student?.university_student_id +
                                ")"}
                          </p>
                        )}
                        <p>{data.content}</p>
                      </div>
                      {data.filePath && (
                        <div
                          className="mx-2"
                          onClick={() => downloadFile(data.filePath)}
                        >
                          <svg
                            className="wh-36px svg-download"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 122.88 122.88"
                          >
                            <title>{data.filePath}</title>
                            <path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm10,50.74A3.31,3.31,0,0,1,76,55.47L63.44,67.91a3.31,3.31,0,0,1-4.65,0L46.38,55.65A3.32,3.32,0,0,1,51,50.92l6.83,6.77.06-23.84a3.32,3.32,0,0,1,6.64.06l-.07,23.65,6.9-6.82ZM35,81.19l0-13a3.32,3.32,0,0,1,6.64.06l0,9.45q19.76,0,39.5,0l0-9.51a3.32,3.32,0,1,1,6.64.06l0,12.91h0a3.32,3.32,0,0,1-3.29,3.17q-23.08,0-46.15,0A3.32,3.32,0,0,1,35,81.19ZM99.44,23.44a53.74,53.74,0,1,0,15.74,38,53.58,53.58,0,0,0-15.74-38Z" />
                          </svg>
                        </div>
                      )}
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
                  complainData.length === 0 ? "op-0 h-0px" : "col-sm-8 trans"
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

        {currentActionId === 4 && (
          <div className="d-flex flex-column p-2">
            <h4>Submit Result</h4>
            <h5 className="text-danger">
              Aftter submitting the result, you and the student will no longer
              be able to access this section. It will be deleted from system.
              only the result will remain. Only submit result when everything
              else is completed
            </h5>
            {checked !== undefined &&
              checked.length !== 0 &&
              checked.map((ch, i) => (
                <div className="d-flex border-bottom mb-2" key={i}>
                  <div className="text-truncate align-self-center w-350px h-100">
                    {ch.studentName + " (" + ch.studentRoll + ") "}
                  </div>
                  {/* <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResult}
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input> */}
                  <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResult1stTerm}
                    placeholder="1st Term (Max 20)"
                    max="20"
                    name="studentResult1stTerm"
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input>
                  <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResultMidTerm}
                    placeholder="Mid Term (Max 20)"
                    max="20"
                    name="studentResultMidTerm"
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input>
                  <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResultFinal}
                    placeholder="Final (Max 35)"
                    max="35"
                    name="studentResultFinal"
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input>
                  <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResultQuiz}
                    placeholder="Quiz (Max 10)"
                    name="studentResultQuiz"
                    max="10"
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input>
                  <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResultAssignment}
                    placeholder="Assignment (Max 10)"
                    max="10"
                    name="studentResultAssignment"
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input>
                  <input
                    className="form-control w-200px mx-2"
                    type="number"
                    value={ch.studentResultAttendence}
                    placeholder="Attendence & Class Performance (Max 5)"
                    max="5"
                    name="studentResultAttendence"
                    onChange={(e) => handleResult(e, ch.studentStudentId)}
                  ></input>
                </div>
              ))}
            {checked !== undefined && checked.length !== 0 && (
              <input
                type="submit"
                value="Submit"
                className="btn btn-kolapata btn-lg mt-2 w-150px"
                onClick={performResultInsertion}
              ></input>
            )}
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
                      <th>Duration</th>
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
                        <td className="text-truncate">{data.duration}</td>
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
                </div>
                <div className="mb-3">
                  <label forhtml="date">Date</label>
                  <input
                    name="date"
                    type="date"
                    className="form-control flex-grow-1"
                    onChange={(e) => setDateOnChange(e)}
                  ></input>
                </div>
                <div className="mb-3">
                  <label forhtml="startTime">Time</label>
                  <input
                    name="startTime"
                    type="time"
                    className="form-control flex-grow-1"
                    onChange={(e) => setDateOnChange(e)}
                  ></input>
                </div>
                <div className="mb-3">
                  <label forhtml="duration">Duration (In Minute)</label>
                  <input
                    className="form-control flex-grow-1"
                    type="number"
                    max="3600"
                    min="0"
                    name="duration"
                    value={eventDate.duration}
                    onChange={(e) => setDateOnChange(e)}
                  ></input>
                </div>
                <input
                  name="id"
                  onChange={(e) => setDateOnChange(e)}
                  hidden
                ></input>
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
