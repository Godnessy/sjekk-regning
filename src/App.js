import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Error from "./Pages/Error";
import PrivateRoute from "./Components/PrivateRoute";
import ForgotPassword from "./Components/ForgotPassword";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
/*TODO
Backend:
- Get a list of all the kommunes and add them to the DB with the area code for each. - 
- Every day import data from API 
- Parse the data into this format:
- Check which month this data is for then add it:
Day:
Hour: Price
Day: 
Hour: Price

- POST into the correct month, if the month does not exist create it.

Frontend:
- Get CSV from client --
- Parse the CSV into a format that I can work with 
 - create a search of all kommunes and return an area code, save that area code to a var -- 
- GET the relevant month out of the DB
- Cross the info from the parsed CSV and the DB 
- Calculate price for every hour of every day and save the results into a new object
- Display the output into the UI with the design made earlier
- Add a "send til Epost med PDF" and "Download PDF" button
-

*/
