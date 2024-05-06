import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home";
import RecordsManagement from "./pages/patient/RecordsManagement";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/records' element={<RecordsManagement/>}/>
    </Routes>
  );
};

export default App;
