import LoginPage from "./page/LoginPage";
import AdminHomePage from "./page/Home/AdminHomePage";
import StudentHomePage from "./page/Home/StudentHomePage";
import TeacherHomePage from "./page/Home/TeacherHomePage";
import GuardianHomePage from "./page/Home/GuardianHomePage";
import CommonErrorPage from "./page/Error/CommonErrorPage";
import StudentRegistration from "./page/Registration/StudentRegistration";
import TeacherRegistration from "./page/Registration/TeacherRegistration";
import { Routes, Route } from "react-router-dom";

// import Registration from "./page/Test/Registration";
// import GuardianRegistration from "./page/Registration/GuardianRegistration";
// import NewUserPage from "./page/NewUserPage";
// import GuardianRegisterPage from "./page/Register/GuardianRegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/teacher/new" element={<TeacherRegistration />} />
      <Route path="/student/new" element={<StudentRegistration />} />

      <Route path="/student" element={<StudentHomePage />} />
      <Route path="/admin" element={<AdminHomePage />} />
      <Route path="/teacher" element={<TeacherHomePage />} />
      <Route path="/guardian" element={<GuardianHomePage />} />

      <Route path="/error" element={<CommonErrorPage />} />

      {/* <Route path="/test" element={<Registration />} /> */}
      {/* <Route path="/guardian/new" element={<GuardianRegistration />} /> */}
      {/* <Route path="/regi" element={<NewUserPage />} /> */}
      
      {/*<Route path="/guardian/create" element={<GuardianRegisterPage />} /> */}
    </Routes>
  );
}

export default App;
