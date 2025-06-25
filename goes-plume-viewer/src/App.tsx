import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { GoesInterface } from "./pages/goesInterface";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import "./App.css";

const BASE_PATH = process.env.PUBLIC_URL;
const defaultZoomLocation = [-98.771556, 32.967243];
const defaultZoomLevel = 4;
const defaultCollectionId = "goes-ch4plume-v1";
function App() {
  return (
    <Fragment>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <BrowserRouter basename={BASE_PATH}>
          <Routes>
            <Route
              path="/"
              element={
                <GoesInterface
                  defaultCollectionId={defaultCollectionId}
                  defaultZoomLocation={defaultZoomLocation}
                  defaultZoomLevel={defaultZoomLevel}
                />
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </Fragment>
  );
}

export default App;
