import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { UrbanDashboardContainer } from "./components/urbanDashboard";

const defaultZoomLocation = [-98.771556, 32.967243];
const defaultZoomLevel = 4;

function App() {
  return (
    <Fragment>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route
            path="/"
            element={
              <UrbanDashboardContainer
                defaultZoomLevel={defaultZoomLevel}
                defaultZoomLocation={defaultZoomLocation}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
