import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import { UrbanDashboard } from "./components/urbanDashboard";
const defaultZoomLocation = [-98.771556, 32.967243];
const defaultZoomLevel = 4;
function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route
            path="/"
            element={
              <UrbanDashboard
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
