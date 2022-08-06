import { useState, useEffect } from "react";
import "../../css/common.css";
import "../../css/errorPage.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CommonErrorPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("active");
    navigate("/");
  }

  return (
    <div className="full-screen bg-beige-gradient">
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div className="large-text">Error occured</div>
        <div className="xlarge-text">
          {location.state.errCode === undefined
            ? "500"
            : location.state.errCode}
        </div>

        <p className="normal-text mt-1">
          {location.state.msg === undefined
            ? "Internal Server error"
            : location.state.msg}
        </p>

        {location.state.errCode === 401 && (
          <input
            type="button"
            value="Retry Login"
            className="btn btn-danger w-120px text-white ms-4 "
            onClick={doLogout}
          ></input>
        )}

        <p className="normal-text mt-2"> please try again after a while</p>
      </div>
    </div>
  );
}

export default CommonErrorPage;
