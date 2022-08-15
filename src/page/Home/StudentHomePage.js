import { useState, useEffect } from "react";
import "../../css/common.css";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);
const events = [
  {
    id: 1,
    title: "aaa",
    allDay: false,
    start: new Date(2022, 11, 1),
    end: new Date(2022, 11, 1)
  },
  {
    id: 2,
    title: "bbb",
    allDay: false,
    start: new Date(2022, 11, 1),
    end: new Date(2022, 11, 1)
  }
];

function StudentHomePage() {
  const [currentSectionData, setCurrentSectionData] = useState({});
  const [studentData, setStudentData] = useState({});
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
  const handleClose = () => setShowModal(false);

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

  useEffect(() => {
    axiosApi
      .post("/student", {
        token: localStorage.getItem("token")
      })
      .then(function (response) {
        if (response !== null) {
          setStudentData(response.data.data.student);
          let events = [];
          let i = 0;
          response.data.data.student.course_takens.forEach((element) => {
            console.log(element);
            element.section?.class_events?.forEach((innerElement) => {
              let oneEvent = {};
              oneEvent.id = i;
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
              console.log(events);
            });
          });
          setMyEvents(events);
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
      setCurrentSectionData({});
      // show own info
    } else {
      setSectionOnBtnClick(sectionId);
      // await getAttendenceFromApi(sectionId);
      // await getEventFromApi(sectionId);
      await getNoticeFromApi(sectionId);
      await getComplainFromApi(sectionId);
      // await getMessageFromApi(sectionId);
    }
  };

  const setSectionOnBtnClick = (sectionId) => {
    let cSection;
    studentData.course_takens.forEach((data) => {
      if (data.section?.section_id === sectionId) {
        cSection = data;
        setCurrentSectionData(cSection);
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
            : "op-0 h-0px"
        }
      >
        {/* Left Navigation Bar */}
        <div
          className={
            Object.keys(currentSectionData).length !== 0
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
          Object.keys(currentSectionData).length === 0
            ? "flex-fill d-flex trans p-3"
            : "op-0 h-0px"
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
                <th className="w-250px">Total completed credit</th>
                <td>
                  {studentData.results === undefined ||
                  studentData.results.length === 0
                    ? "------"
                    : getCalculatedResult(studentData.results, false)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>current cgpa</strong>
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
            style={{ height: 500 }}
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
