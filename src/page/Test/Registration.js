import { useState } from "react";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <div class="mb-3 mt-3">
        <label for="email">Email:</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>
      <div class="mb-3 mt-3">
        <label for="password">password:</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <p>ypor email is:{email},and password is {password}</p>
    </div>
  );
}

export default Registration;
