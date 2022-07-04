import { useState } from "react";
import "../../css/common.css";
import "../../css/errorpage.css";
import Switch from "react-switch";

function CommonErrorPage() {
  const [checked, setChecked] = useState(false);
  function handleChange(checked) {
    setChecked(checked);
  }

  return (
    <div className="full-screen bg-beige-gradient">
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div className="large-text">Error occured</div>
        <div className="xlarge-text">500</div>

        <p className="normal-text mt-1">Internal Server error</p>

        <p className="normal-text mt-2"> please try again after a while</p>
        
      </div>
    </div>
  );
}

export default CommonErrorPage;
