import { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";

function TeacherRegistration() {
  const [errorMsg, setErrorMsg] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [teacherData, setTeacherData] = useState({
    name: "",
    phoneNumber: "",
    designation: "",
    department: "",
    formFile: null
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

  const getDept = async () => {};

  const performTeacherInsertion = async (event) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'attachment; filename="' + "justAfile" + '"',
      "x-access-token": localStorage.getItem("token")
    };
    console.log(teacherData);
    await axiosApi
      .post("/teacher/create", teacherData, {
        headers: headers
      })
      .then(function (response) {
        console.log(response);
        if (response !== null) {
          setErrorMsg("");
          localStorage.setItem("active", true);
          navigate("/teacher");
        }
      })
      .catch(function (error) {
        setErrorMsg(error.message);
      });
  };

  const setTeacherDataOnChange = (e) => {
    let temp = JSON.parse(JSON.stringify(teacherData));
    if (e.target.name === "formFile") {
      console.log(e.target.files);
      temp.formFile = e.target.files[0];
      temp.fileName = e.target.files[0].name;
    } else {
      temp[e.target.name] = e.target.value;
    }
    setTeacherData(temp);
  };
  return (
    <div>
      <h2>Teacher Registration Page</h2>
      <div className="d-flex justify-content-end">
        <div className="mt-5 mb mx-5 w-500px">
          <div className="mt-3">
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
            <label forhtml="formFile" className="form-label">
              Photo(JPG/PNG only, max 50MB)
            </label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              name="formFile"
              onChange={setTeacherDataOnChange}
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
              {departmentList.map((data, i) => (
                <option value={data.id} key={i}>
                  {data.short_code}
                </option>
              ))}
            </select>
          </div>
          <div className="text-danger">{errorMsg}</div>
          <div className="my-3 d-flex justify-content-center">
            <input
              type="submit"
              value="Add"
              className="btn btn-primary px-5 text-white mx-2 text-center add_btn_position"
              onClick={performTeacherInsertion}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherRegistration;
