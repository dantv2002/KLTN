import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home";
import RecordsManagement from "./pages/patient/RecordsManagement";
import GoogleLogin from "./models/auth/GoogleLogin";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/oauth2/redirect' element={<GoogleLogin/>}/>
      <Route path='/records' element={<RecordsManagement/>}/>
    </Routes>
  );
};

export default App;
