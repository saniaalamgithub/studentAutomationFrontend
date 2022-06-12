import { useState } from "react";

function NewUserPage() {
  const [username, setUsername] = useState("");
  const [rollno, setRollno] = useState("");

  return (
    <div>
      <h1>registration</h1>
      <div id="uname">username</div>
      <input
        type="text"
        id="uname"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <div id="roll">roll no</div>
      <input
        type="number"
        id="roll"
        value={rollno}
        onChange={(e) => setRollno(e.target.value)}
      ></input>
      <div id="Dname">depaertment</div>
      <input
        type="text"
        id="Dname"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
    </div>
  );
}

export default NewUserPage;
