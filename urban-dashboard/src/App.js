import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { UrbanDashboardContainer } from "./components/urbanDashboard";

const defaultZoomLocation = [-96.5, 39.0];
const defaultZoomLevel = 3.5;

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
