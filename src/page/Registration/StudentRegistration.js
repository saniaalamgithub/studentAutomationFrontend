import { useState } from "react";

function StudentRegistration() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pnumber, setPnumber] = useState("");

  return (
    <div >
        <h2>Student Registration Page</h2>
      <div className="mt-5 mb mx-5">
        <div class="mb-3 mt-3">
          <label for="name">Student name:</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="Enter name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div class="mb-3 mt-3">
          <label for="ID"> University ID:</label>
          <input
            type="number"
            class="form-control"
            id="ID"
            placeholder="Enter University ID"
            name="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
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
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </div>
    </div>
  );
}

export default StudentRegistration;
