// import { useState } from "react";

import { useState } from "react";

function TeacherRegistration() {
    const[tname,setTname] = useState(" ")
    const [pnumber,setPnumber] = useState(" ")
    const [designation,setDesignation] = useState(" ")
    return (
      <div>
         <div className="mb-3 mt-3">
          <label for="tname">Enter Name:</label>
          <input
            type="text"
            class="form-control"
            id="tname"
            placeholder="Enter our name"
            name="tname"
            value={tname}
            onChange={(e) => setTname(e.target.value)}
          ></input>
        </div>
        <div className="mb-3 mt-3">
          <label for="pnumeber">Phone Number:</label>
          <input
            type="number"
            class="form-control"
            id="pnumber"
            placeholder="Enter phone number"
            name="pnumber"
            value={pnumber}
            onChange={(e) => setPnumber(e.target.value)}
          ></input>
        </div>
        <div>
          <label for="designation">Designation:</label>
          <input
            type="text"
            class="form-control"
            id="designation"
            placeholder="Enter your designation"
            name="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          ></input>
        </div>
      </div>
    );
  }
  
  export default TeacherRegistration;