import { useState, useEffect, useRef } from "react";
import "../../css/common.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import moment from "moment";
import { Modal, Button, Table } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);
const events = [
  {
    id: 1,
    title: "aaa",
    allDay: false,
    start: new Date(2022, 11, 1),
    end: new Date(2022, 11, 1),
    eventType: "normal"
  }
];

function StudentHomePage() {
  const [currentCourseTakenData, setCurrentCourseTakenData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [currentActionId, setCurrentActionId] = useState(0);
  const [checked, setChecked] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);
  const [complainData, setComplainData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [eventRole, setEventRole] = useState("");

  const [eventIdEditing, setEventIdEditing] = useState(0);
  const [noticeIdEditing, setNoticeIdEditing] = useState(0);
  const [complainIdEditing, setComplainIdEditing] = useState(0);

  const [myEvents, setMyEvents] = useState(events);

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

  const [messageContentData, setMessageContentData] = useState("");
  const [filePathMessageData, setFilePathMessageData] = useState({
    fileName: "",
    attachment: null
  });

  const eventList = ["QUIZ", "MID", "FINAL", "ASSIGNMENT", "PRESENTATION"];
  const sideMenu = ["Discussion", "Notice", "Complain"];
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

  function getCalculatedResult(result, isCgpa) {
    let totalGpa = 0;
    let totalCredit = 0;
    for (let i = 0; i < result.length; i++) {
      if (isCgpa) {
        let gpa = Number(result[i].grade) * Number(result[i].course?.credit);
        totalGpa = totalGpa + gpa;
      }

      totalCredit = totalCredit + result[i].course?.credit;
    }
    return isCgpa ? totalGpa / totalCredit : totalCredit;
  }

  useEffect(() => {
    axiosApi
      .post("/student", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        if (response !== null) {
          setStudentData(response.data.data.student);

          //add events to calender
          let events = [];
          let attendenceDataTemp = [];
          let i = 0;
          response.data.data.student.course_takens.forEach((element) => {
            element.section?.class_events?.forEach((innerElement) => {
              let oneEvent = {};
              oneEvent.id = i;
              oneEvent.hexColor = "#dc3545";
              oneEvent.title =
                element.section?.course?.name + " (" + innerElement.role + " )";
              oneEvent.allDay = innerElement.duration ? false : true;
              let tempStart = moment(innerElement.date);
              let tempEnd = moment(innerElement.date).add(
                innerElement.duration,
                "minutes"
              );
              oneEvent.start = new Date(
                tempStart.year(),
                tempStart.month(),
                tempStart.date(),
                tempStart.hours(),
                tempStart.minutes(),
                0
              );
              oneEvent.end = new Date(
                tempEnd.year(),
                tempEnd.month(),
                tempEnd.date(),
                tempEnd.hours(),
                tempEnd.minutes(),
                0
              );
              events.push(oneEvent);
              i++;
            });
            let startTime = moment(element.section?.timeslot?.start_time);
            let endTime = moment(element.section?.timeslot?.end_time);
            for (let index = 0; index < 120; index++) {
              // add class for upto 4 months
              const tempDay = moment().add(index, "day").endOf("day");
              if (
                (element.section?.timeslot.day === "SUNDAY" &&
                  tempDay.weekday() === 0) ||
                (element.section?.timeslot.day === "MONDAY-WEDNESDAY" &&
                  (tempDay.weekday() === 1 || tempDay.weekday() === 3)) ||
                (element.section?.timeslot.day === "SUNDAY-MONDAY" &&
                  (tempDay.weekday() === 0 || tempDay.weekday() === 1))
              ) {
                let oneEvent = {};
                oneEvent.id = i;
                oneEvent.hexColor = "#5A90BD";
                oneEvent.title = element.section?.course?.name + " ( Class )";
                oneEvent.allDay = false;
                oneEvent.start = new Date(
                  tempDay.year(),
                  tempDay.month(),
                  tempDay.date(),
                  startTime.hours(),
                  startTime.minutes(),
                  0
                );
                oneEvent.end = new Date(
                  tempDay.year(),
                  tempDay.month(),
                  tempDay.date(),
                  endTime.hours(),
                  endTime.minutes(),
                  0
                );
                events.push(oneEvent);
                i++;
              }
            }

            //Add Attendence

            let temp = {};
            temp.sectionSectionId = element.section?.section_id;
            let totalClass = 0;
            let totalAttendence = 0;
            element.section?.attendences.forEach((innerElement) => {
              if (
                innerElement.studentStudentId ===
                response.data.data.student.student_id
              ) {
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
          console.log(attendenceDataTemp);
          setAttendenceData(attendenceDataTemp);

          setMyEvents(events);

          //addAttendence
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
    if (sectionId === 0) {
      setCurrentCourseTakenData({});
      // show own info
    } else {
      setSectionOnBtnClick(sectionId);
      // await getAttendenceFromApi(sectionId);
      // await getEventFromApi(sectionId);
      await getNoticeFromApi(sectionId);
      await getComplainFromApi(sectionId);
      await getMessageFromApi(sectionId);
    }
  };

  const setSectionOnBtnClick = (sectionId) => {
    let cSection;
    studentData.course_takens.forEach((data) => {
      if (data.section?.section_id === sectionId) {
        cSection = data;
        setCurrentCourseTakenData(cSection);
      }
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
    let studentList = [];
    studentList.push(studentData.student_id);

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

  const setMessageAttachmentOnChange = (e) => {
    let temp = {};
    temp.attachment = e.target.files[0];
    temp.fileName = e.target.files[0].name;
    setFilePathMessageData(temp);
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

  const performMessageInsertion = async () => {
    if (messageContentData.trim() === "") {
      setUpdateStatus("Please type a message");
      setShowModal(true);
    } else {
      const headers = {
        "Content-Type": "multipart/form-data",
        "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
        "x-access-token": localStorage.getItem("token")
      };
      let temp = {};
      temp.fileName = filePathMessageData.fileName;
      temp.formFile = filePathMessageData.attachment;
      temp.content = messageContentData;
      temp.sectionSectionId = currentCourseTakenData.section?.section_id;
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
            getMessageFromApi(currentCourseTakenData.section?.section_id);
          }
        })
        .catch(function (error) {
          console.log("->", error);
          setUpdateStatus(error.message);
          setShowModal(true);
        });
    }
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

  const getAttendenceForSection = (secId, getType) => {
    let z = attendenceData.filter((data) => data.sectionSectionId === secId);
    if (getType === 1) {
      return z[0].attendencePercentage;
    } else if (getType === 2) {
      return z[0].totalClass;
    }
    if (getType === 3) {
      return z[0].totalAttended;
    }
  };

  return (
    <div className="full-screen d-flex flex-column">
      {/* Top Navigation Bar */}
      <div className="d-flex justify-content-between px-4 py-2 bg-greenish-gradient bottom-border-gray">
        <div className="flex-fill d-flex">
          <input
            type="button"
            value="Own Information"
            className="btn btn-success pd-2 text-white mx-2 button-active"
            onClick={() => handleOptionButtonClick(0)}
          ></input>
          {studentData !== {} &&
            studentData.course_takens !== undefined &&
            studentData.course_takens.map((data, i) => (
              <input
                type="button"
                key={i}
                value={
                  data.section?.course.name +
                  " (" +
                  data.section?.section_name +
                  ") "
                }
                className="btn btn-success pd-2 text-white mx-2 button-active"
                onClick={() =>
                  handleOptionButtonClick(data.section?.section_id)
                }
              ></input>
            ))}
        </div>
        {(studentData.course_takens === undefined ||
          studentData.course_takens === null ||
          studentData.course_takens.length === 0) && (
          <input
            type="button"
            value="Add Course"
            className="btn btn-secondary w-120px text-white ms-4 "
            onClick={() => navigate("/course")}
          />
        )}
        <input
          type="button"
          value="Logout"
          className="btn btn-danger w-120px text-white ms-4 "
          onClick={doLogout}
        ></input>
      </div>

      <div
        className={
          Object.keys(currentCourseTakenData).length !== 0
            ? "flex-fill d-flex"
            : "d-none"
        }
      >
        {/* Left Navigation Bar */}
        <div
          className={
            Object.keys(currentCourseTakenData).length !== 0
              ? "border d-flex flex-column bg-secondary pt-4"
              : "op-0 h-0px"
          }
        >
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
                        studentData.user?.user_id === data.user?.user_id
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
                          studentData.user?.user_id === data.user?.user_id
                            ? "text-white rounded-custom-right bg-primary p-2"
                            : data.user?.teacher
                            ? "text-white rounded-custom-left bg-danger p-2"
                            : "text-white rounded-custom-left bg-secondary p-2"
                        }
                      >
                        {studentData.user?.user_id !== data.user?.user_id && (
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

        {currentActionId === 1 && (
          <div className="w-100 p-3">
            <h4>Notice List</h4>
            <div className="row p-2">
              <div className={noticeData.length === 0 ? "op-0 h-0px" : "trans"}>
                <table className="table table-striped overflow-auto">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th>Title</th>
                      <th className="">Details</th>
                      <th>File</th>
                      <th>Created By</th>
                      <th>For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noticeData?.map((data, i) => (
                      <tr className="mb-1" key={i}>
                        <td className="text-truncate">{i + 1}</td>
                        <td className="">{data.title}</td>
                        <td className="">{data.content}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentActionId === 2 && (
          <div className="w-100 p-3">
            <h4>Complain List</h4>
            <div className="row p-2">
              <div
                className={complainData.length === 0 ? "op-0 h-0px" : "trans"}
              >
                <table className="table table-striped overflow-auto">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th className="">Content</th>
                      <th>By</th>
                      <th>For</th>
                      <th>Date</th>
                      <th>Notify Parent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complainData?.map((data, i) => (
                      <tr className="mb-1" key={i}>
                        <td className="text-truncate">{i + 1}</td>
                        <td className="">{data.content}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className={
          Object.keys(currentCourseTakenData).length === 0
            ? "flex-fill d-flex trans p-3"
            : "d-none h-0px"
        }
      >
        <div className="col-sm-6 px-2">
          <h2>Student Info</h2>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th className="w-250px">Name</th>
                <td>
                  {studentData === undefined ? "------" : studentData.name}
                </td>
              </tr>
              <tr>
                <th className="w-250px">ID</th>
                <td>
                  {studentData.university_student_id === undefined
                    ? "------"
                    : studentData.university_student_id}
                </td>
              </tr>
              <tr>
                <th className="w-250px">Phone Number</th>
                <td>
                  {studentData.phone_number === undefined
                    ? "------"
                    : studentData.phone_number}
                </td>
              </tr>
              <tr>
                <th className="w-250px">Department</th>
                <td>
                  {studentData.department === undefined ||
                  studentData.department?.name === undefined
                    ? "------"
                    : studentData.department?.name}
                </td>
              </tr>

              <tr>
                <th className="w-250px">Joinning semester</th>
                <td>
                  {studentData.semester === undefined
                    ? "------"
                    : studentData.semester?.name +
                      " " +
                      studentData.semester?.year}
                </td>
              </tr>
              <tr>
                <th className="w-250px">Total Completed Credit</th>
                <td>
                  {studentData.results === undefined ||
                  studentData.results.length === 0
                    ? "------"
                    : getCalculatedResult(studentData.results, false)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Current CGPA</strong>
                </td>
                <td>
                  {studentData.results === undefined ||
                  studentData.results?.length === 0
                    ? "------"
                    : getCalculatedResult(studentData.results, true).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Current Courses</strong>
                </td>
                <td>
                  <ol>
                    {studentData.course_takens?.map((data, i) => (
                      <li key={i}>
                        {data.section?.course?.name} ( Section:
                        {data.section?.section_name}, Class Taken By:{" "}
                        {data.section?.teacher?.name})
                      </li>
                    ))}
                  </ol>
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
                      {studentData.course_takens?.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {data.section?.course?.short_code} (
                            {data.section?.section_name})
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
              <tr>
                <th className="w-250px">All Previous Result</th>
                <td>
                  <ol>
                    {studentData.results?.map((data, i) => (
                      <li key={i}>
                        {data.course?.name} ( Credit:
                        {data.course?.credit}, Earned GPA:
                        {data.grade})
                      </li>
                    ))}
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-sm-6 px-2">
          <div className="m-6">
            <h1 className="text-center py-2 bg-beige-gradient-dark  rounded ">
              My Calender
            </h1>
          </div>
          <Calendar
            localizer={localizer}
            events={myEvents}
            style={{ height: 635 }}
            eventPropGetter={(event, start, end, isSelected) => {
              var backgroundColor = event.hexColor;
              var style = {
                backgroundColor: backgroundColor,
                borderRadius: "0px",
                opacity: 0.8,
                color: "white",
                border: "0px",
                display: "block"
              };
              return {
                style: style
              };
            }}
          />
        </div>
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

export default StudentHomePage;
