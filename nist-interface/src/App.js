import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { NistInterface, NistInterfaceContainer } from "./pages/nistInterface";
import "./App.css";

const BASE_PATH = process.env.PUBLIC_URL;
const defaultZoomLevel = 4;
function App() {
  return (
    <Fragment>
      <BrowserRouter basename={BASE_PATH}>
        <Routes>
          <Route
            path="/"
            element={
              <NistInterfaceContainer defaultZoomLevel={defaultZoomLevel} />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
