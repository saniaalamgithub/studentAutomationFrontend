 import { useState } from "react";

function GuardianRegistration() {
    const [name, setName] = useState("");
    const [pnumber,setPnumber] = useState("")
    return (
      <div>
        <div class="mb-3 mt-3">
          <label for="name">Guardian Name:</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="Enter your name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div class="mb-3 mt-3">
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    );
  }
  
  export default GuardianRegistration;
  