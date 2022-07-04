import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/common.css";
import "../../css/studentPage.css"

function StudentRegisterPage() {
  const navigate = useNavigate();
  return (
    <div className="full-screen g-page-bg d-flex justify-content-end me-5">
      <div className="w-500px p-5">
        <h1>Student registration</h1>
        <div className="mb-3 mt-3">
          <label forhtml="sname">Student Name :</label>
          <input
            type="text"
            className="form-control"
            id="sname"
            placeholder="Enter name"
            name="sname"
          />
        </div>
        <div className="mb-3 mt-3">
          <label forhtml="pnum">Phone number:</label>
          <input
            type="number"
            className="form-control"
            id="pnum"
            placeholder="Enter number"
            name="pnum"
          />
        </div>
        <div className="mb-3 mt-3">
          <label forhtml="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            name="email"
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
          />
        </div>
        <div className="mb-3 mt-3">
          <label forhtml="wname">Son/Daughter/Ward student id:</label>
          <input
            type="number"
            className="form-control"
            id="wname"
            placeholder="Enter email"
            name="wname"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentRegisterPage;
